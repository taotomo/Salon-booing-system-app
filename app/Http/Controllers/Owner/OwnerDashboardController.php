<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OwnerDashboardController extends Controller
{
    /**
     * オーナーのダッシュボード（トップページ）
     * URL: GET /owner/dashboard
     *
     * ログイン中のユーザーが所有しているサロン一覧と、
     * サロンごとの「申請中の予約件数」を表示する
     */
    public function index()
    {
        // withCount で「関連データの件数」だけをまとめて取得できる（N+1問題対策）
        // pending_bookings_count という名前で、statusがpendingの予約数だけを数える
        $salons = auth()->user()->salons()
            ->withCount(['bookings as pending_bookings_count' => function ($query) {
                $query->where('status', 'pending');
            }])
            ->get();

        return Inertia::render('Owner/Dashboard', [
            'salons' => $salons,
        ]);
    }
}
