import Pagination from '@/Components/Pagination';
import SalonCard from '@/Components/SalonCard';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Paginated, Salon, SalonGenre } from '@/types';
import { calculateDistanceKm } from '@/utils/distance';
// Head = Inertia版の<title>タグ。このコンポーネントを置いた場所のtitle propsが
// ブラウザのタブに表示されるページタイトルになる
import { Head, router } from '@inertiajs/react';
// useMemo = Reactのフック。依存配列（[]の中身）が変わらない限り再計算せず、前回の結果を使い回す
// （salons.dataの並び替えのような重い計算を、無関係な再描画のたびにやり直さないための最適化）
import { useMemo, useState } from 'react';

type Props = PageProps<{
    salons: Paginated<Salon>;
    areaOptions: string[];
    filters: {
        area: string | null;
        genre: SalonGenre | null;
        sort: string;
    };
    favoriteSalonIds: number[];
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

/**
 * サロン一覧ページ（トップページ）
 * URL: GET /salons?area=...&genre=...&sort=...&page=...
 *
 * 以前はサロンを全件取得し、絞り込み・並び替えをブラウザ側だけで行っていた。
 * 今はエリア・ジャンル・並び替えを変更するたびに、
 * router.get() でサーバーに問い合わせ直す方式に変更している
 * （SalonController@index が実際の絞り込み・並び替え・ページ分割を担当する）。
 *
 * 「近い順」だけは、ブラウザの現在地情報を使うためサーバー側では計算できない。
 * そのため、現在表示されている1ページ分のデータだけをクライアント側で並べ替える
 */
export default function Index({
    auth,
    salons,
    areaOptions,
    filters,
    favoriteSalonIds,
}: Props) {
    const [area, setArea] = useState(filters.area ?? 'all');
    const [genre, setGenre] = useState<SalonGenre | 'all'>(
        filters.genre ?? 'all',
    );
    const [sort, setSort] = useState<SortKey>(
        (filters.sort as SortKey) ?? 'recommended',
    );

    // 「近い順」ソート用：ブラウザから取得した現在地
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const favoriteIdSet = useMemo(
        () => new Set(favoriteSalonIds),
        [favoriteSalonIds],
    );

    // エリア・ジャンル・並び替えのいずれかが変わるたびに、サーバーへ問い合わせ直す
    // preserveState: true にすることで、area/genre/sortなどのReact側のstateは保持したまま
    // salons（一覧データ）だけを新しい内容に差し替える
    const fetchSalons = (next: {
        area?: string;
        genre?: SalonGenre | 'all';
        sort?: SortKey;
    }) => {
        const nextArea = next.area ?? area;
        const nextGenre = next.genre ?? genre;
        const nextSort = next.sort ?? sort;

        router.get(
            route('salons.index'),
            {
                area: nextArea === 'all' ? undefined : nextArea,
                genre: nextGenre === 'all' ? undefined : nextGenre,
                sort: nextSort,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleAreaChange = (value: string) => {
        setArea(value);
        fetchSalons({ area: value });
    };

    const handleGenreChange = (value: SalonGenre | 'all') => {
        setGenre(value);
        fetchSalons({ genre: value });
    };

    const handleSortChange = (nextSort: SortKey) => {
        setSort(nextSort);
        setLocationError(null);

        // 「近い順」以外はサーバー側で並び替えてもらう
        if (nextSort !== 'distance') {
            fetchSalons({ sort: nextSort });
            return;
        }

        // 「近い順」はサーバーに問い合わせず、現在のページをそのままクライアント側で並べ替える
        if (userLocation) {
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

    // 「近い順」が選ばれているときだけ、現在ページの中身をクライアント側で並べ替える
    const visibleSalons = useMemo(() => {
        if (sort !== 'distance' || !userLocation) {
            return salons.data;
        }

        return [...salons.data].sort((a, b) => {
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
    }, [salons.data, sort, userLocation]);

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
                                    onChange={(e) =>
                                        handleAreaChange(e.target.value)
                                    }
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
                                            onClick={() =>
                                                handleGenreChange(tab.key)
                                            }
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
                                    {salons.total}件のサロン
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

                        {/*
                          * JSXの中の `変数 && (...)` という書き方は、Reactでよく使われる
                          * 「条件がtrueのときだけ表示する」ためのテクニック。
                          * locationErrorは初期値がnull（何もエラーが無い状態）。
                          * nullや空文字は&&の左側に来るとfalse扱いになるため、
                          * 「locationErrorに何か文字列が入っているときだけ、右側の<p>を画面に描画する」
                          * という意味になる（＝位置情報の取得に失敗したときだけ警告文を出す）
                          */}
                        {locationError && (
                            <p className="mb-4 rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-700">
                                {locationError}
                            </p>
                        )}

                        {/*
                          * `条件 ? Aを表示 : Bを表示` は三項演算子と呼ばれるJavaScriptの書き方。
                          * ここでは「絞り込んだ結果のサロンが0件なら『見つかりませんでした』の文章を、
                          * 1件以上あればサロンカードの一覧を表示する」という出し分けをしている。
                          * visibleSalons は、salons.data（サーバーから届いた今のページ分のサロン一覧）を
                          * 「近い順」ソートのときだけ並び替えたもの（117行目付近のuseMemoで作られる変数）
                          */}
                        {visibleSalons.length === 0 ? (
                            <p className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                                条件に一致するサロンが見つかりませんでした。
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {/* .map() = 配列の中身1つ1つを、対応するJSX（ここではSalonCard）に変換して並べる
                                    key={salon.id} = Reactが「どのカードがどのデータに対応するか」を
                                    区別するために必須のprops。一覧の要素には必ずkeyを付ける決まりになっている */}
                                {visibleSalons.map((salon) => (
                                    <SalonCard
                                        key={salon.id}
                                        salon={salon}
                                        isFavorited={favoriteIdSet.has(
                                            salon.id,
                                        )}
                                        isLoggedIn={auth.user !== null}
                                    />
                                ))}
                            </div>
                        )}

                        {/* 「近い順」は現在ページ内だけの並び替えのため、
                            ページをまたぐとリセットされる。ページ送りボタン */}
                        <Pagination pagination={salons} />
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}

/**
 * このファイルの読み方メモ（初心者向け）
 *
 * JSX（return の中）には、パッと見で意味が分かりにくい書き方がいくつか出てきます。
 * 代表的なものをここにまとめておきます。
 *
 * 1. `変数 && (...)`  ※例: locationError && (...)
 *    「変数がtrueっぽい値（trueや、null/空文字/0以外の値）のときだけ、右側を画面に表示する」
 *    という意味。locationErrorは最初null（エラー無し）なので普段は何も表示されず、
 *    位置情報の取得に失敗したときだけ文字列が入り、警告文が表示される。
 *
 * 2. `変数 ? A : B`  ※例: visibleSalons.length === 0 ? A : B
 *    JavaScriptの三項演算子。「変数の条件がtrueならA、falseならBを表示する」という
 *    if文を1行で書けるようにしたもの。ここでは「表示するサロンが0件ならAの案内文を、
 *    1件以上あればBのカード一覧を表示する」という出し分けに使っている。
 *
 * 3. `配列.map((要素) => (...))`  ※例: visibleSalons.map((salon) => (...))
 *    配列の中身を1件ずつ取り出して、対応するJSX（ここではSalonCard）に変換し、
 *    その結果をまとめて表示する。key={salon.id} は、Reactが各要素を区別するために
 *    必須で付ける目印（一覧表示では必ず必要）。
 *
 * 4. visibleSalons とは？
 *    salons.data（サーバーから届いた「今のページ分」のサロン一覧）を、
 *    「近い順」ソートが選ばれているときだけ距離で並び替えたもの。
 *    それ以外のソートのときは salons.data がそのまま使われる（73行目付近のuseMemoを参照）。
 */
