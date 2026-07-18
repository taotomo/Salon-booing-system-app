<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * 全シーダーをまとめて実行する
     * php artisan db:seed を実行するとここが呼ばれる
     */
    public function run(): void
    {
        // 順番に注意: 参照される側（User, Salon）を先に実行する
        $this->call([
            UserSeeder::class,    // ユーザーを先に作る
            SalonSeeder::class,   // サロン・スタッフ・メニューを作る
            ReviewSeeder::class,  // レビューを作る（User と Salon が必要）
        ]);
    }
}
