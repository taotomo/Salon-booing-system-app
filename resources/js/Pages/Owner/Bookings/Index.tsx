import SiteLayout from '@/Layouts/SiteLayout';
import { Booking, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Props = PageProps<{
    bookings: Booking[];
}>;

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
 * 予約管理ページ（オーナー向け）
 * URL: GET /owner/bookings
 *
 * 自分が所有する全サロン宛の予約を一覧表示し、
 * 「承認する」「キャンセルする」で status を更新できる
 */
export default function Index({ auth, bookings }: Props) {
    const updateStatus = (
        booking: Booking,
        status: 'confirmed' | 'cancelled',
    ) => {
        const message =
            status === 'confirmed'
                ? 'この予約を承認しますか？'
                : 'この予約をキャンセルしますか？';

        if (!window.confirm(message)) {
            return;
        }

        router.patch(
            route('owner.bookings.updateStatus', booking.id),
            { status },
            { preserveScroll: true },
        );
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="予約管理" />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('owner.dashboard')}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← ダッシュボードに戻る
                </Link>

                <h1 className="mt-2 mb-6 text-xl font-extrabold text-gray-900">
                    予約管理
                </h1>

                {bookings.length === 0 ? (
                    <p className="rounded-2xl bg-white p-12 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                        予約はまだありません。
                    </p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            {booking.salon?.name}
                                        </p>
                                        <h2 className="font-bold text-gray-900">
                                            {booking.user?.name} 様
                                        </h2>
                                    </div>
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

                                {booking.status === 'pending' && (
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStatus(
                                                    booking,
                                                    'confirmed',
                                                )
                                            }
                                            className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                                        >
                                            承認する
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStatus(
                                                    booking,
                                                    'cancelled',
                                                )
                                            }
                                            className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                                        >
                                            キャンセルする
                                        </button>
                                    </div>
                                )}

                                {booking.status === 'confirmed' && (
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStatus(
                                                    booking,
                                                    'cancelled',
                                                )
                                            }
                                            className="text-sm font-semibold text-gray-400 transition hover:text-red-500"
                                        >
                                            キャンセルする
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
