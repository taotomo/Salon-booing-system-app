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
     * bookings（予約）テーブルを作成する
     *
     * 【参照関係】
     * - users    テーブルを参照（誰が予約したか）
     * - salons   テーブルを参照（どのサロンか）
     * - staffs   テーブルを参照（誰が担当するか）
     * - services テーブルを参照（どのメニューか）
     *
     * 【実行順序の注意点】
     * 上記っ4つのテーブルがすべて作成された後に実行される必要がある
     * → ファイル名: 184900（他のテーブルより大きい数字）
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); // 自動連番の主キー

            // 予約したユーザーのidを保存
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // 予約先サロンのidを保存
            $table->foreignId('salon_id')->constrained('salons')->onDelete('cascade');

            // 担当スタッフのidを保存
            // 注意: 列名はstaff_idだがテーブル名はstaffs（根本は別物）
            $table->foreignId('staff_id')->constrained('staffs')->onDelete('cascade');

            // 予約メニューのidを保存
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');

            // dateTime = 日付と時刻を保存する型（例：2026-08-01 14:00:00）
            $table->dateTime('start_at'); // 予約開始日時

            // enum = 入力できる値を限定する型
            // pending   = 申請中（サロンがまだ確認していない）
            // confirmed = 確定（サロンが承認済み）
            // cancelled = キャンセル済み
            // default('pending') = 新規予約時は必ず「pending」から始まる
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');

            $table->text('note')->nullable(); // 備考・リクエスト（任意）

            $table->timestamps(); // created_atと updated_atを自動生成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
