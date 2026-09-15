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
                // salonsはpaginate()の結果なので、実際の一覧は salons.data に入っている
                ->has('salons.data', 3),
        );
    }

    public function test_エリアで絞り込める(): void
    {
        Salon::factory()->create(['address' => '東京都渋谷区道玄坂1-2-3']);
        Salon::factory()->create(['address' => '大阪府大阪市北区梅田1-3-1']);

        $response = $this->get(route('salons.index', ['area' => '東京都']));

        $response->assertInertia(
            fn (Assert $page) => $page->has('salons.data', 1),
        );
    }

    public function test_ジャンルで絞り込める(): void
    {
        Salon::factory()->create(['genre' => 'hair']);
        Salon::factory()->create(['genre' => 'nail']);

        $response = $this->get(route('salons.index', ['genre' => 'nail']));

        $response->assertInertia(
            fn (Assert $page) => $page->has('salons.data', 1),
        );
    }

    public function test_1ページに6件までしか表示されない(): void
    {
        Salon::factory()->count(9)->create();

        $response = $this->get(route('salons.index'));

        $response->assertInertia(
            fn (Assert $page) => $page
                ->has('salons.data', 6)
                ->where('salons.total', 9)
                ->where('salons.last_page', 2),
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
