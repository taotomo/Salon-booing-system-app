import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

/**
 * プロフィール設定ページ（ProfileController::editに対応）
 * URL: GET /profile
 *
 * 実際の入力フォーム3つ（基本情報／パスワード変更／退会）はPartials/以下の
 * 別コンポーネントに分割されており、このファイルはそれらを並べているだけ
 */
export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title="プロフィール設定" />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-xl font-extrabold text-gray-900">
                    プロフィール設定
                </h1>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </SiteLayout>
    );
}
