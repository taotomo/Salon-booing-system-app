import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon } from '@/types';
import { GENRE_LABEL } from '@/utils/genre';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    salons: Salon[];
}>;

/**
 * オーナーダッシュボード（トップページ）
 * URL: GET /owner/dashboard
 *
 * 自分が所有するサロンを一覧表示し、
 * サロンごとに「編集」「スタッフ管理」「メニュー管理」への導線を出す
 */
export default function Dashboard({ auth, salons }: Props) {
    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="オーナーダッシュボード" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-gray-900">
                        オーナーダッシュボード
                    </h1>
                    <Link
                        href={route('owner.bookings.index')}
                        className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        予約管理へ
                    </Link>
                </div>

                {salons.length === 0 ? (
                    <p className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                        所有しているサロンがありません。
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {salons.map((salon) => (
                            <div
                                key={salon.id}
                                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
                                            {GENRE_LABEL[salon.genre]}
                                        </span>
                                        <h2 className="mt-2 font-bold text-gray-900">
                                            {salon.name}
                                        </h2>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            {salon.address}
                                        </p>
                                    </div>

                                    {!!salon.pending_bookings_count && (
                                        <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                            申請中 {salon.pending_bookings_count}件
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                                    <Link
                                        href={route(
                                            'owner.salons.edit',
                                            salon.id,
                                        )}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition hover:border-orange-300 hover:text-orange-500"
                                    >
                                        サロン編集
                                    </Link>
                                    <Link
                                        href={route(
                                            'owner.staffs.index',
                                            salon.id,
                                        )}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition hover:border-orange-300 hover:text-orange-500"
                                    >
                                        スタッフ管理
                                    </Link>
                                    <Link
                                        href={route(
                                            'owner.services.index',
                                            salon.id,
                                        )}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition hover:border-orange-300 hover:text-orange-500"
                                    >
                                        メニュー管理
                                    </Link>
                                    <Link
                                        href={route(
                                            'salons.show',
                                            salon.id,
                                        )}
                                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition hover:border-orange-300 hover:text-orange-500"
                                    >
                                        公開ページを見る
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}

/**
 * このファイルの読み方メモ（初心者向け）
 *
 * `A ? B : C`（三項演算子） ※例: salons.length === 0 ? B : C
 * 所有サロンが0件かどうかで、表示するJSXをまるごと出し分けている。
 * `!!salon.pending_bookings_count && (...)` は、件数が0（＝falsy）でなければ
 * 「申請中◯件」のバッジを表示するという意味（!!は「truthy/falsyを明確なbooleanに変換する」書き方）。
 */
