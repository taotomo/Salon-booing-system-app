<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Notifications\BookingStatusUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * サロンオーナー向けの予約管理（一覧確認・承認/キャンセル）を担当するController
 */
class OwnerBookingController extends Controller
{
    /**
     * 自分のサロン宛の予約一覧
     * URL: GET /owner/bookings
     *
     * whereHas = 「関連するsalonのuser_idが自分のidである予約」だけに絞り込む
     * （自分のサロン以外の予約が混ざらないようにする）
     */
    public function index()
    {
        $bookings = Booking::with(['salon', 'staff', 'service', 'user'])
            ->whereHas('salon', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->orderBy('start_at', 'desc')
            ->get();

        return Inertia::render('Owner/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * 予約ステータスを更新する（承認／キャンセル）
     * URL: PATCH /owner/bookings/{booking}/status
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        // 自分のサロン宛の予約以外は操作させない（IDOR対策）
        abort_if($booking->salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'status' => 'required|in:confirmed,cancelled',
        ]);

        $booking->update($validated);

        // 予約したユーザーに「確定/キャンセルされました」と通知する
        $booking->load('user');
        $booking->user->notify(new BookingStatusUpdated($booking));

        return back()->with('success', '予約ステータスを更新しました。');
    }
}
