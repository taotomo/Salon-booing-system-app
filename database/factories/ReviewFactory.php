<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Salon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Reviewモデルのダミーデータ生成用Factory
 *
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
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
            'rating'   => $this->faker->numberBetween(1, 5),
            'comment'  => $this->faker->sentence(),
        ];
    }
}
