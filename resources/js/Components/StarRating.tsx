/**
 * 星評価を表示・入力するための共通コンポーネント
 *
 * 【2つの使い方】
 * 1. 表示のみ（レビュー一覧・サロン一覧など）
 *    <StarRating rating={4.5} />
 * 2. 入力可能（レビュー投稿フォーム）
 *    <StarRating rating={value} onChange={setValue} />
 *    onChange を渡すと「クリックできる星」になる
 */
type StarRatingProps = {
    rating: number;
    onChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
};

export default function StarRating({
    rating,
    onChange,
    size = 'md',
}: StarRatingProps) {
    const sizeClass = {
        sm: 'h-3.5 w-3.5',
        md: 'h-5 w-5',
        lg: 'h-7 w-7',
    }[size];

    const isInteractive = typeof onChange === 'function';

    return (
        <div className="flex items-center gap-0.5" role="img" aria-label={`評価 ${rating} / 5`}>
            {[1, 2, 3, 4, 5].map((star) => {
                // 星を「完全に塗る／半分塗る／塗らない」の3パターンで表現する
                // 例: rating=3.5 のとき、star=4 は半分だけ塗る
                const fillRatio = Math.max(0, Math.min(1, rating - (star - 1)));

                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!isInteractive}
                        onClick={() => onChange?.(star)}
                        className={
                            isInteractive
                                ? 'cursor-pointer transition-transform hover:scale-110'
                                : 'cursor-default'
                        }
                        aria-label={`${star}`}
                    >
                        <span className={`relative inline-block ${sizeClass}`}>
                            {/* 背景の星（グレー） */}
                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="absolute inset-0 h-full w-full text-gray-300"
                            >
                                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                            </svg>
                            {/* 塗りつぶし部分（オレンジ）。fillRatioで幅を変えて半分塗りを表現 */}
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillRatio * 100}%` }}
                            >
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`${sizeClass} text-orange-400`}
                                >
                                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
                                </svg>
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
