<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\User;
use App\Repositories\AnnouncementRepository;
use App\Mail\AnnouncementNotificationMail;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\AccountActivityLog;

class AnnouncementService
{
    protected AnnouncementRepository $announcementRepository;

    public function __construct(AnnouncementRepository $announcementRepository)
    {
        $this->announcementRepository = $announcementRepository;
    }

    public function getVisibleAnnouncements(User $actor, array $filters = []): LengthAwarePaginator
    {
        return $this->announcementRepository->allVisible($actor, $filters);
    }

    public function getById(int $id): ?Announcement
    {
        return $this->announcementRepository->find($id);
    }

    public function create(User $creator, array $data): Announcement
    {
        return DB::transaction(function () use ($creator, $data) {
            $data['created_by'] = $creator->id;

            if ($creator->isAdmin()) {
                $data['scope'] = Announcement::SCOPE_DEPARTMENT_SPECIFIC;
                $data['department_id'] = $creator->department_id;
            }

            $announcement = $this->announcementRepository->create($data);

            AccountActivityLog::create([
                'actor_id' => $creator->id,
                'action' => 'created_announcement',
                'metadata' => [
                    'announcement_id' => $announcement->id,
                    'title' => $announcement->title,
                ],
            ]);

            // Queue notification emails to recipients
            $this->queueAnnouncementNotifications($announcement);

            return $announcement;
        });
    }

    public function update(Announcement $announcement, User $actor, array $data): Announcement
    {
        return DB::transaction(function () use ($announcement, $actor, $data) {
            if ($actor->isAdmin()) {
                $data['scope'] = Announcement::SCOPE_DEPARTMENT_SPECIFIC;
                $data['department_id'] = $actor->department_id;
            }

            $announcement = $this->announcementRepository->update($announcement, $data);

            AccountActivityLog::create([
                'actor_id' => $actor->id,
                'action' => 'updated_announcement',
                'metadata' => [
                    'announcement_id' => $announcement->id,
                    'title' => $announcement->title,
                ],
            ]);

            return $announcement;
        });
    }

    public function delete(Announcement $announcement, User $actor): bool
    {
        return DB::transaction(function () use ($announcement, $actor) {
            $deleted = $this->announcementRepository->delete($announcement);

            if ($deleted) {
                AccountActivityLog::create([
                    'actor_id' => $actor->id,
                    'action' => 'deleted_announcement',
                    'metadata' => [
                        'announcement_id' => $announcement->id,
                        'title' => $announcement->title,
                    ],
                ]);
            }

            return $deleted;
        });
    }

    /**
     * Queue announcement notification emails to relevant recipients
     */
    protected function queueAnnouncementNotifications(Announcement $announcement): void
    {
        // Load creator to get name
        $announcement->load('creator');
        $creatorName = $announcement->creator->name;

        $recipients = $announcement->scope === Announcement::SCOPE_DEPARTMENT_SPECIFIC
            ? User::where('department_id', $announcement->department_id)
                ->where('role', User::ROLE_USER)
                ->where('status', User::STATUS_ACTIVE)
                ->get()
            : User::where('role', User::ROLE_USER)
                ->where('status', User::STATUS_ACTIVE)
                ->get();

        foreach ($recipients as $recipient) {
            Mail::to($recipient->email)->queue(new AnnouncementNotificationMail($announcement, $recipient, $creatorName));
        }
    }
}
