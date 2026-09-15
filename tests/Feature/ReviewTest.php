<?php

namespace Tests\Feature;

use App\Models\Review;
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

    public function test_自分のレビューは編集できる(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $user->id, 'rating' => 3]);

        $response = $this->actingAs($user)->put(route('reviews.update', $review), [
            'rating'  => 5,
            'comment' => '更新後のコメント',
        ]);

        $response->assertRedirect();
        $this->assertSame(5, $review->fresh()->rating);
        $this->assertSame('更新後のコメント', $review->fresh()->comment);
    }

    public function test_他人のレビューは編集できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $owner->id, 'rating' => 3]);

        $response = $this->actingAs($attacker)->put(route('reviews.update', $review), [
            'rating' => 1,
        ]);

        $response->assertForbidden();
        $this->assertSame(3, $review->fresh()->rating);
    }

    public function test_自分のレビューは削除できる(): void
    {
        $user = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('reviews.destroy', $review));

        $response->assertRedirect();
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_他人のレビューは削除できない(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $review = Review::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($attacker)->delete(route('reviews.destroy', $review));

        $response->assertForbidden();
        $this->assertDatabaseHas('reviews', ['id' => $review->id]);
    }
}
