<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * プロフィール編集（名前・メール変更、退会）を担当するController（Laravel Breeze自動生成）
 */
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     * GET /profile → プロフィール編集画面を表示
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     * PATCH /profile → 名前・メールアドレスを更新する
     * バリデーションはProfileUpdateRequestクラスに切り出されている（Form Request）
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // fill() = 渡された配列の値をモデルのプロパティにまとめてセットする（まだ保存はしない）
        $request->user()->fill($request->validated());

        // isDirty('email') = 「email列の値が変更されているか」を判定する
        // メールアドレスを変えたら、確認済みフラグを一旦リセットして再確認を求める
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     * DELETE /profile → アカウント自体を削除する（退会）
     */
    public function destroy(Request $request): RedirectResponse
    {
        // 'current_password'ルール = 今のパスワードが正しいか自動チェック（誤操作・なりすまし対策）
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
