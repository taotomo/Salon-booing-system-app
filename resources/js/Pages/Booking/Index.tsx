import SiteLayout from '@/Layouts/SiteLayout';
import { Booking, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Props = PageProps<{
    bookings: Booking[];
}>;

// 予約ステータス → 日本語ラベル／バッジ色 の対応表
const STATUS_LABEL: Record<Booking['status'], string> = {
    pending: '申請中',
    confirmed: '確定',
    cancelled: 'キャンセル済み',
};

const STATUS_BADGE_CLASS: Record<Booking['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-gray-100 text-gray-500',
};

/**
 * 予約履歴ページ（マイページ）
 * URL: GET /bookings（要ログイン）
 *
 * ログイン中のユーザー自身の予約だけが一覧表示される
 * （BookingController@index で where('user_id', auth()->id()) 済み）
 */
// キャンセル可能かどうか（申請中・確定 かつ 予約日時が未来）を判定する
function isCancellable(booking: Booking) {
    return (
        booking.status !== 'cancelled' &&
        new Date(booking.start_at).getTime() > Date.now()
    );
}

export default function Index({ auth, bookings }: Props) {
    const handleCancel = (booking: Booking) => {
        if (!window.confirm('この予約をキャンセルしますか？')) {
            return;
        }

        router.patch(route('bookings.cancel', booking.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="予約履歴" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-xl font-extrabold text-gray-900">
                    予約履歴
                </h1>

                {bookings.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
                        <p className="text-sm text-gray-500">
                            まだ予約がありません。
                        </p>
                        <Link
                            href={route('salons.index')}
                            className="mt-5 inline-block rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            サロンを探す
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="font-bold text-gray-900">
                                        {booking.salon?.name}
                                    </h2>
                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[booking.status]}`}
                                    >
                                        {STATUS_LABEL[booking.status]}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-1 text-sm text-gray-600">
                                    <p>
                                        📅{' '}
                                        {new Date(
                                            booking.start_at,
                                        ).toLocaleString('ja-JP')}
                                    </p>
                                    <p>
                                        ✂️ {booking.service?.name}（¥
                                        {booking.service?.price.toLocaleString()}
                                        ）
                                    </p>
                                    <p>👤 担当: {booking.staff?.name}</p>
                                    {booking.note && (
                                        <p>📝 備考: {booking.note}</p>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    {booking.salon && (
                                        <Link
                                            href={route(
                                                'salons.show',
                                                booking.salon.id,
                                            )}
                                            className="text-sm font-semibold text-orange-500 hover:underline"
                                        >
                                            サロンの詳細を見る →
                                        </Link>
                                    )}

                                    {isCancellable(booking) && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking)}
                                            className="text-sm font-semibold text-gray-400 transition hover:text-red-500"
                                        >
                                            キャンセルする
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
