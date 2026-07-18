<?php

namespace Tests\Unit\Models;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Salonモデルの単体テスト
 *
 * 【何を確認するか】
 * リレーション（belongsTo/hasMany）が正しく定義されていて、
 * 想定通りのモデルを取得できるかを確認する。
 * コントローラーやビューを経由しない「モデル単体」のテストなのでUnitに置いている。
 */
class SalonTest extends TestCase
{
    use RefreshDatabase;

    public function test_サロンは1人のオーナーに属している(): void
    {
        $owner = User::factory()->create();
        $salon = Salon::factory()->create(['user_id' => $owner->id]);

        $this->assertTrue($salon->owner->is($owner));
    }

    public function test_サロンは複数のスタッフを持てる(): void
    {
        $salon = Salon::factory()->create();
        Staff::factory()->count(3)->create(['salon_id' => $salon->id]);

        $this->assertCount(3, $salon->staffs);
    }

    public function test_サロンは複数のメニューを持てる(): void
    {
        $salon = Salon::factory()->create();
        Service::factory()->count(2)->create(['salon_id' => $salon->id]);

        $this->assertCount(2, $salon->services);
    }

    public function test_サロンは複数のレビューを持てる(): void
    {
        $salon = Salon::factory()->create();
        Review::factory()->count(2)->create(['salon_id' => $salon->id]);

        $this->assertCount(2, $salon->reviews);
    }

    public function test_サロンは複数の予約を持てる(): void
    {
        $salon = Salon::factory()->create();
        Booking::factory()->count(2)->create(['salon_id' => $salon->id]);

        $this->assertCount(2, $salon->bookings);
    }

    public function test_緯度経度はfloat型として取得できる(): void
    {
        // DB上はdecimal型で保存されるため、キャストしないと文字列("35.6580000")になってしまう
        // フロント側の距離計算（引き算）でバグらないよう、float型に変換されることを確認する
        $salon = Salon::factory()->create(['lat' => 35.658, 'lng' => 139.6994]);

        $this->assertIsFloat($salon->fresh()->lat);
        $this->assertIsFloat($salon->fresh()->lng);
    }
}
