<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalonController extends Controller
{
    /**
     * サロン一覧ページを表示する
     * URL: GET /salons
     *
     * Inertia::render() = LaravelからReactにデータを渡す方法
     * 第1引数: 表示するReactページ（resources/js/Pages/Salons/Index.tsx）
     * 第2引数: Reactに渡すデータ（配列形式）
     * その第２引数は'Saloms/Index'のことで、resources/js/Pages/Salons/Index.tsxのことを指す
     *
     * 'salons' => $salons の部分は、React側で props.salons で受け取れる
     * props = React側で受け取るデータのこと
     */
    public function index()
    {
        // 全サロンを取得する
        // with() = 関連データも一緒に取得（N+1問題対策）
        // 'reviews'  = レビューも取得して平均評価などに使えるようにする
        // 'services' = 一覧カードに「最安値」「代表メニュー」を表示するために必要
        $salons = Salon::with(['reviews', 'services'])->get();

        return Inertia::render('Salons/Index', [
            'salons' => $salons,
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

        return Inertia::render('Salons/Show', [
            'salon' => $salon,
        ]);
    }
}
