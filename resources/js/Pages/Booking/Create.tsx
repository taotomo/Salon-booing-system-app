import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SiteLayout from '@/Layouts/SiteLayout';
import { PageProps, Salon } from '@/types';
import { formatPrice } from '@/utils/rating';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';

type Props = PageProps<{
    salon: Salon;
}>;

const STEPS = [
    { key: 1, label: 'メニュー' },
    { key: 2, label: 'スタッフ' },
    { key: 3, label: '日時' },
    { key: 4, label: '確認' },
] as const;

/**
 * 予約フォームページ（4ステップウィザード）
 * URL: GET /salons/{salon}/bookings/create（要ログイン）
 *
 * ①メニュー選択 → ②スタッフ選択 → ③日時・備考入力 → ④内容確認 の順で進める。
 * 送信するAPIは変わらず、最後のステップで今まで通り
 * POST /bookings（BookingController@store）に一括送信する。
 */
export default function Create({ auth, salon }: Props) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    const { data, setData, post, processing, errors } = useForm({
        salon_id: salon.id,
        staff_id: '',
        service_id: '',
        start_at: '',
        note: '',
    });

    // 確認画面に出す「選択中のメニュー／スタッフ」の詳細情報
    const selectedService = useMemo(
        () => salon.services?.find((s) => String(s.id) === data.service_id),
        [salon.services, data.service_id],
    );
    const selectedStaff = useMemo(
        () => salon.staffs?.find((s) => String(s.id) === data.staff_id),
        [salon.staffs, data.staff_id],
    );

    const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as typeof s) : s));
    const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as typeof s) : s));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    return (
        <SiteLayout user={auth.user} isOwner={auth.isOwner}>
            <Head title={`${salon.name} を予約`} />

            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('salons.show', salon.id)}
                    className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                    ← {salon.name} に戻る
                </Link>

                <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                    <h1 className="text-xl font-extrabold text-gray-900">
                        {salon.name} を予約する
                    </h1>

                    {/* ステップインジケーター */}
                    <ol className="mt-6 flex items-center justify-between">
                        {STEPS.map((s, index) => (
                            <li
                                key={s.key}
                                className="flex flex-1 items-center"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                            step === s.key
                                                ? 'bg-gradient-to-r from-orange-400 to-rose-500 text-white'
                                                : step > s.key
                                                  ? 'bg-orange-100 text-orange-500'
                                                  : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {step > s.key ? '✓' : s.key}
                                    </span>
                                    <span
                                        className={`text-xs ${step === s.key ? 'font-bold text-gray-800' : 'text-gray-400'}`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`mx-2 h-0.5 flex-1 ${step > s.key ? 'bg-orange-300' : 'bg-gray-100'}`}
                                    />
                                )}
                            </li>
                        ))}
                    </ol>

                    <form onSubmit={handleSubmit} className="mt-8">
                        {/* ① メニュー選択 */}
                        {step === 1 && (
                            <div>
                                <InputLabel value="メニューを選んでください" />
                                <div className="mt-3 space-y-2">
                                    {salon.services?.map((service) => (
                                        <label
                                            key={service.id}
                                            className={`block cursor-pointer rounded-lg border p-4 transition ${
                                                data.service_id ===
                                                String(service.id)
                                                    ? 'border-orange-400 bg-orange-50'
                                                    : 'border-gray-200 hover:border-orange-200'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="service_id"
                                                value={service.id}
                                                checked={
                                                    data.service_id ===
                                                    String(service.id)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'service_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {service.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        所要時間 約
                                                        {service.duration}分
                                                    </p>
                                                </div>
                                                <p className="font-bold text-orange-500">
                                                    {formatPrice(
                                                        service.price,
                                                    )}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!data.service_id}
                                        onClick={goNext}
                                        className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        次へ
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ② スタッフ選択 */}
                        {step === 2 && (
                            <div>
                                <InputLabel value="担当スタッフを選んでください" />
                                <div className="mt-3 space-y-2">
                                    {salon.staffs?.map((staff) => (
                                        <label
                                            key={staff.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                                                data.staff_id ===
                                                String(staff.id)
                                                    ? 'border-orange-400 bg-orange-50'
                                                    : 'border-gray-200 hover:border-orange-200'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="staff_id"
                                                value={staff.id}
                                                checked={
                                                    data.staff_id ===
                                                    String(staff.id)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'staff_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
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
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="rounded-full border border-gray-300 px-6 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!data.staff_id}
                                        onClick={goNext}
                                        className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        次へ
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ③ 日時・備考入力 */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="start_at"
                                        value="予約日時"
                                    />
                                    <input
                                        id="start_at"
                                        type="datetime-local"
                                        value={data.start_at}
                                        onChange={(e) =>
                                            setData(
                                                'start_at',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="note"
                                        value="備考・ご要望（任意）"
                                    />
                                    <textarea
                                        id="note"
                                        value={data.note}
                                        onChange={(e) =>
                                            setData('note', e.target.value)
                                        }
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
                                        placeholder="アレルギーや希望スタイルなどをご記入ください"
                                    />
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="rounded-full border border-gray-300 px-6 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                                    >
                                        戻る
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!data.start_at}
                                        onClick={goNext}
                                        className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        確認画面へ
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ④ 確認 */}
                        {step === 4 && (
                            <div>
                                <div className="space-y-3 rounded-lg bg-gray-50 p-5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            サロン
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {salon.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            メニュー
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedService?.name}（
                                            {selectedService &&
                                                formatPrice(
                                                    selectedService.price,
                                                )}
                                            ）
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            担当スタッフ
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedStaff?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            予約日時
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {data.start_at &&
                                                new Date(
                                                    data.start_at,
                                                ).toLocaleString('ja-JP')}
                                        </span>
                                    </div>
                                    {data.note && (
                                        <div>
                                            <span className="text-gray-500">
                                                備考
                                            </span>
                                            <p className="mt-1 text-gray-800">
                                                {data.note}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* サーバー側バリデーションエラー（日付の重複など）はここに表示される */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                                        <ul className="list-inside list-disc">
                                            {Object.values(errors).map(
                                                (message, i) => (
                                                    <li key={i}>{message}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="rounded-full border border-gray-300 px-6 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                                    >
                                        戻る
                                    </button>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="!rounded-full !bg-gradient-to-r !from-orange-400 !to-rose-500 !px-8 !py-2.5 !text-sm"
                                    >
                                        {processing
                                            ? '送信中...'
                                            : 'この内容で予約する'}
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </SiteLayout>
    );
}
