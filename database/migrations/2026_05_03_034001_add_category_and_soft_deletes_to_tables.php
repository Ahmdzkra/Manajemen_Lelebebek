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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->softDeletes();
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->softDeletes();
        });
        
        Schema::table('receivings', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('return_items', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'deleted_at']);
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        
        Schema::table('receivings', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('return_items', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
};
