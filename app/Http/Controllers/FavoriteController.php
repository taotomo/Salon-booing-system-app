<?php

namespace App\Http\Controllers;

use App\Models\Salon;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * お気に入り（ブックマーク）機能を担当するController
 * 「誰が・どのサロンを」お気に入りにしたかは、User⇔Salonの中間テーブルであるFavoriteモデルで管理する
 */
class FavoriteController extends Controller
{
    /**
     * お気に入り一覧ページ
     * URL: GET /favorites
     */
    public function index()
    {
        $salons = auth()->user()
            ->favoriteSalons()
            ->with('reviews')
            ->get();

        return Inertia::render('Favorites/Index', [
            'salons' => $salons,
        ]);
    }

    /**
     * サロンをお気に入りに追加する
     * URL: POST /favorites
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'salon_id' => 'required|exists:salons,id',
        ]);

        // firstOrCreate = 既にある場合は何もせず取得だけ、無ければ作成する
        // 同じサロンを二重登録しようとしてもエラーにならず安全
        auth()->user()->favorites()->firstOrCreate([
            'salon_id' => $validated['salon_id'],
        ]);

        return back()->with('success', 'お気に入りに追加しました。');
    }

    /**
     * サロンをお気に入りから外す
     * URL: DELETE /favorites/{salon}
     */
    public function destroy(Salon $salon)
    {
        auth()->user()->favorites()->where('salon_id', $salon->id)->delete();

        return back()->with('success', 'お気に入りを解除しました。');
    }
}
