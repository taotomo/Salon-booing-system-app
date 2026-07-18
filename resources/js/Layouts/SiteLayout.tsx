import Dropdown from '@/Components/Dropdown';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

/**
 * サロン検索サイト全体で使う共通レイアウト
 *
 * ホットペッパービューティーのような「上部にロゴ＋ナビ、下にフッター」の
 * 構成を、ログイン中／未ログインどちらの状態でも1つのコンポーネントで表現する。
 *
 * - 未ログイン → 「ログイン」「会員登録」リンクを表示
 * - ログイン中 → ユーザー名のドロップダウン（予約履歴・マイページ・ログアウト）を表示
 */
export default function SiteLayout({
    user,
    isOwner = false,
    children,
}: PropsWithChildren<{ user: User | null; isOwner?: boolean }>) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-orange-500"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-sm">
                            💇
                        </span>
                        Beauty Salon
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-600 sm:flex">
                        <Link
                            href={route('salons.index')}
                            className="transition hover:text-orange-500"
                        >
                            サロンを探す
                        </Link>
                        {user && (
                            <Link
                                href={route('bookings.index')}
                                className="transition hover:text-orange-500"
                            >
                                予約履歴
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                                    >
                                        {user.name} 様
                                        <svg
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('bookings.index')}>
                                        予約履歴
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('dashboard')}>
                                        マイページ
                                    </Dropdown.Link>
                                    {isOwner && (
                                        <Dropdown.Link
                                            href={route('owner.dashboard')}
                                        >
                                            管理者ダッシュボード
                                        </Dropdown.Link>
                                    )}
                                    <Dropdown.Link href={route('profile.edit')}>
                                        プロフィール設定
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        ログアウト
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-semibold text-gray-600 transition hover:text-orange-500"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                                >
                                    会員登録
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-400 sm:px-6 lg:px-8">
                    © {new Date().getFullYear()} Beauty Salon Booking. All
                    rights reserved.
                </div>
            </footer>
        </div>
    );
}
