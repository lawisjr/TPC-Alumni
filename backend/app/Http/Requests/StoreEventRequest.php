<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isSuperAdmin() || auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'event_date' => ['required', 'date_format:Y-m-d H:i', 'after:now'],
            'location' => ['nullable', 'string', 'max:255'],
            'scope' => ['required', 'in:school_wide,department_specific'],
            'department_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Event title is required',
            'event_date.after' => 'Event date must be in the future',
            'scope.in' => 'Invalid scope value',
        ];
    }
}
