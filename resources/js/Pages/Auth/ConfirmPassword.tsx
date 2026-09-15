import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

/**
 * 重要操作の前にパスワードを再確認するページ（ConfirmablePasswordController::showに対応）
 * URL: GET /confirm-password
 */
export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="パスワードの確認" />

            <h1 className="mb-4 text-lg font-bold text-gray-800">
                パスワードの確認
            </h1>

            <div className="mb-4 text-sm text-gray-600">
                これはアプリの中でも重要な操作を行うページです。続行する前に、パスワードを再入力して本人確認をしてください。
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="パスワード" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        確認する
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
