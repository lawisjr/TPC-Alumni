---
name: api-resources
description: Generate a complete Laravel CRUD setup including Model, Migration, Controller, API Resource, and Routes. Use this when creating a new feature, table, or endpoint for the backend API.
---

## Laravel API Resource Generator

When asked to create a new API resource, always generate ALL of the following in order:

### 1. Migration
```php
Schema::create('table_name', function (Blueprint $table) {
    $table->id();
    $table->string('field')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

### 2. Model
- Always include `$fillable`
- Always add `use SoftDeletes`
- Define relationships if mentioned

### 3. Controller (API)
- Extend `Controller`
- Methods: `index`, `store`, `show`, `update`, `destroy`
- Always wrap in `try/catch`
- Return responses using the Resource class

### 4. API Resource
Always return this standard shape:
```php
return response()->json([
    'status' => true,
    'message' => 'Success',
    'data' => new ExampleResource($model),
]);
```

### 5. Routes (api.php)
```php
Route::apiResource('resource-name', ResourceController::class)
    ->middleware('auth:sanctum');
```

## Rules
- Use Laravel Sanctum for auth middleware
- Always use soft deletes
- Validate all inputs using Form Request classes
- Never return raw Eloquent models, always use Resource classes
- Follow naming: `snake_case` for DB columns, `camelCase` in JSON responses
