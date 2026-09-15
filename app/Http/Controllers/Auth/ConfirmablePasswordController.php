<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 「重要な操作の前にもう一度パスワードを確認する」画面のController（Laravel Breeze自動生成）
 * このプロジェクトでは退会（アカウント削除）前の確認に使われている
 */
class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirm the user's password.
     * ログイン中のユーザーのメールと、入力されたパスワードが正しい組み合わせかだけを検証する
     * （ログイン処理そのものではなく、あくまで「本人確認」のためのチェック）
     */
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        // 確認できた時刻をセッションに記録しておく（一定時間は再確認を求めない、等の用途に使われる）
        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
