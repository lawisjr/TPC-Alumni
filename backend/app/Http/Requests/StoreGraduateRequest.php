<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGraduateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isSuperAdmin() || auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'department_id' => [
                Rule::requiredIf(auth()->user()->isSuperAdmin()),
                'nullable',
                'exists:departments,id',
            ],
            'student_number' => ['required', 'string', 'unique:graduates,student_number'],
            'name' => ['required', 'string', 'max:255'],
            'batch_year' => ['required', 'string', 'regex:/^\d{4}(-\d{4})?$/'],
            'block' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required' => 'Department is required',
            'student_number.unique' => 'Student number already exists',
            'batch_year.regex' => 'Batch year must be in YYYY or YYYY-YYYY format (e.g. 2026 or 2026-2027)',
        ];
    }
}