<?php

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Graduate;
use App\Models\JobHistory;
use App\Models\User;
use App\Policies\AnnouncementPolicy;
use App\Policies\GraduatePolicy;
use App\Policies\JobHistoryPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Announcement::class => AnnouncementPolicy::class,
        Graduate::class => GraduatePolicy::class,
        JobHistory::class => JobHistoryPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
