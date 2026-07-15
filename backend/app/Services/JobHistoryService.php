<?php

namespace App\Services;

use App\Models\JobHistory;
use App\Models\AlumniProfile;
use App\Models\User;
use App\Repositories\JobHistoryRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class JobHistoryService
{
    protected JobHistoryRepository $jobHistoryRepository;

    public function __construct(JobHistoryRepository $jobHistoryRepository)
    {
        $this->jobHistoryRepository = $jobHistoryRepository;
    }

    public function getForUser(User $user): LengthAwarePaginator
    {
        return $this->jobHistoryRepository->allForUser($user);
    }

    public function findById(int $id): ?JobHistory
    {
        return $this->jobHistoryRepository->find($id);
    }

    public function create(User $user, array $data): JobHistory
    {
        return DB::transaction(function () use ($user, $data) {
            $data['user_id'] = $user->id;
            $data['is_current'] = $data['is_current'] ?? false;

            if ($data['is_current']) {
                JobHistory::where('user_id', $user->id)
                    ->update(['is_current' => false]);
            }

            $jobHistory = $this->jobHistoryRepository->create($data);

            $this->syncAlumniEmploymentStatus($user); // <-- add

            return $jobHistory;
        });
    }

    public function update(JobHistory $jobHistory, User $user, array $data): JobHistory
    {
        return DB::transaction(function () use ($jobHistory, $user, $data) {
            if (array_key_exists('is_current', $data) && $data['is_current']) {
                JobHistory::where('user_id', $user->id)
                    ->where('id', '!=', $jobHistory->id)
                    ->update(['is_current' => false]);
            }

            $updated = $this->jobHistoryRepository->update($jobHistory, $data);

            $this->syncAlumniEmploymentStatus($user); // <-- add

            return $updated;
        });
    }

    public function delete(JobHistory $jobHistory): bool
    {
        return DB::transaction(function () use ($jobHistory) {
            $user = $jobHistory->user;

            $result = $this->jobHistoryRepository->delete($jobHistory);

            $this->syncAlumniEmploymentStatus($user); // <-- add

            return $result;
        });
    }

    // ------------------------------------------------------------------

   private function syncAlumniEmploymentStatus(User $user): void
{
    $alumni = AlumniProfile::where('user_id', $user->id)->first();

    if (! $alumni) {
        return;
    }

    $currentJob = JobHistory::where('user_id', $user->id)
        ->where('is_current', true)
        ->latest('start_date')
        ->first();

    $hasAnyHistory = JobHistory::where('user_id', $user->id)->exists();

    if ($currentJob) {
        // Has a current job → employed
        $alumni->update([
            'employment_status' => AlumniProfile::STATUS_EMPLOYED,
            'current_job'       => $currentJob->position,
            'company'           => $currentJob->company,
        ]);

    } elseif ($hasAnyHistory) {
        // Has past history but no current job → self employed
        $alumni->update([
            'employment_status' => AlumniProfile::STATUS_SELF_EMPLOYED,
            'current_job'       => null,
            'company'           => null,
        ]);

    } else {
        // No job history at all → unemployed
        // Also clear alignment — the question no longer applies
        $alumni->update([
            'employment_status' => AlumniProfile::STATUS_UNEMPLOYED,
            'current_job'       => null,
            'company'           => null,
            'is_work_aligned'   => null,   // ← reset: no job, no alignment answer
            'work_aligned_reason' => null, // ← reset: clear the reason too
        ]);
    }
}
}
