<?php

namespace Database\Factories;

use App\Models\Salon;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'salon_id'    => Salon::factory(),
            'name'        => $this->faker->randomElement(['カット', 'カラー', 'パーマ', 'トリートメント']),
            'description' => $this->faker->sentence(),
            'price'       => $this->faker->numberBetween(3000, 15000),
            'duration'    => $this->faker->randomElement([30, 45, 60, 90, 120]),
        ];
    }
}
