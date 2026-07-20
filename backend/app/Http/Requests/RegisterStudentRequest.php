<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'department_id' => 'required|exists:departments,id',
            'school_id' => 'required|string|max:50|unique:users,school_id',
        ];
    }

    public function messages(): array
    {
        return [
            'school_id.unique' => 'This student ID has already been registered, did you forget your password?',
        ];
    }
}
