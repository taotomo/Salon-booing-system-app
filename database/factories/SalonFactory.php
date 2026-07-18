<?php

namespace Database\Factories;

use App\Models\Salon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Salon>
 */
class SalonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // user_id を指定しなければ、自動的にオーナー用のユーザーを1件作って紐づける
            'user_id'     => User::factory(),
            'genre'       => $this->faker->randomElement(['hair', 'nail', 'eyelash', 'relaxation']),
            'name'        => $this->faker->company() . ' 店',
            'address'     => $this->faker->address(),
            'lat'         => $this->faker->latitude(24, 45),
            'lng'         => $this->faker->longitude(123, 145),
            'description' => $this->faker->sentence(),
            'phone'       => $this->faker->phoneNumber(),
            'image'       => 'https://picsum.photos/seed/' . $this->faker->uuid() . '/800/500',
        ];
    }
}
