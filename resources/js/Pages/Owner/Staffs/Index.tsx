import DangerButton from '@/Components/DangerButton';
import ImageUploadInput from '@/Components/ImageUploadInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon, Staff } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Props = PageProps<{
    salon: Salon;
}>;

/**
 * スタッフ管理ページ（オーナー向け）
 * URL: GET /owner/salons/{salon}/staffs
 *
 * 上部に新規登録フォーム、下部に登録済みスタッフの一覧（編集・削除つき）を表示する
 */
export default function Index({ auth, salon }: Props) {
    const createForm = useForm<{
        name: string;
        position: string;
        bio: string;
        image: File | null;
    }>({
        name: '',
        position: '',
        bio: '',
        image: null,
    });

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post(route('owner.staffs.store', salon.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const handleDelete = (staff: Staff) => {
        if (!window.confirm(`${staff.name}さんを削除しますか？`)) {
            return;
        }
        router.delete(route('owner.staffs.destroy', staff.id), {
            preserveScroll: true,
        });
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title={`${salon.name} - スタッフ管理`} />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('owner.dashboard')}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← ダッシュボードに戻る
                </Link>

                <h1 className="mt-2 text-xl font-extrabold text-gray-900">
                    {salon.name} - スタッフ管理
                </h1>

                {/* 新規登録フォーム */}
                <form
                    onSubmit={handleCreate}
                    className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                >
                    <h2 className="font-bold text-gray-800">スタッフを追加</h2>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="name" value="名前" />
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
                            <InputLabel htmlFor="position" value="役職（任意）" />
                            <TextInput
                                id="position"
                                value={createForm.data.position}
                                onChange={(e) =>
                                    createForm.setData(
                                        'position',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full text-sm"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="bio" value="紹介文（任意）" />
                            <textarea
                                id="bio"
                                value={createForm.data.bio}
                                onChange={(e) =>
                                    createForm.setData('bio', e.target.value)
                                }
                                rows={2}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <ImageUploadInput
                                id="image"
                                label="画像（任意）"
                                currentImageUrl={null}
                                onChange={(file) =>
                                    createForm.setData('image', file)
                                }
                                error={createForm.errors.image}
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
                    {salon.staffs?.length === 0 && (
                        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
                            まだスタッフが登録されていません。
                        </p>
                    )}

                    {salon.staffs?.map((staff) => (
                        <StaffRow
                            key={staff.id}
                            staff={staff}
                            onDelete={() => handleDelete(staff)}
                        />
                    ))}
                </div>
            </div>
        </SiteLayout>
    );
}

/**
 * スタッフ1件分の行。編集モーダルの開閉状態をこのコンポーネント内に閉じ込める
 */
function StaffRow({
    staff,
    onDelete,
}: {
    staff: Staff;
    onDelete: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    const editForm = useForm<{
        name: string;
        position: string;
        bio: string;
        image: File | null;
        _method: 'put';
    }>({
        name: staff.name,
        position: staff.position ?? '',
        bio: staff.bio ?? '',
        image: null,
        _method: 'put',
    });

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        editForm.post(route('owner.staffs.update', staff.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {staff.image && (
                        <img
                            src={staff.image}
                            alt={staff.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">
                        {staff.name}
                    </p>
                    {staff.position && (
                        <p className="text-xs text-orange-500">
                            {staff.position}
                        </p>
                    )}
                </div>
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
                        スタッフ情報を編集
                    </h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="edit_name" value="名前" />
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
                        <div>
                            <InputLabel
                                htmlFor="edit_position"
                                value="役職"
                            />
                            <TextInput
                                id="edit_position"
                                value={editForm.data.position}
                                onChange={(e) =>
                                    editForm.setData(
                                        'position',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 w-full text-sm"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_bio" value="紹介文" />
                            <textarea
                                id="edit_bio"
                                value={editForm.data.bio}
                                onChange={(e) =>
                                    editForm.setData('bio', e.target.value)
                                }
                                rows={2}
                                className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                            />
                        </div>
                        <ImageUploadInput
                            id="edit_image"
                            label="画像"
                            currentImageUrl={staff.image}
                            onChange={(file) =>
                                editForm.setData('image', file)
                            }
                            error={editForm.errors.image}
                        />
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
 * `salon.staffs?.length === 0 && (...)`
 * salon.staffs?. の「?.」はオプショナルチェイニングと呼ばれるJavaScriptの書き方で、
 * salon.staffsがundefinedのときにエラーにならず、そのままundefinedを返す（安全にアクセスできる）。
 * その上で「配列の件数が0のときだけ」右側の「まだ登録されていません」の文言を表示している。
 * （1件以上あるときはこの行自体はfalseになり何も表示されず、下のmap()による一覧だけが出る）
 */
