import SalonCard from '@/Components/SalonCard';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    salons: Salon[];
}>;

/**
 * お気に入り一覧ページ
 * URL: GET /favorites（要ログイン）
 */
export default function Index({ auth, salons }: Props) {
    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="お気に入り" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-xl font-extrabold text-gray-900">
                    お気に入りサロン
                </h1>

                {salons.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
                        <p className="text-sm text-gray-500">
                            まだお気に入りに登録したサロンがありません。
                        </p>
                        <Link
                            href={route('salons.index')}
                            className="mt-5 inline-block rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                            サロンを探す
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {salons.map((salon) => (
                            <SalonCard
                                key={salon.id}
                                salon={salon}
                                isFavorited={true}
                                isLoggedIn={true}
                            />
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
 * お気に入りが0件かどうかで、表示するJSXをまるごと出し分けている
 * （0件なら「まだ登録がありません」の案内、1件以上ならサロンカードの一覧）。
 * .map()は配列を1件ずつJSXに変換して並べる書き方で、key={salon.id}は
 * Reactが各カードを区別するために一覧表示で必ず必要になる目印。
 */
