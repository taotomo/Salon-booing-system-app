<?php

namespace Tests\Unit\Models;

use App\Models\Booking;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Bookingモデルの単体テスト
 */
class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_予約は関連するユーザーサロンスタッフメニューを取得できる(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();
        $staff = Staff::factory()->create(['salon_id' => $salon->id]);
        $service = Service::factory()->create(['salon_id' => $salon->id]);

        $booking = Booking::factory()->create([
            'user_id'    => $user->id,
            'salon_id'   => $salon->id,
            'staff_id'   => $staff->id,
            'service_id' => $service->id,
        ]);

        $this->assertTrue($booking->user->is($user));
        $this->assertTrue($booking->salon->is($salon));
        $this->assertTrue($booking->staff->is($staff));
        $this->assertTrue($booking->service->is($service));
    }

    public function test_start_atはCarbonインスタンスとして取得できる(): void
    {
        // $casts で 'start_at' => 'datetime' としているため、
        // 文字列ではなくCarbon（日時操作ができるクラス）として扱える
        $booking = Booking::factory()->create();

        $this->assertInstanceOf(Carbon::class, $booking->start_at);
    }

    public function test_ステータスの初期値はpendingである(): void
    {
        $booking = Booking::factory()->create();

        $this->assertSame('pending', $booking->status);
    }
}
