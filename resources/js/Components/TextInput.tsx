import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

/**
 * 共通スタイル付きのテキスト入力欄
 *
 * forwardRef = 親コンポーネントから「このinput要素そのもの」を直接触れるようにするReactの機能
 * useImperativeHandle = 親から ref.current.focus() のように呼べる、独自のメソッドを公開する
 * isFocused=true が渡されたら、マウント時（画面表示時）に自動でこの入力欄にフォーカスを当てる
 */
export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
            ref={localRef}
        />
    );
});
