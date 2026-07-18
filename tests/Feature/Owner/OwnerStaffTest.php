<?php

namespace Tests\Feature\Owner;

use App\Models\Salon;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerStaffTest extends TestCase
{
    use RefreshDatabase;

    public function test_所有者はスタッフを登録できる(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)->post(route('owner.staffs.store', $salon), [
            'name'     => '新人 スタイリスト',
            'position' => 'スタイリスト',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('staffs', [
            'salon_id' => $salon->id,
            'name'     => '新人 スタイリスト',
        ]);
    }

    public function test_他人のサロンにはスタッフを登録できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($attacker)->post(route('owner.staffs.store', $salon), [
            'name' => '不正登録',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('staffs', ['name' => '不正登録']);
    }

    public function test_所有者は自分のサロンのスタッフを更新削除できる(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $staff = Staff::factory()->create(['salon_id' => $salon->id]);

        $updateResponse = $this->actingAs($owner)->put(route('owner.staffs.update', $staff), [
            'name' => '更新後の名前',
        ]);
        $updateResponse->assertRedirect();
        $this->assertSame('更新後の名前', $staff->fresh()->name);

        $deleteResponse = $this->actingAs($owner)->delete(route('owner.staffs.destroy', $staff));
        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('staffs', ['id' => $staff->id]);
    }

    public function test_他人のサロンのスタッフは更新削除できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $staff = Staff::factory()->create(['salon_id' => $salon->id, 'name' => '元の名前']);

        $updateResponse = $this->actingAs($attacker)->put(route('owner.staffs.update', $staff), [
            'name' => '乗っ取り',
        ]);
        $updateResponse->assertForbidden();
        $this->assertSame('元の名前', $staff->fresh()->name);

        $deleteResponse = $this->actingAs($attacker)->delete(route('owner.staffs.destroy', $staff));
        $deleteResponse->assertForbidden();
        $this->assertDatabaseHas('staffs', ['id' => $staff->id]);
    }
}
