<?php
namespace App\Providers;

use App\Models\JobHistory;                        // ← was EmploymentHistory
use App\Observers\EmploymentHistoryObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        JobHistory::observe(EmploymentHistoryObserver::class);
    }
}