import { Paginated } from '@/types';
import { Link } from '@inertiajs/react';

/**
 * Laravelのpaginate()が返す「links」配列をそのままページ番号ボタンとして描画する
 *
 * links の中身の例:
 * [
 *   { url: null,                 label: '&laquo; Previous', active: false },
 *   { url: '...?page=1',         label: '1',                active: true  },
 *   { url: '...?page=2',         label: '2',                active: false },
 *   { url: null,                 label: 'Next &raquo;',     active: false },
 * ]
 * url が null のリンク（現在のページの前後が無い場合）はクリックできないようにする
 */
export default function Pagination<T>({
    pagination,
}: {
    pagination: Paginated<T>;
}) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-1">
            {pagination.links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-lg px-3 py-1.5 text-sm ${
                            link.active
                                ? 'bg-gradient-to-r from-orange-400 to-rose-500 font-semibold text-white'
                                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-orange-50'
                        }`}
                        // Laravel側のラベルには &laquo; のようなHTMLエンティティが含まれるため
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="cursor-not-allowed rounded-lg px-3 py-1.5 text-sm text-gray-300"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
