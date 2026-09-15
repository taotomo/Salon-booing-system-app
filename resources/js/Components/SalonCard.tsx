import FavoriteButton from '@/Components/FavoriteButton';
import StarRating from '@/Components/StarRating';
import { Salon } from '@/types';
import { GENRE_LABEL } from '@/utils/genre';
import { formatPrice, summarizeReviews } from '@/utils/rating';
import { Link } from '@inertiajs/react';

/**
 * サロン一覧に並べるカード1枚分
 * 楽天ビューティー・ホットペッパービューティーの一覧カードを意識し、
 * 「画像 → 店名 → 評価 → 住所 → アピール文 → 代表メニュー → 最安メニュー」の順で情報を見せる
 */
export default function SalonCard({
    salon,
    isFavorited = false,
    isLoggedIn = false,
}: {
    salon: Salon;
    isFavorited?: boolean;
    isLoggedIn?: boolean;
}) {
    const { average, count } = summarizeReviews(salon.reviews);

    // メニューの中から最安値を探す（一覧では「¥◯◯〜」の形式で見せたいため）
    const minPrice = salon.services?.length
        ? Math.min(...salon.services.map((service) => service.price))
        : null;

    // カードに並べる代表メニュー（先頭2〜3件をそのままタグとして見せるだけ。クリックはできない）
    const featuredServices = salon.services?.slice(0, 3) ?? [];

    return (
        <Link
            href={route('salons.show', salon.id)}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-[8/5] w-full overflow-hidden bg-gray-100">
                {salon.image && (
                    <img
                        src={salon.image}
                        alt={salon.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                    {GENRE_LABEL[salon.genre]}
                </span>
                <span className="absolute right-3 top-3">
                    <FavoriteButton
                        salonId={salon.id}
                        isFavorited={isFavorited}
                        isLoggedIn={isLoggedIn}
                    />
                </span>
            </div>

            <div className="space-y-2 p-4">
                <h3 className="truncate text-base font-bold text-gray-800">
                    {salon.name}
                </h3>

                <div className="flex items-center gap-2">
                    <StarRating rating={average} size="sm" />
                    <span className="text-xs text-gray-500">
                        {count > 0
                            ? `${average.toFixed(1)}（${count}件）`
                            : 'レビューなし'}
                    </span>
                </div>

                <p className="truncate text-sm text-gray-500">
                    📍 {salon.address}
                </p>

                {salon.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {salon.description}
                    </p>
                )}

                {featuredServices.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuredServices.map((service) => (
                            <span
                                key={service.id}
                                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                            >
                                {service.name} {formatPrice(service.price)}
                            </span>
                        ))}
                    </div>
                )}

                {minPrice !== null && (
                    <p className="pt-1 text-sm font-semibold text-orange-500">
                        {formatPrice(minPrice)}〜
                    </p>
                )}
            </div>
        </Link>
    );
}
