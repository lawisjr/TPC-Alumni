<?php

namespace App\Http\Requests;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateDepartmentAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSuperAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'department_id' => [
                'required',
                'exists:departments,id',
                Rule::when(
                    $this->filled('department_id'),
                    [function (string $attribute, mixed $value, \Closure $fail) {
                        $hasActiveHead = User::query()
                            ->where('department_id', $value)
                            ->where('role', User::ROLE_ADMIN)
                            ->where('status', User::STATUS_ACTIVE)
                            ->exists();

                        if ($hasActiveHead) {
                            $fail('This department already has an active department head.');
                        }
                    }],
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.exists' => 'Selected department does not exist.',
        ];
    }
}