<?php

namespace Tests\Feature\Owner;

use App\Models\Salon;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_所有者はメニューを登録できる(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)->post(route('owner.services.store', $salon), [
            'name'     => 'ヘッドスパ',
            'price'    => 5000,
            'duration' => 40,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('services', [
            'salon_id' => $salon->id,
            'name'     => 'ヘッドスパ',
        ]);
    }

    public function test_価格や所要時間が不正だと登録できない(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)->post(route('owner.services.store', $salon), [
            'name'     => '不正メニュー',
            'price'    => -100, // マイナス価格は不正
            'duration' => 40,
        ]);

        $response->assertSessionHasErrors('price');
        $this->assertDatabaseMissing('services', ['name' => '不正メニュー']);
    }

    public function test_他人のサロンのメニューは更新削除できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);
        $service = Service::factory()->create(['salon_id' => $salon->id, 'name' => '元のメニュー']);

        $updateResponse = $this->actingAs($attacker)->put(route('owner.services.update', $service), [
            'name'     => '乗っ取りメニュー',
            'price'    => 1000,
            'duration' => 30,
        ]);
        $updateResponse->assertForbidden();
        $this->assertSame('元のメニュー', $service->fresh()->name);

        $deleteResponse = $this->actingAs($attacker)->delete(route('owner.services.destroy', $service));
        $deleteResponse->assertForbidden();
        $this->assertDatabaseHas('services', ['id' => $service->id]);
    }
}
