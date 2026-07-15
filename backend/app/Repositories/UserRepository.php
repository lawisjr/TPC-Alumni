<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function query(): Builder
    {
        return User::query();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function students(): Builder
    {
        return User::students();
    }

    public function admins(): Builder
    {
        return User::admins();
    }

    public function superAdmins(): Builder
    {
        return User::superAdmins();
    }

    public function visibleTo(User $actor): Builder
    {
        return User::visibleTo($actor);
    }

    public function findStudent(int $id): ?User
    {
        return User::students()->find($id);
    }
}
