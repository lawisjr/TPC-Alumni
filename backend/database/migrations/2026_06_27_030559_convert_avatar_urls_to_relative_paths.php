<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert full avatar URLs to relative paths
        DB::table('users')->whereNotNull('avatar')->get()->each(function ($user) {
            $avatar = $user->avatar;
            
            // Skip if already a relative path
            if (str_starts_with($avatar, '/storage/')) {
                return;
            }
            
            // Convert full URL to relative path
            if (str_contains($avatar, '/storage/')) {
                $relativePath = '/storage/' . substr($avatar, strrpos($avatar, '/storage/') + 9);
                DB::table('users')->where('id', $user->id)->update(['avatar' => $relativePath]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert relative paths back to full URLs (optional - we won't do this for safety)
        // This would require storing the APP_URL which may differ in different environments
    }
};
