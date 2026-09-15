<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Staff;
use App\Models\User;
use App\Notifications\NewBookingReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

/**
 * 予約フローの結合テスト
 *
 * 【重点的に確認すること】
 * - 未ログインでは予約できない
 * - 自分の予約だけが見える／操作できる（他人の予約は403）
 * これらはセキュリティ（IDOR対策）に直結するため、特に丁寧にテストする。
 */
class BookingTest extends TestCase
{
    use RefreshDatabase;

    private function createSalonWithStaffAndService(): array
    {
        $salon = Salon::factory()->create();
        $staff = Staff::factory()->create(['salon_id' => $salon->id]);
        $service = Service::factory()->create(['salon_id' => $salon->id]);

        return [$salon, $staff, $service];
    }

    public function test_未ログインでは予約フォームにアクセスできない(): void
    {
        [$salon] = $this->createSalonWithStaffAndService();

        $response = $this->get(route('bookings.create', $salon));

        $response->assertRedirect(route('login'));
    }

    public function test_ログインすれば予約を作成できる(): void
    {
        [$salon, $staff, $service] = $this->createSalonWithStaffAndService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('bookings.store'), [
            'salon_id'   => $salon->id,
            'staff_id'   => $staff->id,
            'service_id' => $service->id,
            'start_at'   => now()->addDays(3)->format('Y-m-d H:i:s'),
            'note'       => 'よろしくお願いします',
        ]);

        $this->assertDatabaseHas('bookings', [
            'user_id'  => $user->id,
            'salon_id' => $salon->id,
            'status'   => 'pending',
        ]);

        // 保存後は専用の予約完了ページにリダイレクトされる
        $booking = Booking::first();
        $response->assertRedirect(route('bookings.complete', $booking));
    }

    public function test_予約が入るとサロンオーナーに通知が送られる(): void
    {
        Notification::fake();

        [$salon, $staff, $service] = $this->createSalonWithStaffAndService();
        $user = User::factory()->create();

        $this->actingAs($user)->post(route('bookings.store'), [
            'salon_id'   => $salon->id,
            'staff_id'   => $staff->id,
            'service_id' => $service->id,
            'start_at'   => now()->addDays(3)->format('Y-m-d H:i:s'),
        ]);

        // サロンのオーナー（$salon->owner）宛に通知が1件送られたことを確認する
        Notification::assertSentTo($salon->owner, NewBookingReceived::class);
    }

    public function test_過去の日時では予約できない(): void
    {
        [$salon, $staff, $service] = $this->createSalonWithStaffAndService();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('bookings.store'), [
            'salon_id'   => $salon->id,
            'staff_id'   => $staff->id,
            'service_id' => $service->id,
            'start_at'   => now()->subDay()->format('Y-m-d H:i:s'),
        ]);

        $response->assertSessionHasErrors('start_at');
        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_予約一覧には自分の予約だけが表示される(): void
    {
        $me = User::factory()->create();
        $other = User::factory()->create();

        Booking::factory()->create(['user_id' => $me->id]);
        Booking::factory()->create(['user_id' => $other->id]);

        $response = $this->actingAs($me)->get(route('bookings.index'));

        $response->assertInertia(
            fn ($page) => $page->component('Booking/Index')->has('bookings', 1),
        );
    }

    public function test_自分の予約はキャンセルできる(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user)->patch(route('bookings.cancel', $booking));

        $response->assertRedirect();
        $this->assertSame('cancelled', $booking->fresh()->status);
    }

    public function test_他人の予約はキャンセルできない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $owner->id, 'status' => 'pending']);

        $response = $this->actingAs($attacker)->patch(route('bookings.cancel', $booking));

        $response->assertForbidden();
        $this->assertSame('pending', $booking->fresh()->status);
    }

    public function test_予約完了ページは本人以外見られない(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->get(route('bookings.complete', $booking));

        $response->assertForbidden();
    }
}
