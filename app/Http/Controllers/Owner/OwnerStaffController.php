<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/**
 * サロンオーナー向けのスタッフ管理（登録・編集・削除）を担当するController
 */
class OwnerStaffController extends Controller
{
    /**
     * スタッフ一覧（登録フォーム込み）
     * URL: GET /owner/salons/{salon}/staffs
     */
    public function index(Salon $salon)
    {
        abort_if($salon->user_id !== auth()->id(), 403);

        $salon->load('staffs');

        return Inertia::render('Owner/Staffs/Index', [
            'salon' => $salon,
        ]);
    }

    /**
     * スタッフを新規登録する
     * URL: POST /owner/salons/{salon}/staffs
     */
    public function store(Request $request, Salon $salon)
    {
        abort_if($salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'bio'      => 'nullable|string|max:1000',
            'image'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        }

        $salon->staffs()->create($validated);

        return back()->with('success', 'スタッフを登録しました。');
    }

    /**
     * スタッフ情報を更新する
     * URL: PUT /owner/staffs/{staff}
     */
    public function update(Request $request, Staff $staff)
    {
        // staffは直接salon_idを持っているだけなので、
        // staff->salon経由で「自分のサロンのスタッフか」を確認する
        abort_if($staff->salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'bio'      => 'nullable|string|max:1000',
            'image'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request);
        } else {
            unset($validated['image']);
        }

        $staff->update($validated);

        return back()->with('success', 'スタッフ情報を更新しました。');
    }

    /**
     * スタッフを削除する
     * URL: DELETE /owner/staffs/{staff}
     */
    public function destroy(Staff $staff)
    {
        abort_if($staff->salon->user_id !== auth()->id(), 403);

        $staff->delete();

        return back()->with('success', 'スタッフを削除しました。');
    }

    /**
     * アップロードされた画像ファイルをstorage/app/public/staffsに保存し、
     * ブラウザからアクセスできるURL（/storage/staffs/xxxx.jpg）を返す
     */
    private function storeImage(Request $request): string
    {
        $path = $request->file('image')->store('staffs', 'public');

        return Storage::disk('public')->url($path);
    }
}
