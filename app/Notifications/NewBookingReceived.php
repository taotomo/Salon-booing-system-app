<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * 新しい予約が入ったことをサロンオーナーに知らせる通知
 *
 * MAIL_MAILER=log のままなので、実際にメールは送信されず
 * storage/logs/laravel.log に内容が出力される（学習用の動作確認はこれで十分）
 */
class NewBookingReceived extends Notification
{
    use Queueable;

    // Notification（Laravelの機能）は「誰に・何で・何を」通知するかをクラスにまとめたもの
    // コンストラクタで受け取ったBookingを、toMail()の中で使ってメール本文を組み立てる
    public function __construct(private Booking $booking)
    {
    }

    /**
     * via() = この通知を「どの手段（メール／DB保存／Slack等）」で送るかを指定する
     * ['mail']なので、通知先ユーザーのUserモデルに使われているNotifiableトレイトの
     * notify()経由でtoMail()が自動的に呼ばれる
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    // toMail() = mailチャンネルのときに実際の本文を組み立てるメソッド
    // MailMessage = Laravelが用意する「メール本文ビルダー」。greeting/line/actionを繋げて書ける
    public function toMail(object $notifiable): MailMessage
    {
        $this->booking->loadMissing(['salon', 'staff', 'service', 'user']);

        return (new MailMessage)
            ->subject('新しい予約が入りました')
            ->greeting("{$this->booking->salon->name} 様")
            ->line("{$this->booking->user->name} 様から新しい予約が入りました。")
            ->line("メニュー: {$this->booking->service->name}")
            ->line("担当スタッフ: {$this->booking->staff->name}")
            ->line('予約日時: '.$this->booking->start_at->format('Y年n月j日 H:i'))
            ->action('予約を確認する', route('owner.bookings.index'));
    }
}
