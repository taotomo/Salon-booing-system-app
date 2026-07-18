<?php

namespace Tests\Feature\Owner;

use App\Models\Salon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * オーナーによるサロン編集の結合テスト
 *
 * 【重点確認事項】
 * URLの{salon}を他人のサロンIDに書き換えても編集できないこと（IDOR対策）
 */
class OwnerSalonTest extends TestCase
{
    use RefreshDatabase;

    public function test_所有者は自分のサロンを編集できる(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)->put(route('owner.salons.update', $salon), [
            'genre'       => 'hair',
            'name'        => '新しいサロン名',
            'address'     => '東京都渋谷区1-1-1',
            'phone'       => null,
            'description' => null,
            'image'       => null,
            'lat'         => null,
            'lng'         => null,
        ]);

        $response->assertRedirect();
        $this->assertSame('新しいサロン名', $salon->fresh()->name);
    }

    public function test_他人のサロンは編集フォームすら開けない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($attacker)->get(route('owner.salons.edit', $salon));

        $response->assertForbidden();
    }

    public function test_他人のサロンは更新できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id, 'name' => '元の名前']);

        $response = $this->actingAs($attacker)->put(route('owner.salons.update', $salon), [
            'genre'   => 'hair',
            'name'    => '乗っ取り',
            'address' => '不正な住所',
        ]);

        $response->assertForbidden();
        $this->assertSame('元の名前', $salon->fresh()->name);
    }

    public function test_未ログインではサロン編集画面にアクセスできない(): void
    {
        $salon = Salon::factory()->create();

        $response = $this->get(route('owner.salons.edit', $salon));

        $response->assertRedirect(route('login'));
    }
}
