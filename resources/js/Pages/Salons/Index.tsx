import SalonCard from '@/Components/SalonCard';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon, SalonGenre } from '@/types';
import { calculateDistanceKm } from '@/utils/distance';
import { summarizeReviews } from '@/utils/rating';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Props = PageProps<{
    salons: Salon[];
}>;

type SortKey = 'recommended' | 'rating' | 'distance';

// ジャンルの絞り込みタブ（'all' = すべて表示）
const GENRE_TABS: { key: SalonGenre | 'all'; label: string }[] = [
    { key: 'all', label: 'すべて' },
    { key: 'hair', label: 'ヘアサロン' },
    { key: 'nail', label: 'ネイル' },
    { key: 'eyelash', label: 'まつげ' },
    { key: 'relaxation', label: 'リラクゼーション' },
];

/**
 * サロン一覧ページ（トップページ）
 * URL: GET /salons
 *
 * ホットペッパービューティー風に、上部に大きな検索バナー、
 * その下にサロンをカードのグリッドで並べる構成にしている。
 *
 * キーワード検索・ジャンル絞り込みはサーバーに問い合わせず、
 * クライアント側（React側）で salons 配列をその場でフィルタリングしている。
 * 件数が多くなってきたら、将来的にサーバー側検索（?keyword=...）に切り替える想定。
 */
export default function Index({ auth, salons }: Props) {
    const [keyword, setKeyword] = useState('');
    const [genre, setGenre] = useState<SalonGenre | 'all'>('all');
    const [sort, setSort] = useState<SortKey>('recommended');

    // 「近い順」ソート用：ブラウザから取得した現在地
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    // 位置情報が使えない/拒否された場合にメッセージを出すためのフラグ
    const [locationError, setLocationError] = useState<string | null>(null);

    const handleSortChange = (nextSort: SortKey) => {
        setSort(nextSort);
        setLocationError(null);

        if (nextSort !== 'distance' || userLocation) {
            return;
        }

        if (!navigator.geolocation) {
            setLocationError(
                'このブラウザは位置情報に対応していないため、近い順で並び替えできません。',
            );
            setSort('recommended');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                setLocationError(
                    '位置情報の利用が許可されなかったため、近い順で並び替えできません。',
                );
                setSort('recommended');
            },
        );
    };

    const visibleSalons = useMemo(() => {
        const trimmedKeyword = keyword.trim();

        // ① キーワード・ジャンルで絞り込み
        const filtered = salons.filter((salon) => {
            const matchesKeyword =
                !trimmedKeyword ||
                salon.name.includes(trimmedKeyword) ||
                salon.address.includes(trimmedKeyword);
            const matchesGenre = genre === 'all' || salon.genre === genre;

            return matchesKeyword && matchesGenre;
        });

        // ② 並び替え（元の配列は壊さないようコピーしてからsortする）
        const sorted = [...filtered];

        if (sort === 'rating') {
            sorted.sort(
                (a, b) =>
                    summarizeReviews(b.reviews).average -
                    summarizeReviews(a.reviews).average,
            );
        } else if (sort === 'distance' && userLocation) {
            sorted.sort((a, b) => {
                // 緯度経度が未設定のサロンは一番後ろに回す
                if (a.lat === null || a.lng === null) return 1;
                if (b.lat === null || b.lng === null) return -1;

                const distanceA = calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    a.lat,
                    a.lng,
                );
                const distanceB = calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    b.lat,
                    b.lng,
                );

                return distanceA - distanceB;
            });
        }

        return sorted;
    }, [salons, keyword, genre, sort, userLocation]);

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="サロンを探す" />

            {/* 検索ヒーローバナー */}
            <section className="bg-gradient-to-br from-orange-400 via-orange-400 to-rose-500 py-14 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
                        あなたにぴったりのサロンを見つけよう
                    </h1>
                    <p className="mt-3 text-sm text-orange-50 sm:text-base">
                        エリア・サロン名・ジャンルで検索できます
                    </p>

                    <div className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-full bg-white shadow-lg">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="エリア・サロン名で検索（例：渋谷、カラー）"
                            className="w-full border-0 px-5 py-3 text-sm text-gray-700 focus:outline-none focus:ring-0"
                        />
                        <span className="flex items-center px-5 text-orange-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                    </div>

                    {/* ジャンルタブ */}
                    <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                        {GENRE_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setGenre(tab.key)}
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                                    genre === tab.key
                                        ? 'bg-white text-orange-500 shadow-sm'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* サロン一覧グリッド */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            サロン一覧
                        </h2>
                        <p className="text-sm text-gray-500">
                            {visibleSalons.length}件のサロン
                        </p>
                    </div>

                    {/* 並び替え */}
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sort"
                            className="text-sm text-gray-500"
                        >
                            並び替え
                        </label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(e) =>
                                handleSortChange(e.target.value as SortKey)
                            }
                            className="rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                        >
                            <option value="recommended">おすすめ順</option>
                            <option value="rating">評価が高い順</option>
                            <option value="distance">近い順</option>
                        </select>
                    </div>
                </div>

                {locationError && (
                    <p className="mb-4 rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-700">
                        {locationError}
                    </p>
                )}

                {visibleSalons.length === 0 ? (
                    <p className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                        条件に一致するサロンが見つかりませんでした。
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleSalons.map((salon) => (
                            <SalonCard key={salon.id} salon={salon} />
                        ))}
                    </div>
                )}
            </section>
        </SiteLayout>
    );
}
