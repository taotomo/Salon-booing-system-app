<?php

namespace Database\Seeders;

use App\Models\Salon;
use Illuminate\Database\Seeder;

class SalonSeeder extends Seeder
{
    /**
     * サロン・スタッフ・メニューのテストデータを作成する
     *
     * 【作成の流れ】
     * 1. サロンを1件作る（Salon::create）
     * 2. そのサロンに紐づくスタッフを複数作る（$salon->staffs()->create）
     * 3. そのサロンに紐づくメニューを複数作る（$salon->services()->create）
     *
     * $salon->staffs()->create(...) と書くと、salon_id を自分で指定しなくても
     * 自動的に「今作ったサロンのid」がセットされる（リレーション経由の作成）
     */
    public function run(): void
    {
        // サロンごとのデータをまとめて定義しておく
        // owner_id = 2. UserSeederで作った「オーナー 山田」(id:3) と「オーナー 鈴木」(id:4)
        $salons = [
            [
                'owner_id'    => 3,
                'genre'       => 'hair',
                'name'        => 'Chapiro Hair 渋谷店',
                'address'     => '東京都渋谷区道玄坂1-2-3',
                'lat'         => 35.6580,
                'lng'         => 139.6994,
                'description' => '渋谷駅から徒歩3分。トレンドを取り入れたカット・カラーが人気のサロンです。全席個室でゆったりとお過ごしいただけます。',
                'phone'       => '03-1234-5601',
                'image'       => 'https://picsum.photos/seed/salon1/800/500',
                'staffs'      => [
                    ['name' => '山本 直樹', 'position' => 'トップスタイリスト', 'bio' => 'メンズカットが得意です。骨格に合わせたスタイル提案をします。', 'image' => 'https://i.pravatar.cc/300?img=11'],
                    ['name' => '中村 さくら', 'position' => 'スタイリスト', 'bio' => '髪質改善トリートメントが得意です。', 'image' => 'https://i.pravatar.cc/300?img=12'],
                    ['name' => '小林 蓮', 'position' => 'アシスタント', 'bio' => '丁寧なシャンプーを心がけています。', 'image' => 'https://i.pravatar.cc/300?img=13'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => 'シャンプー・ブロー込み', 'price' => 4400, 'duration' => 60],
                    ['name' => 'カラー', 'description' => 'ハイライト・グラデーションなど相談可', 'price' => 7700, 'duration' => 90],
                    ['name' => 'パーマ', 'description' => 'デジタルパーマ対応', 'price' => 9900, 'duration' => 120],
                    ['name' => 'トリートメント', 'description' => '髪質改善系トリートメント', 'price' => 5500, 'duration' => 45],
                ],
            ],
            [
                'owner_id'    => 3,
                'genre'       => 'hair',
                'name'        => 'Maison Étoile 銀座店',
                'address'     => '東京都中央区銀座4-5-6',
                'lat'         => 35.6717,
                'lng'         => 139.7645,
                'description' => '大人の女性のためのラグジュアリーサロン。上質な空間でリラックスしながら施術を受けられます。',
                'phone'       => '03-1234-5602',
                'image'       => 'https://picsum.photos/seed/salon2/800/500',
                'staffs'      => [
                    ['name' => '高橋 舞', 'position' => '店長', 'bio' => '大人可愛いスタイルが得意です。', 'image' => 'https://i.pravatar.cc/300?img=21'],
                    ['name' => '伊藤 大輔', 'position' => 'スタイリスト', 'bio' => 'メンズ・レディース問わず対応します。', 'image' => 'https://i.pravatar.cc/300?img=22'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => 'カウンセリング重視のカット', 'price' => 5500, 'duration' => 60],
                    ['name' => 'カラー', 'description' => 'ツヤ感重視のカラー', 'price' => 8800, 'duration' => 100],
                    ['name' => 'ヘッドスパ', 'description' => '極上のリラックスタイム', 'price' => 6600, 'duration' => 50],
                ],
            ],
            [
                'owner_id'    => 4,
                'genre'       => 'hair',
                'name'        => 'Lumiere Hair 新宿店',
                'address'     => '東京都新宿区新宿3-7-8',
                'lat'         => 35.6909,
                'lng'         => 139.7003,
                'description' => 'トレンド発信サロン。SNSで人気のスタイリストが多数在籍しています。',
                'phone'       => '03-1234-5603',
                'image'       => 'https://picsum.photos/seed/salon3/800/500',
                'staffs'      => [
                    ['name' => '渡辺 陸', 'position' => 'トップスタイリスト', 'bio' => 'メンズパーマの第一人者。', 'image' => 'https://i.pravatar.cc/300?img=31'],
                    ['name' => '加藤 ひなた', 'position' => 'スタイリスト', 'bio' => '外国人風カラーが得意です。', 'image' => 'https://i.pravatar.cc/300?img=32'],
                    ['name' => '吉田 あおい', 'position' => 'アシスタント', 'bio' => '丁寧な接客を心がけています。', 'image' => 'https://i.pravatar.cc/300?img=33'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => '骨格診断カット', 'price' => 4950, 'duration' => 60],
                    ['name' => 'カラー', 'description' => 'イルミナカラー使用', 'price' => 8250, 'duration' => 90],
                    ['name' => 'パーマ', 'description' => '波巻きパーマ', 'price' => 9350, 'duration' => 110],
                    ['name' => 'トリートメント', 'description' => '酸熱トリートメント', 'price' => 6050, 'duration' => 60],
                ],
            ],
            [
                'owner_id'    => 4,
                'genre'       => 'hair',
                'name'        => 'Nocturne 横浜店',
                'address'     => '神奈川県横浜市西区みなとみらい2-1-1',
                'lat'         => 35.4547,
                'lng'         => 139.6317,
                'description' => 'みなとみらいの景色が見えるおしゃれな空間。カップルでの来店も歓迎です。',
                'phone'       => '045-123-4501',
                'image'       => 'https://picsum.photos/seed/salon4/800/500',
                'staffs'      => [
                    ['name' => '斎藤 大和', 'position' => '店長', 'bio' => 'メンズスタイル全般に対応。', 'image' => 'https://i.pravatar.cc/300?img=41'],
                    ['name' => '松本 ゆい', 'position' => 'スタイリスト', 'bio' => 'ブライダルヘアも承ります。', 'image' => 'https://i.pravatar.cc/300?img=42'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => 'トレンドカット', 'price' => 4620, 'duration' => 60],
                    ['name' => 'カラー', 'description' => 'グレイカラー対応可', 'price' => 7480, 'duration' => 90],
                    ['name' => 'ヘッドスパ', 'description' => '炭酸ヘッドスパ', 'price' => 5280, 'duration' => 40],
                ],
            ],
            [
                'owner_id'    => 3,
                'genre'       => 'hair',
                'name'        => 'Coquille Hair 大阪店',
                'address'     => '大阪府大阪市北区梅田1-3-1',
                'lat'         => 34.7024,
                'lng'         => 135.4959,
                'description' => '梅田駅直結でアクセス抜群。若者に人気のトレンドスタイルが揃います。',
                'phone'       => '06-1234-5601',
                'image'       => 'https://picsum.photos/seed/salon5/800/500',
                'staffs'      => [
                    ['name' => '木村 悠斗', 'position' => 'トップスタイリスト', 'bio' => 'メンズマッシュが得意です。', 'image' => 'https://i.pravatar.cc/300?img=51'],
                    ['name' => '林 みお', 'position' => 'スタイリスト', 'bio' => 'デジタルパーマ講師経験あり。', 'image' => 'https://i.pravatar.cc/300?img=52'],
                    ['name' => '清水 そら', 'position' => 'アシスタント', 'bio' => '丁寧なブローが得意です。', 'image' => 'https://i.pravatar.cc/300?img=53'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => 'マッシュ・ツーブロック対応', 'price' => 4400, 'duration' => 50],
                    ['name' => 'カラー', 'description' => 'ブリーチワーク相談可', 'price' => 8800, 'duration' => 120],
                    ['name' => 'パーマ', 'description' => 'ツイストスパイラルパーマ', 'price' => 9900, 'duration' => 120],
                ],
            ],
            [
                'owner_id'    => 4,
                'genre'       => 'hair',
                'name'        => 'Prunus 福岡天神店',
                'address'     => '福岡県福岡市中央区天神2-4-2',
                'lat'         => 33.5902,
                'lng'         => 130.4017,
                'description' => '天神エリアで20年以上愛される老舗サロン。技術力の高さに定評があります。',
                'phone'       => '092-123-4501',
                'image'       => 'https://picsum.photos/seed/salon6/800/500',
                'staffs'      => [
                    ['name' => '田村 れん', 'position' => '店長', 'bio' => 'ショートスタイルが得意です。', 'image' => 'https://i.pravatar.cc/300?img=61'],
                    ['name' => '井上 ひまり', 'position' => 'スタイリスト', 'bio' => '縮毛矯正のスペシャリスト。', 'image' => 'https://i.pravatar.cc/300?img=62'],
                ],
                'services' => [
                    ['name' => 'カット', 'description' => '丁寧なカウンセリングカット', 'price' => 4180, 'duration' => 55],
                    ['name' => '縮毛矯正', 'description' => 'クセ毛でも扱いやすい仕上がり', 'price' => 12100, 'duration' => 150],
                    ['name' => 'トリートメント', 'description' => 'ダメージ補修トリートメント', 'price' => 5500, 'duration' => 45],
                ],
            ],
            [
                'owner_id'    => 3,
                'genre'       => 'nail',
                'name'        => 'Ongle Tokyo 表参道店',
                'address'     => '東京都渋谷区神宮前4-9-1',
                'lat'         => 35.6702,
                'lng'         => 139.7057,
                'description' => '表参道駅から徒歩4分。トレンドデザインからオフまで幅広く対応するネイルサロンです。',
                'phone'       => '03-1234-5701',
                'image'       => 'https://picsum.photos/seed/salon7/800/500',
                'staffs'      => [
                    ['name' => '橋本 まゆ', 'position' => 'ネイリスト', 'bio' => 'ハンドペイントアートが得意です。', 'image' => 'https://i.pravatar.cc/300?img=25'],
                    ['name' => '岡田 りお', 'position' => 'ネイリスト', 'bio' => 'シンプル＆上品なデザインが得意です。', 'image' => 'https://i.pravatar.cc/300?img=26'],
                ],
                'services' => [
                    ['name' => 'ジェルネイル（ワンカラー）', 'description' => '爪の状態に合わせたケア込み', 'price' => 6600, 'duration' => 60],
                    ['name' => 'ジェルネイル（アート）', 'description' => 'デザイン相談可能', 'price' => 8800, 'duration' => 90],
                    ['name' => 'フットジェル', 'description' => '角質ケア込み', 'price' => 7700, 'duration' => 75],
                ],
            ],
            [
                'owner_id'    => 4,
                'genre'       => 'eyelash',
                'name'        => 'Cils Ginza 銀座店',
                'address'     => '東京都中央区銀座6-2-1',
                'lat'         => 35.6712,
                'lng'         => 139.7660,
                'description' => '銀座駅から徒歩2分。まつげエクステ・パーマ専門サロン。目元の印象をナチュラルに引き立てます。',
                'phone'       => '03-1234-5702',
                'image'       => 'https://picsum.photos/seed/salon8/800/500',
                'staffs'      => [
                    ['name' => '西村 あかり', 'position' => 'アイリスト', 'bio' => 'ナチュラルな束感まつげが得意です。', 'image' => 'https://i.pravatar.cc/300?img=27'],
                    ['name' => '藤田 ののか', 'position' => 'アイリスト', 'bio' => 'まつげパーマ・美容師免許保有。', 'image' => 'https://i.pravatar.cc/300?img=28'],
                ],
                'services' => [
                    ['name' => 'マツエク（120本）', 'description' => 'シングルラッシュ', 'price' => 7000, 'duration' => 90],
                    ['name' => 'マツエク（ボリューム）', 'description' => '2〜6本束のボリュームラッシュ', 'price' => 9500, 'duration' => 120],
                    ['name' => 'まつげパーマ', 'description' => '自まつげを活かしたパーマ', 'price' => 5500, 'duration' => 50],
                ],
            ],
            [
                'owner_id'    => 3,
                'genre'       => 'relaxation',
                'name'        => 'Nagomi Spa 渋谷店',
                'address'     => '東京都渋谷区渋谷2-3-1',
                'lat'         => 35.6595,
                'lng'         => 139.7005,
                'description' => '渋谷駅から徒歩5分。日々の疲れを癒すオイルトリートメント・ヘッドスパ専門店です。',
                'phone'       => '03-1234-5703',
                'image'       => 'https://picsum.photos/seed/salon9/800/500',
                'staffs'      => [
                    ['name' => '長谷川 葵', 'position' => 'セラピスト', 'bio' => 'アロマオイルトリートメントが得意です。', 'image' => 'https://i.pravatar.cc/300?img=29'],
                    ['name' => '大野 さつき', 'position' => 'セラピスト', 'bio' => '頭皮改善ヘッドスパのスペシャリスト。', 'image' => 'https://i.pravatar.cc/300?img=30'],
                ],
                'services' => [
                    ['name' => 'アロマオイルトリートメント60分', 'description' => '全身の疲れをやわらげます', 'price' => 8800, 'duration' => 60],
                    ['name' => 'ヘッドスパ45分', 'description' => '頭皮環境を整える炭酸ヘッドスパ', 'price' => 6600, 'duration' => 45],
                    ['name' => 'フットリフレ30分', 'description' => 'むくみ・疲れが気になる方に', 'price' => 4400, 'duration' => 30],
                ],
            ],
        ];

        foreach ($salons as $data) {
            // まずサロン本体を作成する
            $salon = Salon::create([
                'user_id'     => $data['owner_id'],
                'genre'       => $data['genre'],
                'name'        => $data['name'],
                'address'     => $data['address'],
                'lat'         => $data['lat'],
                'lng'         => $data['lng'],
                'description' => $data['description'],
                'phone'       => $data['phone'],
                'image'       => $data['image'],
            ]);

            // $salon->staffs() でこのサロンに紐づくスタッフだけを作成できる
            // （salon_idを自分で書かなくても自動で今のサロンのidが入る）
            foreach ($data['staffs'] as $staff) {
                $salon->staffs()->create($staff);
            }

            // 同様にメニューも作成する
            foreach ($data['services'] as $service) {
                $salon->services()->create($service);
            }
        }
    }
}
