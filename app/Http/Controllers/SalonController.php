<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * 一般ユーザー向けのサロン検索・一覧・詳細表示を担当するController
 * ログイン不要で誰でもアクセスできる（routes/web.phpでauthミドルウェアの外側に定義）
 */
class SalonController extends Controller
{
    /**
     * サロン一覧ページを表示する
     * URL: GET /salons?area=東京都&genre=hair&sort=rating&page=2
     *
     * 以前はSalon::get()で全件取得し、絞り込み・並び替えをブラウザ側（React側）で行っていた。
     * サロン件数が増えると「毎回全件をブラウザに送る」のは無駄が大きいため、
     * ここではURLのクエリパラメータを受け取り、データベース側で絞り込み・並び替え・
     * ページ分割（ページネーション）までを行ってから、必要な分だけをReact側に渡す
     */
    public function index(Request $request)
    {
        // query() = URLの ?area=... のような部分（クエリパラメータ）を読み取る
        // 指定が無ければnullになる
        $area  = $request->query('area');
        $genre = $request->query('genre');
        $sort  = $request->query('sort', 'recommended');

        $salons = Salon::query()
            ->with(['reviews', 'services'])
            // when(条件, 真の場合の処理) = 条件がtruthyなときだけクエリに条件を追加する
            // area・genreが指定されていない（null）ときは、この条件を一切付けない
            ->when($area, fn ($query) => $query->where('address', 'like', "{$area}%"))
            ->when($genre, fn ($query) => $query->where('genre', $genre))
            ->when(
                $sort === 'rating',
                // withAvg('reviews', 'rating') = サロンごとに「レビューのrating列の平均」を
                // reviews_avg_rating という列名で一緒に計算してくれる（N+1を避けつつ集計できる）
                fn ($query) => $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating'),
                fn ($query) => $query->orderBy('id'),
            )
            // paginate(6) = 6件ずつに分割し、URLの ?page=2 に応じたページ分だけ取得する
            // withQueryString() = ページ番号のリンクにも ?area=... などの条件を引き継がせる
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('Salons/Index', [
            'salons'           => $salons,
            'areaOptions'      => $this->areaOptions(),
            'filters'          => [
                'area'  => $area,
                'genre' => $genre,
                'sort'  => $sort,
            ],
            'favoriteSalonIds' => $this->favoriteSalonIds(),
        ]);
    }

    /**
     * サロン詳細ページを表示する
     * URL: GET /salons/{salon}
     *
     * 引数の Salon $salon = ルートモデルバインディング
     * /salons/1 にアクセスすると id=1 のサロンを自動取得してくれる
     */
    public function show(Salon $salon)
    {
        // load() = 関連データを遅延読み込みする
        // 'staffs'       = スタッフ一覧
        // 'services'     = メニュー一覧
        // 'reviews.user' = レビュー + それぞれのユーザー情報も一緒に取得
        $salon->load(['staffs', 'services', 'reviews.user']);

        // ログイン中なら「このユーザーが既にお気に入り登録しているか」も一緒に渡す
        $isFavorited = auth()->check()
            && auth()->user()->favorites()->where('salon_id', $salon->id)->exists();

        return Inertia::render('Salons/Show', [
            'salon'       => $salon,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * エリア絞り込み用のプルダウンの選択肢を作る
     * 登録されている全サロンの住所から、都道府県の部分だけを取り出してユニークにする
     *
     * @return array<int, string>
     */
    private function areaOptions(): array
    {
        return Salon::pluck('address')
            ->map(function (string $address) {
                // 正規表現で「先頭2〜3文字＋都/道/府/県のいずれか」を取り出す
                // 例: "東京都渋谷区..." → "東京都" / "神奈川県横浜市..." → "神奈川県"
                preg_match('/^.{2,3}?[都道府県]/u', $address, $matches);

                return $matches[0] ?? null;
            })
            ->filter() // nullを取り除く
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    /**
     * ログイン中のユーザーがお気に入り登録しているサロンIDの一覧
     * カードにハートマーク（塗りつぶし/枠線）を出し分けるために使う
     *
     * @return array<int, int>
     */
    private function favoriteSalonIds(): array
    {
        if (! auth()->check()) {
            return [];
        }

        return auth()->user()->favorites()->pluck('salon_id')->all();
    }
}
