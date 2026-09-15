<?php

namespace Database\Factories;

use App\Models\Salon;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Staffモデルのダミーデータ生成用Factory
 * salon_id => Salon::factory() = 指定しなければ、紐づくSalonも自動的に1件新規作成される
 *
 * @extends Factory<Staff>
 */
class StaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'salon_id' => Salon::factory(),
            'name'     => $this->faker->name(),
            'position' => $this->faker->randomElement(['スタイリスト', 'アシスタント', '店長']),
            'bio'      => $this->faker->sentence(),
            'image'    => 'https://i.pravatar.cc/300?u=' . $this->faker->uuid(),
        ];
    }
}
