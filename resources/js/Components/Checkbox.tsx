import { InputHTMLAttributes } from 'react';

// 共通スタイル付きのチェックボックス。InputHTMLAttributes<HTMLInputElement>を継承しているので
// 通常の<input type="checkbox">に渡せる属性（checked, onChange等）はそのまま全部使える
export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' +
                className
            }
        />
    );
}
