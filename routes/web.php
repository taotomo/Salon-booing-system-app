<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Owner\OwnerBookingController;
use App\Http\Controllers\Owner\OwnerDashboardController;
use App\Http\Controllers\Owner\OwnerSalonController;
use App\Http\Controllers\Owner\OwnerServiceController;
use App\Http\Controllers\Owner\OwnerStaffController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SalonController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| トップページ
|--------------------------------------------------------------------------
| 誰でもアクセスできる（ログイン不要）
*/

//Inertia::render() = LaravelからReactにデータを渡す方法
//canLogin = ログインページへのリンクを表示するかどうか
//canRegister = 会員登録ページへのリンクを表示するかどうか
//laravelVersion = Laravelのバージョン
//phpVersion = PHPのバージョン
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| サロン関連（ログイン不要）
|--------------------------------------------------------------------------
| 検索・一覧・詳細は誰でも見られる
*/

// GET /salons → サロン一覧ページ
Route::get('/salons', [SalonController::class, 'index'])->name('salons.index');

// GET /salons/{salon} → サロン詳細ページ
// {salon} の部分が自動的にSalonモデルに変換される（ルートモデルバインディング）
Route::get('/salons/{salon}', [SalonController::class, 'show'])->name('salons.show');

/*
|--------------------------------------------------------------------------
| 要ログイン（middleware('auth')）
|--------------------------------------------------------------------------
| ログインしていないとアクセスできない
| 未ログインの場合はログインページに自動リダイレクト
*/
Route::middleware('auth')->group(function () {

    // ダッシュボード（マイページ）
    // 予約履歴の要約・投稿したレビューをまとめて表示する
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('verified')
        ->name('dashboard');

    // プロフィール編集（Breezeが自動生成）
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    | 予約関連
    | GET  /salons/{salon}/bookings/create → 予約フォームページ
    | GET  /bookings                       → 予約一覧（マイページ）
    | POST /bookings                       → 予約を保存
    */
    Route::get('/salons/{salon}/bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}/complete', [BookingController::class, 'complete'])->name('bookings.complete');
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    /*
    | レビュー関連
    | POST /reviews → レビューを保存
    | （レビューの入力フォームはサロン詳細ページに埋め込む）
    */
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    /*
    |----------------------------------------------------------------------
    | オーナー向け管理画面
    |----------------------------------------------------------------------
    | ロール列は持たせず、「salons.user_id が自分のIDと一致するか」を
    | 各コントローラーの中で毎回チェックすることで所有者かどうかを判定している
    | （詳しくは各コントローラーの abort_if を参照）
    */
    Route::prefix('owner')->name('owner.')->group(function () {
        Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');

        Route::get('/salons/{salon}/edit', [OwnerSalonController::class, 'edit'])->name('salons.edit');
        Route::put('/salons/{salon}', [OwnerSalonController::class, 'update'])->name('salons.update');

        Route::get('/salons/{salon}/staffs', [OwnerStaffController::class, 'index'])->name('staffs.index');
        Route::post('/salons/{salon}/staffs', [OwnerStaffController::class, 'store'])->name('staffs.store');
        Route::put('/staffs/{staff}', [OwnerStaffController::class, 'update'])->name('staffs.update');
        Route::delete('/staffs/{staff}', [OwnerStaffController::class, 'destroy'])->name('staffs.destroy');

        Route::get('/salons/{salon}/services', [OwnerServiceController::class, 'index'])->name('services.index');
        Route::post('/salons/{salon}/services', [OwnerServiceController::class, 'store'])->name('services.store');
        Route::put('/services/{service}', [OwnerServiceController::class, 'update'])->name('services.update');
        Route::delete('/services/{service}', [OwnerServiceController::class, 'destroy'])->name('services.destroy');

        Route::get('/bookings', [OwnerBookingController::class, 'index'])->name('bookings.index');
        Route::patch('/bookings/{booking}/status', [OwnerBookingController::class, 'updateStatus'])->name('bookings.updateStatus');
    });
});

/*
|--------------------------------------------------------------------------
| 認証ルート（Breezeが自動生成）
|--------------------------------------------------------------------------
| ログイン・会員登録・パスワードリセットなど
*/
// Breezeが自動生成する auth.php を読み込む
//__DIR__ = 現在のファイルがあるディレクトリのパス
//require = ファイルを読み込む（読み込めなかったらエラー）
require __DIR__ . '/auth.php';
