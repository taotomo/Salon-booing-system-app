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
     * salons（サロン）テーブルを作成する
     *
     * 【参照関係】
     * - users テーブルを参照（サロンオーナーが誰かを記録）
     *
     * 【このテーブルを参照するテーブル】
     * - staffs   （このサロンに所属するスタッフ）
     * - services （このサロンが提供するメニュー）
     * - bookings （このサロンへの予約）
     * - reviews  （このサロンへのレビュー）
     */
    public function up(): void
    {
        Schema::create('salons', function (Blueprint $table) {
            // id() = 自動でインクリメントされる主キー（1, 2, 3...）
            $table->id();

            // foreignId = 他のテーブルと紐付けるための列
            // constrained('users') = usersテーブルのidを参照する
            // onDelete('cascade') = ユーザーが削除されたらサロンも自動削除
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // string = 短いテキスト（最大255文字）
            $table->string('name');        // サロン名（例：Hair Salon TOKYO）
            $table->string('address');     // 住所（例：東京都渋谷区1-1-1）

            // decimal(列名, 全体桁数, 小数点以下桁数)
            // nullable() = 値がなくてもOK（地図連携しない場合も想定）
            $table->decimal('lat', 10, 7)->nullable(); // 緯度（例：35.6812362）
            $table->decimal('lng', 10, 7)->nullable(); // 経度（例：139.7671248）

            // text = 長いテキスト（255文字以上も可）
            $table->text('description')->nullable(); // サロンの説明文

            $table->string('phone')->nullable();  // 電話番号
            $table->string('image')->nullable();  // メイン画像のパス

            // timestamps() = created_at（作成日時）と updated_at（更新日時）を自動生成
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salons');
    }
};
