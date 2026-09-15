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
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            // constrained() = users/salonsテーブルのidを参照する外部キー
            // cascadeOnDelete() = ユーザーやサロンが削除されたら、そのお気に入りも自動的に消える
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('salon_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // 同じユーザーが同じサロンを二重にお気に入り登録できないようにする
            $table->unique(['user_id', 'salon_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
