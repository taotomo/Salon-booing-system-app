<?php

namespace Database\Factories;

use App\Models\Favorite;
use App\Models\Salon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Favoriteモデルのダミーデータ生成用Factory（テストで「お気に入り登録済み」の状態を作るときに使う）
 *
 * @extends Factory<Favorite>
 */
class FavoriteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'  => User::factory(),
            'salon_id' => Salon::factory(),
        ];
    }
}
