<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * salonsテーブルに対応するModel（Laravelの機能：Eloquent ORM）
 * サロン1件＝このモデル1件。予約・スタッフ・メニュー・レビューは全てここから辿れる
 */
class Salon extends Model
{
    use HasFactory;

    /**
     * fillable = 「まとめて保存できる列」を明示する
     * セキュリティ対策: ここに書いた列だけ外部からの入力を受け付ける
     */
    protected $fillable = [
        'user_id',
        'genre',
        'name',
        'address',
        'lat',
        'lng',
        'description',
        'phone',
        'image',
    ];

    /**
     * $casts = 列の型を自動変換する設定
     * DBのdecimal型はそのままだとJSON化した時に文字列（例: "35.6580000"）になってしまい、
     * フロント側で数値として計算する際にバグの原因になるため、float型に変換しておく
     */
    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
    ];

    /**
     * このサロンのオーナー（Userテーブルと紐付け）
     * 「このサロンは1人のユーザーに所有されている」
     * belongsTo = 自分が子・相手が親
     *
     * 使い方: $salon->owner->name でオーナー名を取得
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * このサロンのスタッフ一覧
     * 「このサロンはスタッフをたくさん持っている」
     * hasMany = 自分が親・相手が子（1対多）
     *
     * 使い方: $salon->staffs でスタッフ一覧を取得
     */
    public function staffs()
    {
        return $this->hasMany(Staff::class);
    }

    /**
     * このサロンのメニュー一覧
     * 使い方: $salon->services でメニュー一覧を取得
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * このサロンへの予約一覧
     * 使い方: $salon->bookings で予約一覧を取得
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * このサロンへのレビュー一覧
     * 使い方: $salon->reviews でレビュー一覧を取得
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
