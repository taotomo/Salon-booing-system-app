// router = Inertiaが提供するページ遷移＋データ送信の仕組み
// router.post/delete(...) はフォームを使わずJavaScriptだけでサーバーにリクエストを送れる
// （<form>を書かずにボタンクリックだけでPOST/DELETEしたいときによく使う）
import { router } from '@inertiajs/react';
import { MouseEvent } from 'react';

/**
 * サロンをお気に入り登録／解除するハートボタン
 *
 * SalonCard（一覧のカード内）とSalons/Show（詳細ページ）の両方で使う。
 * 未ログイン時はクリックすると素直にログインページへ誘導する。
 */
export default function FavoriteButton({
    salonId,
    isFavorited,
    isLoggedIn,
}: {
    salonId: number;
    isFavorited: boolean;
    isLoggedIn: boolean;
}) {
    const handleClick = (e: MouseEvent) => {
        // カード全体がLinkになっている場所で使うため、
        // クリックがカードのリンク遷移まで伝わらないようにする
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            router.visit(route('login'));
            return;
        }

        if (isFavorited) {
            router.delete(route('favorites.destroy', salonId), {
                preserveScroll: true,
            });
        } else {
            router.post(
                route('favorites.store'),
                { salon_id: salonId },
                { preserveScroll: true },
            );
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={isFavorited ? 'お気に入りから外す' : 'お気に入りに追加する'}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
                isFavorited
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 text-gray-500 hover:text-rose-500'
            }`}
        >
            <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path d="M10 17.5c-.3 0-.6-.1-.8-.3C6 14.4 3 11.6 3 8.4 3 6 4.9 4 7.3 4c1 0 2 .4 2.7 1.2C10.7 4.4 11.7 4 12.7 4 15.1 4 17 6 17 8.4c0 3.2-3 6-6.2 8.8-.2.2-.5.3-.8.3z" />
            </svg>
        </button>
    );
}
