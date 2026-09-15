<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Salon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_ログインユーザーはサロンをお気に入りに追加できる(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();

        $response = $this->actingAs($user)->post(route('favorites.store'), [
            'salon_id' => $salon->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('favorites', [
            'user_id'  => $user->id,
            'salon_id' => $salon->id,
        ]);
    }

    public function test_同じサロンを二重にお気に入り登録してもエラーにならず1件のまま(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();

        $this->actingAs($user)->post(route('favorites.store'), ['salon_id' => $salon->id]);
        $this->actingAs($user)->post(route('favorites.store'), ['salon_id' => $salon->id]);

        $this->assertSame(
            1,
            Favorite::where('user_id', $user->id)->where('salon_id', $salon->id)->count(),
        );
    }

    public function test_お気に入りから削除できる(): void
    {
        $user = User::factory()->create();
        $salon = Salon::factory()->create();
        Favorite::factory()->create(['user_id' => $user->id, 'salon_id' => $salon->id]);

        $response = $this->actingAs($user)->delete(route('favorites.destroy', $salon));

        $response->assertRedirect();
        $this->assertDatabaseMissing('favorites', [
            'user_id'  => $user->id,
            'salon_id' => $salon->id,
        ]);
    }

    public function test_未ログインではお気に入りに追加できない(): void
    {
        $salon = Salon::factory()->create();

        $response = $this->post(route('favorites.store'), ['salon_id' => $salon->id]);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_お気に入り一覧には自分が登録したサロンだけが表示される(): void
    {
        $user = User::factory()->create();
        $mySalon = Salon::factory()->create();
        $otherSalon = Salon::factory()->create();

        Favorite::factory()->create(['user_id' => $user->id, 'salon_id' => $mySalon->id]);
        Favorite::factory()->create(['salon_id' => $otherSalon->id]); // 他人のお気に入り

        $response = $this->actingAs($user)->get(route('favorites.index'));

        $response->assertInertia(
            fn ($page) => $page->component('Favorites/Index')->has('salons', 1),
        );
    }
}
