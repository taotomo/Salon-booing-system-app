<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Staff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * サロン一覧・詳細ページの結合テスト
 *
 * 【何を確認するか】
 * HTTPリクエストを実際に送り、コントローラー→DB→Inertiaレスポンスまでの
 * 一連の流れが正しく動くかを確認する（ログイン不要のページ）。
 */
class SalonTest extends TestCase
{
    use RefreshDatabase;

    public function test_サロン一覧ページはログインなしで表示できる(): void
    {
        Salon::factory()->count(3)->create();

        $response = $this->get(route('salons.index'));

        $response->assertOk();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Salons/Index')
                ->has('salons', 3),
        );
    }

    public function test_サロン詳細ページにスタッフメニュー口コミが含まれる(): void
    {
        $salon = Salon::factory()->create();
        Staff::factory()->count(2)->create(['salon_id' => $salon->id]);
        Service::factory()->count(2)->create(['salon_id' => $salon->id]);
        Review::factory()->count(1)->create(['salon_id' => $salon->id]);

        $response = $this->get(route('salons.show', $salon));

        $response->assertOk();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Salons/Show')
                ->where('salon.id', $salon->id)
                ->has('salon.staffs', 2)
                ->has('salon.services', 2)
                ->has('salon.reviews', 1),
        );
    }

    public function test_存在しないサロンにアクセスすると404になる(): void
    {
        $response = $this->get('/salons/9999');

        $response->assertNotFound();
    }
}
