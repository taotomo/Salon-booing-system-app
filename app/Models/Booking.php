<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salon_id',
        'staff_id',
        'service_id',
        'start_at',
        'status',
        'note',
    ];

    /**
     * $casts = 列の型を自動変換する設定
     * 'start_at' を文字列ではなく日付オブジェクトとして扱う
     * → $booking->start_at->format('Y/m/d H:i') のように使える
     */
    protected $casts = [
        'start_at' => 'datetime',
    ];

    /**
     * この予約をしたユーザー（1件）
     * 使い方: $booking->user->name でユーザー名を取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この予約の対象サロン（1件）
     * 使い方: $booking->salon->name でサロン名を取得
     */
    public function salon()
    {
        return $this->belongsTo(Salon::class);
    }

    /**
     * この予約の担当スタッフ（1件）
     * 使い方: $booking->staff->name でスタッフ名を取得
     */
    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    /**
     * この予約のメニュー（1件）
     * 使い方: $booking->service->name でメニュー名を取得
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
