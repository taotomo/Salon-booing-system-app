<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * プロフィール編集フォーム専用のバリデーションクラス（Laravelの機能：Form Request）
 *
 * Controllerの中に直接バリデーションルールを書く代わりに、専用クラスに切り出したもの。
 * ProfileController::update()の引数型をこのクラスにしておくだけで、
 * 送信されたデータが自動的にrules()でチェックされ、不正なら自動でエラー画面に戻る
 */
class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                // Rule::unique(User::class)->ignore(...) = 「メールアドレスの重複禁止」ルールだが、
                // 自分自身のレコードは重複チェックから除外する（変更せず保存し直しただけでもエラーにならないようにする）
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
