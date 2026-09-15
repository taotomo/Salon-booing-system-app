import { HTMLAttributes } from 'react';

// フォームのバリデーションエラーメッセージを赤字で表示する。messageが無ければ何も表示しない
export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-red-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
