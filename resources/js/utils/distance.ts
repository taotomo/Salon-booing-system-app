/**
 * 2地点間の距離を計算する（Haversine公式）
 * 地球を球体とみなして、緯度経度から直線距離（km）を求める
 *
 * 参考: 短い距離ではほぼ正確、長距離ではわずかに誤差が出るが
 * サロン検索の「近い順」ソート用途としては十分な精度
 */
export function calculateDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const EARTH_RADIUS_KM = 6371;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
}
