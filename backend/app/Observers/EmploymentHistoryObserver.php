<?php

namespace App\Observers;

use App\Models\JobHistory;                        // ← fix this

class EmploymentHistoryObserver
{
    public function saved(JobHistory $job): void  // ← fix this
    {
        $this->sync($job);
    }

    public function deleted(JobHistory $job): void // ← fix this
    {
        $this->sync($job);
    }

    public function restored(JobHistory $job): void // ← fix this
    {
        $this->sync($job);
    }

    private function sync(JobHistory $job): void   // ← fix this
    {
        $profile = $job->user?->alumniProfile;
        $profile?->syncEmploymentStatus();
    }
}