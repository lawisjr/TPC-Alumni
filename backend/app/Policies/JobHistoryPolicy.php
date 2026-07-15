<?php

namespace App\Policies;

use App\Models\JobHistory;
use App\Models\User;

class JobHistoryPolicy
{
    public function view(User $user, JobHistory $jobHistory): bool
    {
        return $jobHistory->user_id === $user->id || $user->isSuperAdmin();
    }

    public function update(User $user, JobHistory $jobHistory): bool
    {
        return $jobHistory->user_id === $user->id || $user->isSuperAdmin();
    }

    public function delete(User $user, JobHistory $jobHistory): bool
    {
        return $jobHistory->user_id === $user->id || $user->isSuperAdmin();
    }
}
