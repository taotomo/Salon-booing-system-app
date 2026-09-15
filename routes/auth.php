<?php

// このファイルはLaravel Breeze（認証機能を自動生成してくれるスターターキット）が
// 最初から用意してくれたルート定義。ログイン・会員登録・パスワード再設定・メール認証など、
// 「ログイン周りの一連の機能」だけをここにまとめている（routes/web.phpの末尾でrequireされている）
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// middleware('guest') = 「まだログインしていない人」だけがアクセスできるグループ
// すでにログイン済みの人がここに来ると、自動的にダッシュボードなどにリダイレクトされる
Route::middleware('guest')->group(function () {
    // GET  /register → 会員登録フォームを表示（create）
    // POST /register → フォームの入力内容を受け取ってユーザーを作成（store）
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    // GET  /login → ログインフォームを表示
    // POST /login → 入力されたメール・パスワードを検証してログイン処理
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // パスワードを忘れた場合の「再設定メール送信フォーム」
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    // メールに記載された再設定用リンク（{token}はメールのURLに埋め込まれる一時的な認証コード）
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// middleware('auth') = 「ログイン済みの人」だけがアクセスできるグループ
Route::middleware('auth')->group(function () {
    // メールアドレス確認を促す画面（「確認メールを送りました」等の案内ページ）
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    // メール内の確認リンクをクリックしたときに呼ばれる
    // middleware(['signed', ...]) = URLが改ざんされていないかを署名で検証する仕組み（Laravelの機能）
    // throttle:6,1 = 1分間に6回までしかアクセスできないようにする（連打・攻撃対策）
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // 「確認メールを再送信する」ボタンから呼ばれる
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // 重要な操作（例：退会）の前にもう一度パスワード入力を求める画面
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // プロフィール画面からパスワードを変更する
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // ログアウト（POSTなのはCSRF対策上、GETリンクでログアウトさせないため）
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
