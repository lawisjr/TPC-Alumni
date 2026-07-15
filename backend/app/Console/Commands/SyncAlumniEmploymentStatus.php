<?php

namespace App\Console\Commands;

use App\Models\AlumniProfile;
use Illuminate\Console\Command;

class SyncAlumniEmploymentStatus extends Command
{
    protected $signature   = 'alumni:sync-employment-status';
    protected $description = 'Backfill employment_status on all alumni profiles based on job history';

    public function handle(): void
    {
        $profiles = AlumniProfile::with('user.jobHistories')->get();

        $bar = $this->output->createProgressBar($profiles->count());
        $bar->start();

        foreach ($profiles as $profile) {
            $profile->syncEmploymentStatus();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done.');
    }
}