import { ButtonHTMLAttributes } from 'react';

// サイト共通のメインボタン（オレンジ×ローズのグラデーション）
// 「予約する」「登録する」などの主要な操作ボタンに使う。プロジェクト全体で見た目を揃えるため、
// 個別にTailwindクラスを書く代わりにこのコンポーネントを使い回す
export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-transparent bg-gradient-to-r from-orange-400 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
