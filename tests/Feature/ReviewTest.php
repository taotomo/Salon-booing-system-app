<?php

namespace Tests\Feature;

use App\Models\Salon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * レビュー投稿の結合テスト
 */
class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_ログインユーザーはレビューを投稿できる(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'salon_id' => $salon->id,
            'rating'   => 5,
            'comment'  => 'とても良かったです',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reviews', [
            'user_id'  => $user->id,
            'salon_id' => $salon->id,
            'rating'   => 5,
        ]);
    }

    public function test_未ログインではレビューを投稿できない(): void
    {
        $salon = Salon::factory()->create();

        $response = $this->post(route('reviews.store'), [
            'salon_id' => $salon->id,
            'rating'   => 5,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('reviews', 0);
    }

    public function test_評価は1から5の範囲外だとエラーになる(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'salon_id' => $salon->id,
            'rating'   => 6, // 範囲外（1〜5のみ許可）
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseCount('reviews', 0);
    }
}
