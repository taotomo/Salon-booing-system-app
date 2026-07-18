import PrimaryButton from '@/Components/PrimaryButton';
import StarRating from '@/Components/StarRating';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon } from '@/types';
import { GENRE_LABEL } from '@/utils/genre';
import { formatPrice, summarizeReviews } from '@/utils/rating';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{
    salon: Salon;
}>;

/**
 * サロン詳細ページ
 * URL: GET /salons/{salon}
 *
 * 上から「メイン画像＋基本情報」「スタッフ」「メニュー」「口コミ」の順に並ぶ、
 * ホットペッパービューティーのサロン詳細ページを意識した構成。
 */
export default function Show({ auth, salon }: Props) {
    const { average, count } = summarizeReviews(salon.reviews);

    // useForm = Inertia.jsのフォーム管理フック
    // data: 入力値 / post: 送信 / processing: 送信中フラグ / errors: バリデーションエラー
    const { data, setData, post, processing, errors, reset } = useForm({
        salon_id: salon.id,
        rating: 5,
        comment: '',
    });

    const submitReview = (e: FormEvent) => {
        e.preventDefault();
        post(route('reviews.store'), {
            preserveScroll: true,
            onSuccess: () => reset('comment'),
        });
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title={salon.name} />

            {/* メイン画像 */}
            <div className="h-64 w-full overflow-hidden bg-gray-200 sm:h-80">
                {salon.image && (
                    <img
                        src={salon.image}
                        alt={salon.name}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* 基本情報カード（画像とは重ねず、下に配置） */}
                <section className="mt-6 rounded-2xl bg-white p-6 shadow-md sm:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <span className="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
                                {GENRE_LABEL[salon.genre]}
                            </span>
                            <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                                {salon.name}
                            </h1>

                            <div className="mt-2 flex items-center gap-2">
                                <StarRating rating={average} size="md" />
                                <span className="text-sm text-gray-500">
                                    {count > 0
                                        ? `${average.toFixed(1)}（${count}件の口コミ）`
                                        : 'まだ口コミがありません'}
                                </span>
                            </div>

                            <p className="mt-3 text-sm text-gray-600">
                                📍 {salon.address}
                            </p>
                            {salon.phone && (
                                <p className="mt-1 text-sm text-gray-600">
                                    📞 {salon.phone}
                                </p>
                            )}
                        </div>

                        {/* 予約ボタン：未ログインならログインを促す */}
                        {auth.user ? (
                            <Link href={route('bookings.create', salon.id)}>
                                <PrimaryButton className="!bg-gradient-to-r !from-orange-400 !to-rose-500 !px-8 !py-3 !text-base shadow-md hover:!opacity-90">
                                    このサロンを予約する
                                </PrimaryButton>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center justify-center rounded-full border border-orange-300 px-8 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
                            >
                                ログインして予約する
                            </Link>
                        )}
                    </div>

                    {salon.description && (
                        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                            {salon.description}
                        </p>
                    )}
                </section>

                {/* スタッフ一覧 */}
                {salon.staffs && salon.staffs.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">
                            スタッフ紹介
                        </h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {salon.staffs.map((staff) => (
                                <div
                                    key={staff.id}
                                    className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100"
                                >
                                    <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                                        {staff.image && (
                                            <img
                                                src={staff.image}
                                                alt={staff.name}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm font-bold text-gray-800">
                                        {staff.name}
                                    </p>
                                    {staff.position && (
                                        <p className="text-xs text-orange-500">
                                            {staff.position}
                                        </p>
                                    )}
                                    {staff.bio && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {staff.bio}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* メニュー一覧 */}
                {salon.services && salon.services.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">
                            メニュー
                        </h2>
                        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                            {salon.services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between gap-4 p-4"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {service.name}
                                        </p>
                                        {service.description && (
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {service.description}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            所要時間 約{service.duration}分
                                        </p>
                                    </div>
                                    <p className="shrink-0 font-bold text-orange-500">
                                        {formatPrice(service.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 地図（緯度経度が登録されている場合のみ表示） */}
                {salon.lat !== null && salon.lng !== null && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-lg font-bold text-gray-800">
                            地図
                        </h2>
                        <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-100">
                            {/* OpenStreetMapの埋め込みiframe。APIキー不要・無料で使える */}
                            <iframe
                                title={`${salon.name}の地図`}
                                className="h-72 w-full"
                                loading="lazy"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${salon.lng - 0.01}%2C${salon.lat - 0.01}%2C${salon.lng + 0.01}%2C${salon.lat + 0.01}&layer=mapnik&marker=${salon.lat}%2C${salon.lng}`}
                            />
                        </div>
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${salon.lat}&mlon=${salon.lng}#map=17/${salon.lat}/${salon.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-orange-500 hover:underline"
                        >
                            大きな地図で見る →
                        </a>
                    </section>
                )}

                {/* 口コミ */}
                <section className="my-10">
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        口コミ（{count}件）
                    </h2>

                    {salon.reviews && salon.reviews.length > 0 ? (
                        <div className="space-y-3">
                            {salon.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <StarRating
                                            rating={review.rating}
                                            size="sm"
                                        />
                                        <span className="text-xs text-gray-500">
                                            {review.user?.name ?? '匿名ユーザー'}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="mt-2 text-sm text-gray-700">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                            まだ口コミがありません。
                        </p>
                    )}

                    {/* 口コミ投稿フォーム（ログイン中のみ表示） */}
                    {auth.user && (
                        <form
                            onSubmit={submitReview}
                            className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                        >
                            <h3 className="mb-4 font-bold text-gray-800">
                                口コミを投稿する
                            </h3>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    評価
                                </label>
                                <StarRating
                                    rating={data.rating}
                                    onChange={(value) =>
                                        setData('rating', value)
                                    }
                                    size="lg"
                                />
                                {errors.rating && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.rating}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    コメント（任意）
                                </label>
                                <textarea
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData('comment', e.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                    placeholder="サロンの感想を書いてください"
                                />
                                {errors.comment && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>

                            <PrimaryButton
                                disabled={processing}
                                className="!bg-gradient-to-r !from-orange-400 !to-rose-500"
                            >
                                {processing ? '送信中...' : '投稿する'}
                            </PrimaryButton>
                        </form>
                    )}
                </section>
            </div>
        </SiteLayout>
    );
}
