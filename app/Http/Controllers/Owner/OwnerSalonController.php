<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * サロンオーナー向けの「自分のサロン情報」管理を担当するController
 * ロール（役職）列は無く、salons.user_id === auth()->id() を毎回チェックすることで
 * 「そのサロンの持ち主かどうか」を判定するこのプロジェクト共通のIDOR対策パターンを使う
 */
class OwnerSalonController extends Controller
{
    /**
     * 新規サロン登録フォームを表示する
     * URL: GET /owner/salons/create
     *
     * 既存サロンの所有者かどうかは問わない。ログインしていれば誰でも
     * 「自分のサロン」を新しく登録できる（実際のHot Pepper等は営業審査があるが、
     * 学習用サイトのため即時登録に簡略化している）
     */
    public function create()
    {
        return Inertia::render('Owner/Salons/Create');
    }

    /**
     * サロンを新規登録する
     * URL: POST /owner/salons
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'genre'       => 'required|in:hair,nail,eyelash,relaxation',
            'name'        => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'description' => 'nullable|string|max:2000',
            'image'       => 'nullable|image|max:2048',
            'lat'         => 'nullable|numeric|between:-90,90',
            'lng'         => 'nullable|numeric|between:-180,180',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        }

        // 登録した人が、そのままこのサロンのオーナーになる
        $validated['user_id'] = auth()->id();

        $salon = Salon::create($validated);

        return redirect()->route('owner.salons.edit', $salon)
            ->with('success', 'サロンを登録しました。続けてスタッフやメニューを登録しましょう。');
    }

    /**
     * サロン編集フォームを表示する
     * URL: GET /owner/salons/{salon}/edit
     */
    public function edit(Salon $salon)
    {
        // 自分が所有するサロン以外は編集させない（IDOR対策）
        // URLの{salon}を他人のサロンIDに書き換えてアクセスされても弾く
        abort_if($salon->user_id !== auth()->id(), 403);

        return Inertia::render('Owner/Salons/Edit', [
            'salon' => $salon,
        ]);
    }

    /**
     * サロン情報を更新する
     * URL: PUT /owner/salons/{salon}
     */
    public function update(Request $request, Salon $salon)
    {
        abort_if($salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'genre'       => 'required|in:hair,nail,eyelash,relaxation',
            'name'        => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'description' => 'nullable|string|max:2000',
            'image'       => 'nullable|image|max:2048',
            'lat'         => 'nullable|numeric|between:-90,90',
            'lng'         => 'nullable|numeric|between:-180,180',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        } else {
            // 新しい画像が送られてこなければ、既存の画像をそのまま維持する
            unset($validated['image']);
        }

        $salon->update($validated);

        return back()->with('success', 'サロン情報を更新しました。');
    }

    /**
     * アップロードされた画像ファイルをstorage/app/public/salonsに保存し、
     * ブラウザからアクセスできるURL（/storage/salons/xxxx.jpg）を返す
     *
     * store('salons', 'public') = Laravelのファイルストレージ機能。
     * 'public'ディスク(storage/app/public)に保存し、`php artisan storage:link`で作った
     * シンボリックリンク経由でブラウザから直接アクセスできるようにしている
     */
    private function storeImage(Request $request): string
    {
        $path = $request->file('image')->store('salons', 'public');

        return Storage::disk('public')->url($path);
    }
}
