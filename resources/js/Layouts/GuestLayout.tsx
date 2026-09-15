import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

/**
 * 未ログイン時の認証画面（ログイン・会員登録・パスワード再設定など）で使う共通レイアウト
 *
 * SiteLayoutと同じ「オレンジ×ローズ」のブランドカラー・ロゴを使い、
 * サロン一覧やサロン詳細ページと見た目のトーンを揃えている
 */
export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4 py-10">
            <Link
                href="/"
                className="mb-6 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-orange-500"
            >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-2xl text-white shadow-sm">
                    💇
                </span>
                Beauty Salon
            </Link>

            <div className="w-full overflow-hidden rounded-2xl bg-white px-6 py-8 shadow-lg ring-1 ring-orange-100 sm:max-w-md sm:px-8">
                {children}
            </div>

            <Link
                href={route('salons.index')}
                className="mt-6 text-sm text-gray-500 transition hover:text-orange-500"
            >
                ← サロン一覧に戻る
            </Link>
        </div>
    );
}
