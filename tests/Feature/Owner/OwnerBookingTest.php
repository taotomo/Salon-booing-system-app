<?php

namespace Tests\Feature\Owner;

use App\Models\Booking;
use App\Models\Salon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_自分のサロン宛の予約だけが一覧に表示される(): void
    {
        $owner = User::factory()->create();
        $mySalon = Salon::factory()->create(['user_id' => $owner->id]);
        $otherSalon = Salon::factory()->create();

        Booking::factory()->create(['salon_id' => $mySalon->id]);
        Booking::factory()->create(['salon_id' => $otherSalon->id]);

        $response = $this->actingAs($owner)->get(route('owner.bookings.index'));

        $response->assertInertia(
            fn ($page) => $page->component('Owner/Bookings/Index')->has('bookings', 1),
        );
    }

    public function test_所有者は自分のサロン宛の予約を承認できる(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $booking = Booking::factory()->create(['salon_id' => $salon->id, 'status' => 'pending']);

        $response = $this->actingAs($owner)->patch(route('owner.bookings.updateStatus', $booking), [
            'status' => 'confirmed',
        ]);

        $response->assertRedirect();
        $this->assertSame('confirmed', $booking->fresh()->status);
    }

    public function test_他人のサロン宛の予約は承認もキャンセルもできない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $booking = Booking::factory()->create(['salon_id' => $salon->id, 'status' => 'pending']);

        $response = $this->actingAs($attacker)->patch(route('owner.bookings.updateStatus', $booking), [
            'status' => 'confirmed',
        ]);

        $response->assertForbidden();
        $this->assertSame('pending', $booking->fresh()->status);
    }

    public function test_不正なステータス値は拒否される(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $booking = Booking::factory()->create(['salon_id' => $salon->id, 'status' => 'pending']);

        // in:confirmed,cancelled 以外は許可しない（例えば直接pendingに戻すことはできない）
        $response = $this->actingAs($owner)->patch(route('owner.bookings.updateStatus', $booking), [
            'status' => 'pending',
        ]);

        $response->assertSessionHasErrors('status');
    }
}
