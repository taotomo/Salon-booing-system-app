<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * 予約が確定／キャンセルされたことを予約したユーザーに知らせる通知
 */
class BookingStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(private Booking $booking)
    {
    }

    /**
     * @return array<int, string>
     */
    // via() = どの手段で送るかを指定する（['mail']＝メール通知として送る）
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->booking->loadMissing(['salon', 'staff', 'service']);

        $statusLabel = match ($this->booking->status) {
            'confirmed' => '確定',
            'cancelled' => 'キャンセル',
            default     => $this->booking->status,
        };

        return (new MailMessage)
            ->subject("予約が{$statusLabel}されました")
            ->greeting("{$notifiable->name} 様")
            ->line("{$this->booking->salon->name} への予約が「{$statusLabel}」になりました。")
            ->line("メニュー: {$this->booking->service->name}")
            ->line('予約日時: '.$this->booking->start_at->format('Y年n月j日 H:i'))
            ->action('予約履歴を確認する', route('bookings.index'));
    }
}
