import { SalonGenre } from '@/types';

// サロンのジャンル（業種）→ 日本語ラベル の対応表
// 一覧の絞り込みタブ・カードのバッジ・オーナー編集フォームなど複数箇所で使う
export const GENRE_LABEL: Record<SalonGenre, string> = {
    hair: 'ヘアサロン',
    nail: 'ネイル',
    eyelash: 'まつげ',
    relaxation: 'リラクゼーション',
};
