import { Review } from '@/types';
import { describe, expect, it } from 'vitest';
import { formatPrice, summarizeReviews } from './rating';

function makeReview(rating: number): Review {
    return {
        id: Math.random(),
        user_id: 1,
        salon_id: 1,
        rating,
        comment: null,
        created_at: '2026-01-01T00:00:00Z',
    };
}

describe('summarizeReviews', () => {
    it('レビューが0件のときは平均0・件数0になる', () => {
        expect(summarizeReviews([])).toEqual({ average: 0, count: 0 });
    });

    it('レビューがundefinedのときも平均0・件数0になる', () => {
        expect(summarizeReviews(undefined)).toEqual({ average: 0, count: 0 });
    });

    it('平均値を小数点第1位に丸める', () => {
        // (3 + 4 + 5) / 3 = 4.0
        const result = summarizeReviews([
            makeReview(3),
            makeReview(4),
            makeReview(5),
        ]);

        expect(result).toEqual({ average: 4, count: 3 });
    });

    it('割り切れない平均値も正しく丸める', () => {
        // (3 + 4) / 2 = 3.5
        const result = summarizeReviews([makeReview(3), makeReview(4)]);

        expect(result.average).toBe(3.5);
        expect(result.count).toBe(2);
    });
});

describe('formatPrice', () => {
    it('3桁ごとにカンマ区切りの円表記になる', () => {
        expect(formatPrice(4400)).toBe('¥4,400');
        expect(formatPrice(1000000)).toBe('¥1,000,000');
    });

    it('1000円未満はカンマなしで表示される', () => {
        expect(formatPrice(500)).toBe('¥500');
    });
});
