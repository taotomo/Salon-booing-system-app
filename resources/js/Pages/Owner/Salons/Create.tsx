import ImageUploadInput from '@/Components/ImageUploadInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, SalonGenre } from '@/types';
import { GENRE_LABEL } from '@/utils/genre';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

/**
 * 新規サロン登録フォーム
 * URL: GET /owner/salons/create（要ログイン。オーナーである必要はない）
 *
 * ここで登録すると、そのまま自分がオーナーとしてこのサロンを管理できるようになる
 */
export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm<{
        genre: SalonGenre;
        name: string;
        address: string;
        phone: string;
        description: string;
        image: File | null;
        lat: string;
        lng: string;
    }>({
        genre: 'hair',
        name: '',
        address: '',
        phone: '',
        description: '',
        image: null,
        lat: '',
        lng: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // forceFormData: true = 画像ファイルを含むデータを、通常のJSONではなく
        // multipart/form-data形式（ファイルを送れる形式）で送信するようInertiaに指示する
        post(route('owner.salons.store'), {
            forceFormData: true,
        });
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="サロンを登録する" />

            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('salons.index')}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← サロン一覧に戻る
                </Link>

                <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <h1 className="text-xl font-extrabold text-gray-900">
                        サロンを登録する
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        登録すると、あなたがこのサロンのオーナーとして管理できるようになります。
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-5">
                        <div>
                            <InputLabel htmlFor="genre" value="ジャンル" />
                            <select
                                id="genre"
                                value={data.genre}
                                onChange={(e) =>
                                    setData(
                                        'genre',
                                        e.target.value as SalonGenre,
                                    )
                                }
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            >
                                {Object.entries(GENRE_LABEL).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                            <InputError
                                message={errors.genre}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="サロン名" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="address" value="住所" />
                            <TextInput
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                                placeholder="例: 東京都渋谷区道玄坂1-2-3"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="電話番号" />
                            <TextInput
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="説明文"
                            />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                placeholder="サロンの特徴やアピールポイントを書いてください"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-1"
                            />
                        </div>

                        <ImageUploadInput
                            id="image"
                            label="メイン画像（任意）"
                            currentImageUrl={null}
                            onChange={(file) => setData('image', file)}
                            error={errors.image}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="lat"
                                    value="緯度（任意）"
                                />
                                <TextInput
                                    id="lat"
                                    value={data.lat}
                                    onChange={(e) =>
                                        setData('lat', e.target.value)
                                    }
                                    className="mt-1 w-full text-sm"
                                    placeholder="例: 35.6580"
                                />
                                <InputError
                                    message={errors.lat}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="lng"
                                    value="経度（任意）"
                                />
                                <TextInput
                                    id="lng"
                                    value={data.lng}
                                    onChange={(e) =>
                                        setData('lng', e.target.value)
                                    }
                                    className="mt-1 w-full text-sm"
                                    placeholder="例: 139.6994"
                                />
                                <InputError
                                    message={errors.lng}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <PrimaryButton
                            disabled={processing}
                            className="!bg-gradient-to-r !from-orange-400 !to-rose-500"
                        >
                            {processing ? '登録中...' : '登録する'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </SiteLayout>
    );
}
