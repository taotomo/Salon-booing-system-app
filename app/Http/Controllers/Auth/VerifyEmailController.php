<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

/**
 * メール本文の確認リンクをクリックしたときに呼ばれるController（Laravel Breeze自動生成）
 * 引数の EmailVerificationRequest は、URLの署名(signed)とidの整合性を自動でチェックしてくれる
 * 専用のForm Request（改ざんされたリンクを弾く）
 */
class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // 既に確認済みなら、二重処理せずそのままダッシュボードへ
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        // markEmailAsVerified() = users.email_verified_atに現在時刻を保存する（Userモデルの標準機能）
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
