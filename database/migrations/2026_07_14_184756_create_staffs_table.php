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
     * staffs（スタッフ）テーブルを作成する
     *
     * 【参照関係】
     * - salons テーブルを参照（どのサロンに所属するか）
     *
     * 【このテーブルを参照するテーブル】
     * - bookings （スタッフを指名した予約）
     *
     * 【実行順序の注意点】
     * salonsテーブルが先に作成されている必要がある
     * → ファイル名: 184756（salonsの184546より大きい数字）
     */
    public function up(): void
    {
        Schema::create('staffs', function (Blueprint $table) {
            $table->id(); // 自動連番の主キー

            // 所属サロンのidを保存する
            // constrained('salons') = salonsテーブルのidを参照
            // サロンが削除されたらスタッフも自動削除
            $table->foreignId('salon_id')->constrained('salons')->onDelete('cascade');

            $table->string('name');              // スタッフ名（例：田中 香奈）
            $table->string('position')->nullable(); // 役職（例：トップスタイリスト）
            $table->text('bio')->nullable();      // 自己紹介・コメント
            $table->string('image')->nullable();  // プロフィール画像のパス

            $table->timestamps(); // created_atと updated_atを自動生成
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};
