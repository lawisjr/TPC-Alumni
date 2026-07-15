<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('graduates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('student_number')->unique();
            $table->string('name');
            $table->string('batch_year', 20)->nullable(); // ✅ fixed
            $table->string('course')->nullable();
            $table->string('block')->nullable();          // ✅ add this too if missing
            $table->timestamps();
            $table->softDeletes();

            $table->index('department_id');
            $table->index('student_number');
            $table->index('batch_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('graduates');
    }
};