<?php

namespace App\Repositories;

use App\Models\Graduate;
use Illuminate\Pagination\LengthAwarePaginator;

class GraduateRepository
{
    /**
     * Get all graduates with optional filters
     */
    public function all(array $filters = []): LengthAwarePaginator
    {
        $query = Graduate::query();

        // Filter by department
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // Filter by batch year
        if (!empty($filters['batch_year'])) {
            $query->where('batch_year', $filters['batch_year']);
        }

        // Filter by block
        if (!empty($filters['block'])) {
            $query->where('block', 'like', "%{$filters['block']}%");
        }

        // Search by name or student number
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('student_number', 'like', "%{$search}%");
            });
        }

        return $query->with('department')->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Find graduate by ID
     */
    public function find(int $id): ?Graduate
    {
        return Graduate::find($id);
    }

    /**
     * Find graduate by student number
     */
    public function findByStudentNumber(string $studentNumber): ?Graduate
    {
        return Graduate::where('student_number', $studentNumber)->first();
    }

    /**
     * Create a new graduate
     */
    public function create(array $data): Graduate
    {
        return Graduate::create($data);
    }

    /**
     * Update graduate
     */
    public function update(Graduate $graduate, array $data): Graduate
    {
        $graduate->update($data);
        return $graduate;
    }

    /**
     * Delete graduate
     */
    public function delete(Graduate $graduate): bool
    {
        return $graduate->delete();
    }
}
