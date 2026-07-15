<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkAlignmentRequest extends FormRequest
{
    /**
     * Only employed/self-employed alumni can submit this.
     * Unemployed alumni have no job to align — block them at the gate.
     */
    public function authorize(): bool
    {
        $profile = $this->user()->alumniProfile;

        if (! $profile) {
            return false;
        }

        return in_array($profile->employment_status, [
            \App\Models\AlumniProfile::STATUS_EMPLOYED,
            \App\Models\AlumniProfile::STATUS_SELF_EMPLOYED,
        ]);
    }

    public function rules(): array
    {
        return [
            // Required yes/no answer — must be explicit boolean
            'is_work_aligned'     => ['required', 'boolean'],

            // Optional elaboration — capped at 500 chars to match the column
            'work_aligned_reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'is_work_aligned.required' => 'Please indicate whether your job is aligned with your course.',
            'is_work_aligned.boolean'  => 'The alignment answer must be yes or no.',
            'work_aligned_reason.max'  => 'The reason may not exceed 500 characters.',
        ];
    }
}