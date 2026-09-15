<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

/**
 * プロフィール画面からパスワードを変更するController（Laravel Breeze自動生成）
 */
class PasswordController extends Controller
{
    /**
     * Update the user's password.
     * PUT /password → ログイン中のユーザー自身のパスワードを変更する
     */
    public function update(Request $request): RedirectResponse
    {
        // 'current_password' ルール = 「今のパスワード」が実際に正しいかを自動でチェックしてくれる
        // 'confirmed'         ルール = password_confirmation欄と一致するかを自動でチェックする
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
