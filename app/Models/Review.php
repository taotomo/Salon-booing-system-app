<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
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
