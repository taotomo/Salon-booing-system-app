<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// Model = データベースの1つのテーブル（ここではusersテーブル）を表すクラス（Laravelの機能：Eloquent ORM）
// SQLを直接書かなくても、User::find(1) やUser::create([...]) のようなPHPのコードでDB操作ができる
// #[Fillable(...)] = まとめて保存してよい列を属性(Attribute)として指定する書き方（fillableプロパティの代わり）
// #[Hidden(...)]   = JSONに変換するとき（Reactに渡すとき）に絶対含めたくない列（パスワード等）を指定する
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * このユーザーが所有しているサロン一覧（オーナーの場合）
     * Salon::owner() の逆方向のリレーション
     *
     * 使い方: $user->salons で所有サロン一覧を取得
     *         $user->salons()->exists() でオーナーかどうかを判定
     */
    public function salons()
    {
        return $this->hasMany(Salon::class);
    }

    /**
     * このユーザーのお気に入りレコード一覧（favoritesテーブルそのもの）
     * 追加・削除（firstOrCreate/delete）はこちらを使う
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * このユーザーがお気に入り登録しているサロン一覧
     * belongsToMany = 間に中間テーブル（favorites）を挟んだ多対多のリレーション
     * 「1人のユーザーは複数のサロンをお気に入りにできる／1つのサロンは複数のユーザーからお気に入りにされる」
     *
     * 使い方: $user->favoriteSalons で一覧を取得（表示用）
     */
    public function favoriteSalons()
    {
        return $this->belongsToMany(Salon::class, 'favorites');
    }
}
