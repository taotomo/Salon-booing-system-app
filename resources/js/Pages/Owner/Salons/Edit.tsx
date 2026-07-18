import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon, SalonGenre } from '@/types';
import { GENRE_LABEL } from '@/utils/genre';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = PageProps<{
    salon: Salon;
}>;

/**
 * サロン編集フォーム（オーナー向け）
 * URL: GET /owner/salons/{salon}/edit
 */
export default function Edit({ auth, salon }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        genre: salon.genre,
        name: salon.name,
        address: salon.address,
        phone: salon.phone ?? '',
        description: salon.description ?? '',
        image: salon.image ?? '',
        lat: salon.lat !== null ? String(salon.lat) : '',
        lng: salon.lng !== null ? String(salon.lng) : '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('owner.salons.update', salon.id));
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title={`${salon.name} を編集`} />

            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('owner.dashboard')}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← ダッシュボードに戻る
                </Link>

                <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <h1 className="text-xl font-extrabold text-gray-900">
                        サロン情報を編集
                    </h1>

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
                            <InputError message={errors.genre} className="mt-1" />
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
                            <InputError message={errors.name} className="mt-1" />
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
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="説明文" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="メイン画像URL" />
                            <TextInput
                                id="image"
                                value={data.image}
                                onChange={(e) =>
                                    setData('image', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                                placeholder="https://..."
                            />
                            <InputError message={errors.image} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="lat" value="緯度" />
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
                                <InputLabel htmlFor="lng" value="経度" />
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
                            {processing ? '保存中...' : '保存する'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </SiteLayout>
    );
}
