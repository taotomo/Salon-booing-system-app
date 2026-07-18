<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerSalonController extends Controller
{
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
            'image'       => 'nullable|url|max:2000',
            'lat'         => 'nullable|numeric|between:-90,90',
            'lng'         => 'nullable|numeric|between:-180,180',
        ]);

        $salon->update($validated);

        return back()->with('success', 'サロン情報を更新しました。');
    }
}
