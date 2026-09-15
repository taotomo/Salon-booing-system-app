import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

/**
 * パスワード再設定メール送信フォーム（PasswordResetLinkController::createに対応）
 * URL: GET /forgot-password
 */
export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="パスワードをお忘れの方" />

            <h1 className="mb-4 text-lg font-bold text-gray-800">
                パスワードをお忘れの方
            </h1>

            <div className="mb-4 text-sm text-gray-600">
                登録済みのメールアドレスを入力してください。パスワードを再設定するためのリンクをメールでお送りします。
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel htmlFor="email" value="メールアドレス" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        再設定用のメールを送信する
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
