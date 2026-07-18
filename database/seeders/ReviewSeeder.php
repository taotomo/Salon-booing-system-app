<?php

namespace Database\Seeders;

use App\Models\Salon;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * サロンへのレビューのテストデータを作成する
     *
     * 【前提】
     * - UserSeeder が先に実行され、一般ユーザーが存在すること
     * - SalonSeeder が先に実行され、サロンが存在すること
     * （DatabaseSeeder.php で実行順を制御している）
     */
    public function run(): void
    {
        // 一般ユーザー（予約・レビューする側）だけを取得する
        // オーナーはレビューしない想定なので、email で絞り込む
        $reviewers = User::whereIn('email', ['user@example.com', 'user2@example.com'])->get();

        // コメントのバリエーションを rating（星の数）ごとに用意しておく
        $comments = [
            5 => 'とても丁寧な対応で大満足でした！仕上がりも希望通りで、また利用したいです。',
            4 => 'スタイリストさんの技術が高く安心して任せられました。駅からも近くて便利です。',
            3 => '普通に良かったです。特に不満はありませんが、次は違う担当者も試してみたいです。',
        ];

        // 各サロンに対して2〜3件ずつレビューを投稿する
        Salon::all()->each(function (Salon $salon, int $index) use ($reviewers, $comments) {
            foreach ($reviewers as $reviewerIndex => $reviewer) {
                // サロンごと・ユーザーごとに評価を少しずつ変える（3〜5点の範囲）
                $rating = 3 + (($index + $reviewerIndex) % 3);

                $salon->reviews()->create([
                    'user_id' => $reviewer->id,
                    'rating'  => $rating,
                    'comment' => $comments[$rating],
                ]);
            }
        });
    }
}
