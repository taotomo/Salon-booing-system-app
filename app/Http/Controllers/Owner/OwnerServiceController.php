<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * サロンオーナー向けのメニュー（サービス）管理（登録・編集・削除）を担当するController
 */
class OwnerServiceController extends Controller
{
    /**
     * メニュー一覧（登録フォーム込み）
     * URL: GET /owner/salons/{salon}/services
     */
    public function index(Salon $salon)
    {
        abort_if($salon->user_id !== auth()->id(), 403);

        $salon->load('services');

        return Inertia::render('Owner/Services/Index', [
            'salon' => $salon,
        ]);
    }

    /**
     * メニューを新規登録する
     * URL: POST /owner/salons/{salon}/services
     */
    public function store(Request $request, Salon $salon)
    {
        abort_if($salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price'       => 'required|integer|min:0',
            'duration'    => 'required|integer|min:1',
        ]);

        $salon->services()->create($validated);

        return back()->with('success', 'メニューを登録しました。');
    }

    /**
     * メニューを更新する
     * URL: PUT /owner/services/{service}
     */
    public function update(Request $request, Service $service)
    {
        abort_if($service->salon->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price'       => 'required|integer|min:0',
            'duration'    => 'required|integer|min:1',
        ]);

        $service->update($validated);

        return back()->with('success', 'メニューを更新しました。');
    }

    /**
     * メニューを削除する
     * URL: DELETE /owner/services/{service}
     */
    public function destroy(Service $service)
    {
        abort_if($service->salon->user_id !== auth()->id(), 403);

        $service->delete();

        return back()->with('success', 'メニューを削除しました。');
    }
}
