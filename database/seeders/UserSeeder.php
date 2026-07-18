<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * テスト用ユーザーを作成する
     *
     * 作成するユーザー:
     * - 一般ユーザー（予約・レビュー用）
     * - サロンオーナー（管理画面用）
     */
    public function run(): void
    {
        // 一般ユーザー1（予約・レビューのテスト用）
        User::create([
            'name'              => '田中 太郎',
            'email'             => 'user@example.com',
            // Hash::make() = パスワードをハッシュ化して安全に保存
            // 平文で保存するのはセキュリティ上NGなので必ずHash::makeを使う
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 一般ユーザー2
        User::create([
            'name'              => '佐藤 花子',
            'email'             => 'user2@example.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // サロンオーナー（このユーザーがサロンを持つ）
        User::create([
            'name'              => 'オーナー 山田',
            'email'             => 'owner@example.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // オーナー2
        User::create([
            'name'              => 'オーナー 鈴木',
            'email'             => 'owner2@example.com',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
