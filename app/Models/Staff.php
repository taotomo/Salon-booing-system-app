<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    // Laravelは英語の複数形ルールに基づいてテーブル名を自動推測するが、
    // "Staff" は複数形にしても "staff" のまま変化しないため、
    // マイグレーションで作った実際のテーブル名 "staffs" を明示しておく
    protected $table = 'staffs';

    protected $fillable = [
        'salon_id',
        'name',
        'position',
        'bio',
        'image',
    ];

    /**
     * このスタッフが所属するサロン（1件）
     * 「このスタッフは1つのサロンに属している」
     * belongsTo = 自分が子・相手が親
     *
     * 使い方: $staff->salon->name でサロン名を取得
     */
    public function salon()
    {
        return $this->belongsTo(Salon::class);
    }

    /**
     * このスタッフが担当する予約一覧
     * 使い方: $staff->bookings で担当予約一覧を取得
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
