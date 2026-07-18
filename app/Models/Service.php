<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'salon_id',
        'name',
        'description',
        'price',
        'duration',
    ];

    /**
     * このメニューを提供するサロン（1件）
     * 「このメニューは1つのサロンに属している」
     *
     * 使い方: $service->salon->name でサロン名を取得
     */
    public function salon()
    {
        return $this->belongsTo(Salon::class);
    }

    /**
     * このメニューを使った予約一覧
     * 使い方: $service->bookings で予約一覧を取得
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
