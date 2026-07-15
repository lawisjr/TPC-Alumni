<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            // Self-reported work alignment flag
            // NULL  = alumni has not answered yet
            // TRUE  = alumni says their job IS aligned with their course
            // FALSE = alumni says their job is NOT aligned with their course
            $table->boolean('is_work_aligned')
                  ->nullable()
                  ->default(null)
                  ->after('employment_status');

            // Optional free-text reason / elaboration from the alumni
            $table->string('work_aligned_reason', 500)
                  ->nullable()
                  ->after('is_work_aligned');

            // Index for fast filtering in admin reports
            $table->index('is_work_aligned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni_profiles', function (Blueprint $table) {
            $table->dropIndex(['is_work_aligned']);
            $table->dropColumn(['is_work_aligned', 'work_aligned_reason']);
        });
    }
};