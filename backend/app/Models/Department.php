<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function graduates(): HasMany
    {
        return $this->hasMany(Graduate::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function admins(): HasMany
    {
        return $this->users()->where('role', User::ROLE_ADMIN);
    }

    public function students(): HasMany
    {
        return $this->users()->where('role', User::ROLE_USER);
    }
}
