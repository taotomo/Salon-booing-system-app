<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * reviews（レビュー）テーブルを作成する
     *
     * 【参照関係】
     * - users  テーブルを参照（誰がレビューしたか）
     * - salons テーブルを参照（どのサロンへのレビューか）
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // 自動連番の主キー

            // 投稿したユーザーのidを保存する
            // ユーザーが退会したらレビューも自動削除
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // レビュー対象のサロンidを保存する
            // サロンが削除されたらレビューも自動削除
            $table->foreignId('salon_id')->constrained('salons')->onDelete('cascade');

            // unsignedTinyInteger = 0、0～255の整数（評価は1、5なので十分）
            $table->unsignedTinyInteger('rating'); // 星評価（1、5）

            $table->text('comment')->nullable(); // レビューコメント（任意）

            $table->timestamps(); // created_atと updated_atを自動生成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
