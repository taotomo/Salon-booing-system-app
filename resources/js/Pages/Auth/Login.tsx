import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

/**
 * ログインページ（AuthenticatedSessionController::createに対応）
 * URL: GET /login
 */
export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    // useForm = Inertia.jsのフォーム管理フック
    // data: 入力値 / setData: 値の更新 / post: 送信 / processing: 送信中フラグ
    // errors: サーバー側バリデーションのエラーメッセージ / reset: 指定したフィールドを空に戻す
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="ログイン" />

            <h1 className="mb-6 text-lg font-bold text-gray-800">
                ログイン
            </h1>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="パスワード" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            ログイン状態を保持する
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gray-500 underline hover:text-orange-500"
                        >
                            パスワードをお忘れですか？
                        </Link>
                    )}

                    <PrimaryButton
                        className="ms-auto"
                        disabled={processing}
                    >
                        ログイン
                    </PrimaryButton>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                アカウントをお持ちでない方は{' '}
                <Link
                    href={route('register')}
                    className="font-semibold text-orange-500 hover:underline"
                >
                    会員登録
                </Link>
            </p>
        </GuestLayout>
    );
}
