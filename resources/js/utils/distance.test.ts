import { describe, expect, it } from 'vitest';
import { calculateDistanceKm } from './distance';

describe('calculateDistanceKm', () => {
    it('同じ地点なら距離は0になる', () => {
        expect(calculateDistanceKm(35.658, 139.6994, 35.658, 139.6994)).toBe(0);
    });

    it('東京駅と大阪駅の距離はおよそ400km前後になる', () => {
        // 実際の直線距離は約400km。誤差20kmまでは許容してざっくり確認する
        const distance = calculateDistanceKm(
            35.6812,
            139.7671, // 東京駅
            34.7024,
            135.4959, // 大阪駅
        );

        expect(distance).toBeGreaterThan(380);
        expect(distance).toBeLessThan(420);
    });

    it('近い2地点では距離が小さい値になる', () => {
        // 渋谷駅と表参道駅（約1.5km程度）
        const distance = calculateDistanceKm(35.658, 139.7016, 35.665, 139.7126);

        expect(distance).toBeGreaterThan(0);
        expect(distance).toBeLessThan(3);
    });
});
