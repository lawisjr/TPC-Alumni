<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Models\AccountActivityLog;
use App\Repositories\EventRepository;
use App\Mail\EventNotificationMail;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EventService
{
    protected EventRepository $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * Get all visible events for user
     */
    public function getVisibleEvents(User $actor, array $filters = []): LengthAwarePaginator
    {
        return $this->eventRepository->allVisible($actor, $filters);
    }

    /**
     * Get all events (admin only)
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->eventRepository->all($filters);
    }

    /**
     * Get event by ID
     */
    public function getById(int $id): ?Event
    {
        return $this->eventRepository->find($id);
    }

    /**
     * Create event
     */
    public function create(User $creator, array $data): Event
    {
        return DB::transaction(function () use ($creator, $data) {
            $data['created_by'] = $creator->id;

            if ($creator->isAdmin()) {
                $data['scope'] = Event::SCOPE_DEPARTMENT_SPECIFIC;
                $data['department_id'] = $creator->department_id;
            }

            $event = $this->eventRepository->create($data);

            // Log the action
            AccountActivityLog::create([
                'actor_id' => $creator->id,
                'action' => 'created_event',
                'metadata' => [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                ],
            ]);

            // Queue notification emails to recipients
            $this->queueEventNotifications($event);

            return $event;
        });
    }

    /**
     * Update event
     */
    public function update(Event $event, User $actor, array $data): Event
    {
        return DB::transaction(function () use ($event, $actor, $data) {
            if ($actor->isAdmin()) {
                $data['scope'] = Event::SCOPE_DEPARTMENT_SPECIFIC;
                $data['department_id'] = $actor->department_id;
            }

            $updated = $this->eventRepository->update($event, $data);

            // Log the action
            AccountActivityLog::create([
                'actor_id' => $actor->id,
                'action' => 'updated_event',
                'metadata' => [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                ],
            ]);

            return $updated;
        });
    }

    /**
     * Delete event
     */
    public function delete(Event $event, User $actor): bool
    {
        return DB::transaction(function () use ($event, $actor) {
            $deleted = $this->eventRepository->delete($event);

            if ($deleted) {
                // Log the action
                AccountActivityLog::create([
                    'actor_id' => $actor->id,
                    'action' => 'deleted_event',
                    'metadata' => [
                        'event_id' => $event->id,
                        'event_title' => $event->title,
                    ],
                ]);
            }

            return $deleted;
        });
    }

    /**
     * Queue event notification emails to relevant recipients
     */
    protected function queueEventNotifications(Event $event): void
    {
        // Load creator to get name
        $event->load('creator');
        $creatorName = $event->creator->name;

        $recipients = $event->scope === Event::SCOPE_DEPARTMENT_SPECIFIC
            ? User::where('department_id', $event->department_id)
                ->where('role', User::ROLE_USER)
                ->where('status', User::STATUS_ACTIVE)
                ->get()
            : User::where('role', User::ROLE_USER)
                ->where('status', User::STATUS_ACTIVE)
                ->get();

        foreach ($recipients as $recipient) {
            Mail::to($recipient->email)->queue(new EventNotificationMail($event, $recipient, $creatorName));
        }
    }
}
