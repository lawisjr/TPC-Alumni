<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        // All authenticated users can view events
        return true;
    }

    public function view(User $user, Event $event): bool
    {
        // Super admin can view all
        if ($user->isSuperAdmin()) {
            return true;
        }

        // School-wide events visible to all
        if ($event->scope === Event::SCOPE_SCHOOL_WIDE) {
            return true;
        }

        // Department-specific events visible to that department
        if ($event->scope === Event::SCOPE_DEPARTMENT_SPECIFIC) {
            return $user->department_id === $event->department_id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isAdmin();
    }

    public function update(User $user, Event $event): bool
    {
        // Only creator or super admin can update
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->id === $event->created_by) {
            return true;
        }

        return false;
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}
