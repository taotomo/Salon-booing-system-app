<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Bookingモデルのダミーデータ生成用Factory
 *
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'    => User::factory(),
            'salon_id'   => Salon::factory(),
            'staff_id'   => Staff::factory(),
            'service_id' => Service::factory(),
            // BookingController@storeの「after:now」バリデーションに合わせて必ず未来日時にする
            'start_at'   => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'status'     => 'pending',
            'note'       => $this->faker->optional()->sentence(),
        ];
    }
}
