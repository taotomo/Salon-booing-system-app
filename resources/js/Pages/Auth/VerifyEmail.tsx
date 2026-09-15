import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

/**
 * メールアドレス確認案内ページ（EmailVerificationPromptController::__invokeに対応）
 * URL: GET /verify-email
 */
export default function VerifyEmail({ status }: { status?: string }) {
    // 送信するデータが無いフォームなのでuseForm({})でOK（processing/postだけ使う）
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="メールアドレスの確認" />

            <h1 className="mb-4 text-lg font-bold text-gray-800">
                メールアドレスの確認
            </h1>

            <div className="mb-4 text-sm text-gray-600">
                ご登録ありがとうございます！ご利用を開始する前に、先ほどお送りしたメール内のリンクをクリックして、メールアドレスの確認をお願いします。メールが届いていない場合は、下のボタンから再送できます。
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    ご登録いただいたメールアドレス宛に、新しい確認用リンクを送信しました。
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        確認メールを再送する
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-gray-500 underline hover:text-orange-500"
                    >
                        ログアウト
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
