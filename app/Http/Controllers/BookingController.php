<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Salon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * 予約フォームページを表示する
     * URL: GET /salons/{salon}/bookings/create
     *
     * どのサロンへの予約かを特定するため Salon $salon を受け取る
     */
    public function create(Salon $salon)
    {
        // 予約フォームに必要なスタッフとメニューも一緒に渡す
        $salon->load(['staffs', 'services']);

        return Inertia::render('Booking/Create', [
            'salon' => $salon,
        ]);
    }

    /**
     * 予約をDBに保存する
     * URL: POST /bookings
     *
     * Request $request = フォームから送信されたデータを受け取る
     */
    public function store(Request $request)
    {
        // バリデーション = 入力値のチェック
        // required = 必須入力
        // exists   = 指定テーブルに存在する値かチェック
        $validated = $request->validate([
            'salon_id'   => 'required|exists:salons,id',
            'staff_id'   => 'required|exists:staffs,id',
            'service_id' => 'required|exists:services,id',
            'start_at'   => 'required|date|after:now', // 現在以降の日時のみ許可
            'note'       => 'nullable|string|max:500',
        ]);

        // ログイン中のユーザーのidを自動で付与
        // auth()->id() = 現在ログインしているユーザーのidを取得
        $validated['user_id'] = auth()->id();

        // DBに保存する
        $booking = Booking::create($validated);

        // 保存後は専用の予約完了ページにリダイレクトする
        return redirect()->route('bookings.complete', $booking)
            ->with('success', '予約を受け付けました！');
    }

    /**
     * 予約完了ページを表示する
     * URL: GET /bookings/{booking}/complete
     */
    public function complete(Booking $booking)
    {
        // 他人の予約完了ページを直接URLで見られないようにする
        abort_if($booking->user_id !== auth()->id(), 403);

        $booking->load(['salon', 'staff', 'service']);

        return Inertia::render('Booking/Complete', [
            'booking' => $booking,
        ]);
    }

    /**
     * ログイン中のユーザーの予約一覧を表示する
     * URL: GET /bookings
     */
    public function index()
    {
        // ログイン中のユーザーの予約のみ取得
        // with() で関連情報も一緒に取得し画面に表示できるようにする
        $bookings = Booking::with(['salon', 'staff', 'service'])
            ->where('user_id', auth()->id())
            ->orderBy('start_at', 'desc') // 日時の降順に並び替え
            ->get();

        return Inertia::render('Booking/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * 予約をキャンセルする
     * URL: PATCH /bookings/{booking}/cancel
     *
     * 自分の予約以外はキャンセルできないようにする（IDOR対策）
     */
    public function cancel(Booking $booking)
    {
        // 他人の予約IDをURLで指定してキャンセルされないようにガードする
        abort_if($booking->user_id !== auth()->id(), 403);

        $booking->update(['status' => 'cancelled']);

        return back()->with('success', '予約をキャンセルしました。');
    }
}
