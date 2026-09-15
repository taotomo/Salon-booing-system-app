<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ログイン・ログアウトを担当するController（Laravel Breeze自動生成）
 * 「セッション」＝ログイン状態をサーバー側で覚えておく仕組みそのものを表すクラス名になっている
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     * GET /login → ログインフォームを表示
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     * POST /login → 送信されたメール・パスワードでログインを試みる
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 実際の認証処理はLoginRequest::authenticate()にまとめてある（このControllerは呼ぶだけ）
        $request->authenticate();

        // regenerate() = セッションIDを新しく発行し直す（セッション固定化攻撃対策。ログイン直後のお約束）
        $request->session()->regenerate();

        // intended() = ログイン前にアクセスしようとしていたページがあればそこへ、無ければdashboardへ
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     * POST /logout → ログアウトする
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        // invalidate() = セッションの中身を全て破棄する
        $request->session()->invalidate();

        // regenerateToken() = CSRFトークン（不正なフォーム送信を防ぐための合言葉）を作り直す
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
