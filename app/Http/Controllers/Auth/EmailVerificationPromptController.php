<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 「メールアドレスの確認をお願いします」という案内ページのController（Laravel Breeze自動生成）
 */
class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     * __invoke() = このクラス1つにつき処理は1つだけ、というときに使う特別なメソッド名
     * （ルート定義側もEmailVerificationPromptController::classとだけ書けば呼び出せる）
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
