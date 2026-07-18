import { Review } from '@/types';

/**
 * レビュー配列から平均評価と件数を計算する
 *
 * レビューが0件のときはaverageを0にする（0除算を避けるため）
 */
export function summarizeReviews(reviews: Review[] | undefined) {
    const list = reviews ?? [];

    if (list.length === 0) {
        return { average: 0, count: 0 };
    }

    const total = list.reduce((sum, review) => sum + review.rating, 0);

    return {
        // 小数点第2位までに丸める（例: 4.333... → 4.3）
        average: Math.round((total / list.length) * 10) / 10,
        count: list.length,
    };
}

/**
 * 円表記の価格をフォーマットする（例: 4400 → "¥4,400"）
 */
export function formatPrice(price: number) {
    return `¥${price.toLocaleString()}`;
}
