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
     * services（メニュー）テーブルを作成する
     *
     * 【参照関係】
     * - salons テーブルを参照（どのサロンが提供するメニューか）
     *
     * 【このテーブルを参照するテーブル】
     * - bookings （予約されたメニュー）
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id(); // 自動連番の主キー

            // 提供サロンのidを保存する
            // サロンが削除されたらメニューも自動削除
            $table->foreignId('salon_id')->constrained('salons')->onDelete('cascade');

            $table->string('name');              // メニュー名（例：カット、カラー、パーマ）
            $table->text('description')->nullable(); // メニューの説明文

            // integer = 整数を保存する型
            $table->integer('price');    // 料金（円）（例：5000）
            $table->integer('duration'); // 所要時間（分）（例：60）

            $table->timestamps(); // created_atと updated_atを自動生成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
