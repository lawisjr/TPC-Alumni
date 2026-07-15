<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AlumniProfile extends Model
{
    use HasFactory, SoftDeletes;

    // Employment status constants
    public const STATUS_EMPLOYED      = 'employed';
    public const STATUS_UNEMPLOYED    = 'unemployed';
    public const STATUS_SELF_EMPLOYED = 'self_employed';

    protected $fillable = [
        'user_id',
        'department_id',
        'graduate_id',
        'contact_number',
        'location',
        'profile_photo_url',
        'current_job',
        'company',
        'batch_year',
        'employment_status',
        'is_work_aligned',       // bool|null — self-reported alignment answer
        'work_aligned_reason',   // string|null — optional elaboration
    ];

    protected function casts(): array
    {
        return [
            'employment_status' => 'string',
            'is_work_aligned'   => 'boolean', // null stays null; 1/0 cast to true/false
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function graduate(): BelongsTo
    {
        return $this->belongsTo(Graduate::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    /**
     * Alumni who answered YES — job is aligned with their course.
     */
    public function scopeAligned(Builder $query): Builder
    {
        return $query->where('is_work_aligned', true);
    }

    /**
     * Alumni who answered NO — job is NOT aligned with their course.
     */
    public function scopeNotAligned(Builder $query): Builder
    {
        return $query->where('is_work_aligned', false);
    }

    /**
     * Alumni who have not yet answered the alignment question.
     */
    public function scopeAlignmentUnanswered(Builder $query): Builder
    {
        return $query->whereNull('is_work_aligned');
    }

    /**
     * Only employed alumni (alignment only makes sense for employed alumni).
     */
    public function scopeEmployed(Builder $query): Builder
    {
        return $query->where('employment_status', '!=', self::STATUS_UNEMPLOYED);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Whether the alumni has answered the alignment question.
     */
    public function hasAnsweredAlignment(): bool
    {
        return ! is_null($this->is_work_aligned);
    }

    /**
     * Sync employment_status based on job history.
     * Called after job history changes.
     */
    public function syncEmploymentStatus(): void
    {
        $jobs = $this->user->jobHistories();

        $hasCurrentJob = $jobs->where('is_current', true)->exists();
        $hasAnyJob     = $jobs->exists();

        $status = match (true) {
            $hasCurrentJob => self::STATUS_EMPLOYED,
            $hasAnyJob     => self::STATUS_SELF_EMPLOYED,
            default        => self::STATUS_UNEMPLOYED,
        };

        $this->updateQuietly(['employment_status' => $status]);
    }
}