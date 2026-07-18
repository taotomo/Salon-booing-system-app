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
        Schema::table('salons', function (Blueprint $table) {
            // genre = サロンの業種
            // enum = 決められた選択肢（'hair'/'nail'/'eyelash'/'relaxation'）以外は保存できない型
            // bookings.status と同じ考え方。トップページの絞り込みに使う
            $table->enum('genre', ['hair', 'nail', 'eyelash', 'relaxation'])
                ->default('hair')
                ->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salons', function (Blueprint $table) {
            $table->dropColumn('genre');
        });
    }
};
