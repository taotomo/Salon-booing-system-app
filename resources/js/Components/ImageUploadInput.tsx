import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { ChangeEvent, useState } from 'react';

/**
 * 画像ファイルをアップロードするための入力欄
 *
 * 選択直後にブラウザ内だけでプレビュー表示する（まだサーバーには送信されていない）。
 * 何も選ばなければ、現在登録されている画像（currentImageUrl）がそのまま維持される
 */
export default function ImageUploadInput({
    id,
    label,
    currentImageUrl,
    onChange,
    error,
}: {
    id: string;
    label: string;
    currentImageUrl: string | null;
    onChange: (file: File | null) => void;
    error?: string;
}) {
    // URL.createObjectURL = 選択したファイルをアップロードせずにブラウザ内だけで表示するための一時URLを作る
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const displayUrl = previewUrl ?? currentImageUrl;

    return (
        <div>
            <InputLabel htmlFor={id} value={label} />

            {displayUrl && (
                <img
                    src={displayUrl}
                    alt="プレビュー"
                    className="mt-2 h-32 w-32 rounded-lg object-cover ring-1 ring-gray-200"
                />
            )}

            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-500 hover:file:bg-orange-100"
            />

            <InputError message={error} className="mt-1" />
        </div>
    );
}
