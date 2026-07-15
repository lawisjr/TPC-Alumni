<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isSuperAdmin() || auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'event_date' => ['sometimes', 'date_format:Y-m-d H:i', 'after:now'],
            'location' => ['nullable', 'string', 'max:255'],
            'scope' => ['sometimes', 'in:school_wide,department_specific'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'event_date.after' => 'Event date must be in the future',
            'scope.in' => 'Invalid scope value',
        ];
    }
}
