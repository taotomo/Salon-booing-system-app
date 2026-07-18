<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

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
}
