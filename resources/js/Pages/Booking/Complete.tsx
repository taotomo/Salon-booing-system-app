import SiteLayout from '@/Layouts/SiteLayout';
import { Booking, PageProps } from '@/types';
import { formatPrice } from '@/utils/rating';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    booking: Booking;
}>;

/**
 * 予約完了ページ
 * URL: GET /bookings/{booking}/complete（要ログイン）
 *
 * BookingController@store で予約を保存した直後に表示される確認画面
 */
export default function Complete({ auth, booking }: Props) {
    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="予約完了" />

            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-3xl text-white">
                        ✓
                    </div>
                    <h1 className="mt-4 text-xl font-extrabold text-gray-900">
                        予約を受け付けました
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        サロンからの確定連絡をお待ちください。
                    </p>

                    <div className="mt-8 space-y-3 rounded-lg bg-gray-50 p-5 text-left text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">サロン</span>
                            <span className="font-semibold text-gray-800">
                                {booking.salon?.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">メニュー</span>
                            <span className="font-semibold text-gray-800">
                                {booking.service?.name}（
                                {booking.service &&
                                    formatPrice(booking.service.price)}
                                ）
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                担当スタッフ
                            </span>
                            <span className="font-semibold text-gray-800">
                                {booking.staff?.name}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">予約日時</span>
                            <span className="font-semibold text-gray-800">
                                {new Date(booking.start_at).toLocaleString(
                                    'ja-JP',
                                )}
                            </span>
                        </div>
                        {booking.note && (
                            <div>
                                <span className="text-gray-500">備考</span>
                                <p className="mt-1 text-gray-800">
                                    {booking.note}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href={route('bookings.index')}
                            className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            予約履歴を見る
                        </Link>
                        <Link
                            href={route('salons.index')}
                            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                        >
                            サロンを探す
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
