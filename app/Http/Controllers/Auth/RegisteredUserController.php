<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 会員登録を担当するController（Laravel Breeze自動生成）
 */
class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * GET /register → 会員登録フォームを表示
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     * POST /register → 入力内容を検証し、新規ユーザーを作成してそのままログインさせる
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // unique:App\Models\User = usersテーブルの中で同じメールアドレスが無いかチェック
        // Rules\Password::defaults() = Laravelが推奨する強度（最低文字数など）を満たすかチェック
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Hash::make() = パスワードを平文のまま保存せず、不可逆なハッシュ値に変換する（セキュリティの基本）
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // event(new Registered($user)) = 「登録された」というイベントを発火する
        // Laravel標準の仕組みで、これをきっかけに確認メール送信などが自動的に走る
        event(new Registered($user));

        // 登録した勢いでそのままログイン状態にする
        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
