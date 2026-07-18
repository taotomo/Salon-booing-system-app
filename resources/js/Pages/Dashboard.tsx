import StarRating from '@/Components/StarRating';
import SiteLayout from '@/Layouts/SiteLayout';
import { Booking, PageProps, Review } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    recentBookings: Booking[];
    recentReviews: Review[];
    bookingCount: number;
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
 * マイページ（ダッシュボード）
 * URL: GET /dashboard（要ログイン）
 *
 * 「直近の予約」「投稿したレビュー」をまとめて表示するハブページ。
 * 予約の全件は/bookings、レビュー投稿はサロン詳細ページで行う
 */
export default function Dashboard({
    auth,
    recentBookings,
    recentReviews,
    bookingCount,
}: Props) {
    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="マイページ" />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-xl font-extrabold text-gray-900">
                    {auth.user?.name} 様のマイページ
                </h1>

                {/* 直近の予約 */}
                <section className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-bold text-gray-800">
                            直近の予約
                        </h2>
                        {bookingCount > 0 && (
                            <Link
                                href={route('bookings.index')}
                                className="text-sm font-semibold text-orange-500 hover:underline"
                            >
                                予約履歴をすべて見る（{bookingCount}件）→
                            </Link>
                        )}
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                            まだ予約がありません。
                            <Link
                                href={route('salons.index')}
                                className="ml-1 font-semibold text-orange-500 hover:underline"
                            >
                                サロンを探してみましょう →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={route(
                                        'salons.show',
                                        booking.salon_id,
                                    )}
                                    className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {booking.salon?.name}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                📅{' '}
                                                {new Date(
                                                    booking.start_at,
                                                ).toLocaleString('ja-JP')}
                                                ・{booking.service?.name}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[booking.status]}`}
                                        >
                                            {STATUS_LABEL[booking.status]}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* 投稿したレビュー */}
                <section className="mt-10">
                    <h2 className="mb-3 font-bold text-gray-800">
                        投稿したレビュー
                    </h2>

                    {recentReviews.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                            まだレビューを投稿していません。サロン詳細ページから投稿できます。
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentReviews.map((review) => (
                                <Link
                                    key={review.id}
                                    href={route(
                                        'salons.show',
                                        review.salon_id,
                                    )}
                                    className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold text-gray-800">
                                            {review.salon?.name}
                                        </p>
                                        <StarRating
                                            rating={review.rating}
                                            size="sm"
                                        />
                                    </div>
                                    {review.comment && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {review.comment}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </SiteLayout>
    );
}
