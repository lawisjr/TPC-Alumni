---

## ⚙️ Backend Architecture — Repository Pattern (Strict)

### Request Flow — Always Follow This Exact Order
Request → Controller → FormRequest → Service → Repository → Model → Database

### Never Skip Layers
- Controllers NEVER talk to Repository directly
- Controllers NEVER talk to Model directly
- Services NEVER talk to Database directly
- Repositories are the ONLY layer that touches Models
- Never write Eloquent queries outside of Repository classes

---

## 📁 Backend Folder Structure

backend/
└── app/
├── Http/
│ ├── Controllers/
│ │ └── Api/
│ │ └── V1/ # Version your API
│ │ ├── OrderController.php
│ │ ├── CustomerController.php
│ │ └── AuthController.php
│ ├── Requests/
│ │ ├── Order/
│ │ │ ├── StoreOrderRequest.php
│ │ │ └── UpdateOrderRequest.php
│ │ └── Customer/
│ │ ├── StoreCustomerRequest.php
│ │ └── UpdateCustomerRequest.php
│ └── Resources/
│ ├── OrderResource.php
│ ├── OrderCollection.php
│ └── CustomerResource.php
│
├── Services/
│ ├── Interfaces/
│ │ ├── OrderServiceInterface.php
│ │ └── CustomerServiceInterface.php
│ ├── OrderService.php
│ └── CustomerService.php
│
├── Repositories/
│ ├── Interfaces/
│ │ ├── OrderRepositoryInterface.php
│ │ └── CustomerRepositoryInterface.php
│ ├── BaseRepository.php
│ ├── OrderRepository.php
│ └── CustomerRepository.php
│
├── Models/
│ ├── Order.php
│ ├── Customer.php
│ ├── OrderItem.php
│ ├── BookType.php
│ ├── Material.php
│ ├── BindingStyle.php
│ ├── Staff.php
│ ├── Invoice.php
│ └── Notification.php
│
└── Providers/
└── RepositoryServiceProvider.php # Binds interfaces to implementations

---

## 📝 Each Layer — Rules and Responsibilities

### 1. Controller

- Receives HTTP request
- Calls FormRequest for validation (automatic via type hint)
- Calls ONE Service method only
- Returns API Resource response
- Never contains business logic
- Never contains database queries
- Always wrapped in try/catch

```php
// CORRECT ✅
class OrderController extends Controller
{
    public function __construct(
        private OrderServiceInterface $orderService
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->createOrder($request->validated());
            return response()->json([
                'status'  => true,
                'message' => 'Order created successfully',
                'data'    => new OrderResource($order),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
```

---

### 2. Form Request

- Handles ALL validation logic
- Handles authorization
- Never contains business logic
- Returns validated data via validated()

```php
// CORRECT ✅
class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id'        => 'required|exists:customers,id',
            'book_type_id'       => 'required|exists:book_types,id',
            'binding_style_id'   => 'required|exists:binding_styles,id',
            'material_id'        => 'required|exists:materials,id',
            'quantity'           => 'required|integer|min:1',
            'due_date'           => 'required|date|after:today',
            'notes'              => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.exists' => 'Customer not found.',
            'due_date.after'     => 'Due date must be a future date.',
        ];
    }
}
```

---

### 3. Service

- Contains ALL business logic
- Orchestrates multiple repository calls
- Handles transactions for multi-step operations
- Never touches Eloquent or DB directly
- Always uses Repository interfaces (not implementations)

```php
// CORRECT ✅
class OrderService implements OrderServiceInterface
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private MaterialRepositoryInterface $materialRepository,
    ) {}

    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Business logic here
            $this->materialRepository->decreaseStock(
                $data['material_id'],
                $data['quantity']
            );

            $order = $this->orderRepository->create($data);

            $this->orderRepository->assignStaff($order->id);

            return $order;
        });
    }
}
```

---

### 4. Repository

- The ONLY place Eloquent queries are written
- Implements its interface
- No business logic whatsoever
- Extends BaseRepository for common CRUD
- Each method does one focused database operation

```php
// BaseRepository — shared CRUD for all repositories
class BaseRepository
{
    public function __construct(protected Model $model) {}

    public function all(): Collection        { return $this->model->all(); }
    public function find(int $id): ?Model    { return $this->model->findOrFail($id); }
    public function create(array $data): Model { return $this->model->create($data); }
    public function update(int $id, array $data): Model
    {
        $record = $this->find($id);
        $record->update($data);
        return $record->fresh();
    }
    public function delete(int $id): bool    { return $this->find($id)->delete(); }
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->latest()->paginate($perPage);
    }
}

// CORRECT ✅ — OrderRepository only has Order-specific queries
class OrderRepository extends BaseRepository
    implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function findByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->latest()->get();
    }

    public function findByCustomer(int $customerId): Collection
    {
        return $this->model
            ->where('customer_id', $customerId)
            ->with(['orderItems', 'invoice'])
            ->latest()
            ->get();
    }

    public function updateStatus(int $id, string $status): Order
    {
        $order = $this->find($id);
        $order->update(['status' => $status]);
        return $order->fresh();
    }
}
```

---

### 5. Model

- Defines fillable, casts, relationships only
- No business logic
- No query scopes that belong in Repository
- Always uses SoftDeletes

```php
// CORRECT ✅
class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_id', 'status', 'notes',
        'due_date', 'total_price',
    ];

    protected $casts = [
        'due_date'    => 'date',
        'total_price' => 'decimal:2',
    ];

    // Relationships only
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
```

---

### 6. RepositoryServiceProvider

- Binds every interface to its implementation
- Must be registered in config/app.php providers array

```php
// CORRECT ✅
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Add every binding here when creating a new repository
        $this->app->bind(
            OrderRepositoryInterface::class,
            OrderRepository::class
        );
        $this->app->bind(
            CustomerRepositoryInterface::class,
            CustomerRepository::class
        );
        $this->app->bind(
            OrderServiceInterface::class,
            OrderService::class
        );
        $this->app->bind(
            CustomerServiceInterface::class,
            CustomerService::class
        );
    }
}
```

---

## ✅ When Creating Any New Feature — Always Generate All Of These

1. Migration
2. Model (fillable, casts, relationships)
3. RepositoryInterface (in Repositories/Interfaces/)
4. Repository (extends BaseRepository)
5. ServiceInterface (in Services/Interfaces/)
6. Service (implements ServiceInterface)
7. FormRequest/s (Store + Update)
8. API Resource
9. Controller
10. Routes in api.php (versioned under /api/v1/)
11. Bind both interfaces in RepositoryServiceProvider

## ❌ These Are Always Wrong — Never Do These

- Eloquent query inside a Controller
- Eloquent query inside a Service
- Business logic inside a Controller
- Business logic inside a Repository
- Skipping FormRequest and validating in Controller
- Using Repository implementation directly instead of its Interface
- Forgetting to bind new interfaces in RepositoryServiceProvider
