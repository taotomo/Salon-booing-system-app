import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon, Service } from '@/types';
import { formatPrice } from '@/utils/rating';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Props = PageProps<{
    salon: Salon;
}>;

/**
 * メニュー管理ページ（オーナー向け）
 * URL: GET /owner/salons/{salon}/services
 */
export default function Index({ auth, salon }: Props) {
    const createForm = useForm({
        name: '',
        description: '',
        price: '',
        duration: '',
    });

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post(route('owner.services.store', salon.id), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const handleDelete = (service: Service) => {
        if (!window.confirm(`「${service.name}」を削除しますか？`)) {
            return;
        }
        router.delete(route('owner.services.destroy', service.id), {
            preserveScroll: true,
        });
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title={`${salon.name} - メニュー管理`} />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('owner.dashboard')}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← ダッシュボードに戻る
                </Link>

                <h1 className="mt-2 text-xl font-extrabold text-gray-900">
                    {salon.name} - メニュー管理
                </h1>

                {/* 新規登録フォーム */}
                <form
                    onSubmit={handleCreate}
                    className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                >
                    <h2 className="font-bold text-gray-800">
                        メニューを追加
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="name" value="メニュー名" />
                            <TextInput
                                id="name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={createForm.errors.name}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="price" value="料金（円）" />
                            <TextInput
                                id="price"
                                type="number"
                                min={0}
                                value={createForm.data.price}
                                onChange={(e) =>
                                    createForm.setData(
                                        'price',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={createForm.errors.price}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="duration"
                                value="所要時間（分）"
                            />
                            <TextInput
                                id="duration"
                                type="number"
                                min={1}
                                value={createForm.data.duration}
                                onChange={(e) =>
                                    createForm.setData(
                                        'duration',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={createForm.errors.duration}
                                className="mt-1"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel
                                htmlFor="description"
                                value="説明（任意）"
                            />
                            <textarea
                                id="description"
                                value={createForm.data.description}
                                onChange={(e) =>
                                    createForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={2}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        disabled={createForm.processing}
                        className="mt-4 !bg-gradient-to-r !from-orange-400 !to-rose-500"
                    >
                        追加する
                    </PrimaryButton>
                </form>

                {/* 一覧 */}
                <div className="mt-6 space-y-3">
                    {salon.services?.length === 0 && (
                        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                            まだメニューが登録されていません。
                        </p>
                    )}

                    {salon.services?.map((service) => (
                        <ServiceRow
                            key={service.id}
                            service={service}
                            onDelete={() => handleDelete(service)}
                        />
                    ))}
                </div>
            </div>
        </SiteLayout>
    );
}

function ServiceRow({
    service,
    onDelete,
}: {
    service: Service;
    onDelete: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const editForm = useForm({
        name: service.name,
        description: service.description ?? '',
        price: String(service.price),
        duration: String(service.duration),
    });

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        editForm.put(route('owner.services.update', service.id), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div>
                <p className="font-semibold text-gray-800">{service.name}</p>
                <p className="text-xs text-gray-500">
                    {formatPrice(service.price)} ・ 約{service.duration}分
                </p>
            </div>

            <div className="flex shrink-0 gap-2">
                <SecondaryButton onClick={() => setIsEditing(true)}>
                    編集
                </SecondaryButton>
                <DangerButton onClick={onDelete}>削除</DangerButton>
            </div>

            <Modal show={isEditing} onClose={() => setIsEditing(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        メニューを編集
                    </h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="edit_name"
                                value="メニュー名"
                            />
                            <TextInput
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                className="mt-1 w-full text-sm"
                            />
                            <InputError
                                message={editForm.errors.name}
                                className="mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="edit_price"
                                    value="料金（円）"
                                />
                                <TextInput
                                    id="edit_price"
                                    type="number"
                                    min={0}
                                    value={editForm.data.price}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'price',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 w-full text-sm"
                                />
                                <InputError
                                    message={editForm.errors.price}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="edit_duration"
                                    value="所要時間（分）"
                                />
                                <TextInput
                                    id="edit_duration"
                                    type="number"
                                    min={1}
                                    value={editForm.data.duration}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'duration',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 w-full text-sm"
                                />
                                <InputError
                                    message={editForm.errors.duration}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="edit_description"
                                value="説明"
                            />
                            <textarea
                                id="edit_description"
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={2}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            type="button"
                            onClick={() => setIsEditing(false)}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton
                            disabled={editForm.processing}
                            className="!bg-gradient-to-r !from-orange-400 !to-rose-500"
                        >
                            保存する
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

/**
 * このファイルの読み方メモ（初心者向け）
 *
 * `salon.services?.length === 0 && (...)`
 * 「?.」はオプショナルチェイニング（salon.servicesがundefinedでもエラーにならない書き方）。
 * メニューの件数が0のときだけ「まだ登録されていません」の文言を表示する
 * （1件以上あればこの行はfalseになり、下のmap()による一覧だけが表示される）。
 */
