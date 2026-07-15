<?php

namespace App\Repositories;

use App\Models\JobHistory;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class JobHistoryRepository
{
    public function allForUser(User $user): LengthAwarePaginator
    {
        return JobHistory::where('user_id', $user->id)
            ->orderBy('is_current', 'desc')
            ->orderBy('start_date', 'desc')
            ->paginate(15);
    }

    public function find(int $id): ?JobHistory
    {
        return JobHistory::find($id);
    }

    public function create(array $data): JobHistory
    {
        return JobHistory::create($data);
    }

    public function update(JobHistory $jobHistory, array $data): JobHistory
    {
        $jobHistory->update($data);

        return $jobHistory;
    }

    public function delete(JobHistory $jobHistory): bool
    {
        return $jobHistory->delete();
    }
}
