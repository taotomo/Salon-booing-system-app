<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * reviewsテーブルに対応するModel（Laravelの機能：Eloquent ORM）
 * ユーザーがサロンに投稿した口コミ（評価点＋コメント）1件＝このモデル1件
 */
class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salon_id',
        'rating',
        'comment',
    ];

    /**
     * このレビューを書いたユーザー（1件）
     * 使い方: $review->user->name でユーザー名を取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * このレビューの対象サロン（1件）
     * 使い方: $review->salon->name でサロン名を取得
     */
    public function salon()
    {
        return $this->belongsTo(Salon::class);
    }
}
