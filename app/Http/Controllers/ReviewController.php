<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

/**
 * レビュー（口コミ）の投稿・編集・削除を担当するController
 * update/destroyでは「投稿した本人かどうか」をabort_ifでチェックしている
 * （ロール列やポリシークラスは使わず、user_idの一致だけで判定するこのプロジェクト共通のパターン）
 */
class ReviewController extends Controller
{
    /**
     * レビューをDBに保存する
     * URL: POST /reviews
     *
     * レビューは「書くページ」は不要で、サロン詳細ページから直接送信する設計
     */
    public function store(Request $request)
    {
        // バリデーション
        // min:1|max:5 = 評価は1、5の間の整数のみ許可
        $validated = $request->validate([
            'salon_id' => 'required|exists:salons,id',
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string|max:1000',
        ]);

        // ログイン中のユーザーのidを付与
        $validated['user_id'] = auth()->id();

        // DBに保存
        Review::create($validated);

        // 投稿元のサロン詳細ページに戻る
        return back()->with('success', 'レビューを投稿しました！');
    }

    /**
     * 自分のレビューを編集する
     * URL: PUT /reviews/{review}
     */
    public function update(Request $request, Review $review)
    {
        // 他人のレビューを書き換えられないようにする（IDOR対策）
        abort_if($review->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        return back()->with('success', 'レビューを更新しました。');
    }

    /**
     * 自分のレビューを削除する
     * URL: DELETE /reviews/{review}
     */
    public function destroy(Review $review)
    {
        abort_if($review->user_id !== auth()->id(), 403);

        $review->delete();

        return back()->with('success', 'レビューを削除しました。');
    }
}
