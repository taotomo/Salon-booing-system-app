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

// ジャンルの絞り込み（'all' = すべて表示）
const GENRE_TABS: { key: SalonGenre | 'all'; label: string }[] = [
    { key: 'all', label: 'すべて' },
    { key: 'hair', label: 'ヘアサロン' },
    { key: 'nail', label: 'ネイル' },
    { key: 'eyelash', label: 'まつげ' },
    { key: 'relaxation', label: 'リラクゼーション' },
];

// 住所の先頭から都道府県名だけを取り出す（例: "東京都渋谷区..." → "東京都"）
function extractPrefecture(address: string): string | null {
    const matched = address.match(/^.{2,3}?[都道府県]/);
    return matched ? matched[0] : null;
}

/**
 * サロン一覧ページ（トップページ）
 * URL: GET /salons
 *
 * 楽天ビューティ風に、左側に「エリア・ジャンル」の絞り込みサイドバーを常時表示し、
 * 右側（中央〜右）にサロン一覧を並べる2カラム構成にしている。
 *
 * 絞り込みはサーバーに問い合わせず、クライアント側（React側）で
 * salons 配列をその場でフィルタリングしている。
 * 件数が多くなってきたら、将来的にサーバー側検索（?area=...）に切り替える想定。
 */
export default function Index({ auth, salons }: Props) {
    const [area, setArea] = useState('all');
    const [genre, setGenre] = useState<SalonGenre | 'all'>('all');
    const [sort, setSort] = useState<SortKey>('recommended');

    // 「近い順」ソート用：ブラウザから取得した現在地
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    // 位置情報が使えない/拒否された場合にメッセージを出すためのフラグ
    const [locationError, setLocationError] = useState<string | null>(null);

    // 実際に登録されているサロンの住所から、都道府県の選択肢を自動で作る
    const areaOptions = useMemo(() => {
        const prefectures = salons
            .map((salon) => extractPrefecture(salon.address))
            .filter((value): value is string => value !== null);

        return Array.from(new Set(prefectures)).sort();
    }, [salons]);

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
        // ① エリア・ジャンルで絞り込み
        const filtered = salons.filter((salon) => {
            const matchesArea = area === 'all' || salon.address.startsWith(area);
            const matchesGenre = genre === 'all' || salon.genre === genre;

            return matchesArea && matchesGenre;
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
    }, [salons, area, genre, sort, userLocation]);

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="サロンを探す" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* 左サイドバー：エリア・ジャンルの絞り込み（常時表示） */}
                    <aside className="shrink-0 lg:w-64">
                        <div className="sticky top-6 space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                            <div>
                                <h3 className="mb-2 text-sm font-bold text-gray-700">
                                    エリアで探す
                                </h3>
                                <select
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                >
                                    <option value="all">すべてのエリア</option>
                                    {areaOptions.map((pref) => (
                                        <option key={pref} value={pref}>
                                            {pref}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <h3 className="mb-2 text-sm font-bold text-gray-700">
                                    ジャンルで探す
                                </h3>
                                <div className="space-y-1">
                                    {GENRE_TABS.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setGenre(tab.key)}
                                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                                                genre === tab.key
                                                    ? 'bg-orange-50 text-orange-500'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 右側：見出し＋サロン一覧 */}
                    <div className="min-w-0 flex-1">
                        <section className="mb-8 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-400 to-rose-500 px-6 py-8 text-white sm:px-10">
                            <h1 className="text-xl font-extrabold tracking-tight sm:text-3xl">
                                あなたにぴったりのサロンを見つけよう
                            </h1>
                            <p className="mt-2 text-sm text-orange-50">
                                左側の「エリア・ジャンル」から絞り込みできます
                            </p>
                        </section>

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
                                        handleSortChange(
                                            e.target.value as SortKey,
                                        )
                                    }
                                    className="rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                >
                                    <option value="recommended">
                                        おすすめ順
                                    </option>
                                    <option value="rating">
                                        評価が高い順
                                    </option>
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
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {visibleSalons.map((salon) => (
                                    <SalonCard key={salon.id} salon={salon} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
