<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * favoritesテーブルに対応するModel（Laravelの機能：Eloquent ORM）
 * 「どのユーザーがどのサロンをお気に入り登録したか」を表す中間テーブル的な存在
 * マイグレーションで [user_id, salon_id] にunique制約を付けているため、
 * 同じ組み合わせは1行しか存在しない（＝二重登録できない）
 */
class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salon_id',
    ];

    /**
     * お気に入り登録したユーザー（1件）
     * 使い方: $favorite->user->name でユーザー名を取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * お気に入り登録されたサロン（1件）
     * 使い方: $favorite->salon->name でサロン名を取得
     */
    public function salon()
    {
        return $this->belongsTo(Salon::class);
    }
}
