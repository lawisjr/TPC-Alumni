<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('scope', ['school_wide', 'department_specific'])->default('school_wide');
            $table->timestamps();
            $table->softDeletes();

            $table->index('department_id');
            $table->index('scope');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
