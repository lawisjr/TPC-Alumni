<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\DepartmentRepository;

class DepartmentService
{
    public function __construct(protected DepartmentRepository $departments)
    {
    }

    public function all()
    {
        return $this->departments->all();
    }

    public function create(array $data): Department
    {
        return $this->departments->create($data);
    }

    public function update(Department $department, array $data): Department
    {
        return $this->departments->update($department, $data);
    }

    public function delete(Department $department): void
    {
        $this->departments->delete($department);
    }
}
