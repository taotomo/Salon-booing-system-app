<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Inertia\Inertia;

/**
 * マイページ（一般ユーザー向けダッシュボード）を担当するController
 * オーナー向けのダッシュボードは別クラス（Owner/OwnerDashboardController）になっている
 */
class DashboardController extends Controller
{
    /**
     * マイページ（ダッシュボード）を表示する
     * URL: GET /dashboard
     *
     * ログイン中のユーザーの「直近の予約」と「投稿したレビュー」を
     * まとめて表示し、予約履歴・サロン一覧への入り口にする
     */
    public function index()
    {
        $userId = auth()->id();

        // 直近の予約を新しい順に3件だけ取得する（一覧は/bookingsで全件見られる）
        $recentBookings = Booking::with(['salon', 'staff', 'service'])
            ->where('user_id', $userId)
            ->orderBy('start_at', 'desc')
            ->limit(3)
            ->get();

        // 投稿したレビューを新しい順に3件だけ取得する
        $recentReviews = Review::with('salon')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        // お気に入り登録したサロンを新しい順に3件だけ取得する
        $favoriteSalons = auth()->user()
            ->favoriteSalons()
            ->latest('favorites.created_at')
            ->limit(3)
            ->get();

        return Inertia::render('Dashboard', [
            'recentBookings'  => $recentBookings,
            'recentReviews'   => $recentReviews,
            'favoriteSalons'  => $favoriteSalons,
            // 予約履歴ページ側で「全件見る」リンクを出すかどうかの判定に使う
            'bookingCount'    => Booking::where('user_id', $userId)->count(),
            'favoriteCount'   => auth()->user()->favorites()->count(),
        ]);
    }
}
