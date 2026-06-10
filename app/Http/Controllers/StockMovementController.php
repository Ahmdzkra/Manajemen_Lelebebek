<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $movements = StockMovement::with(['product', 'user'])
            ->with(['reference' => function ($morphTo) {
                $morphTo->morphWith([
                    \App\Models\Receiving::class => ['supplier'],
                    \App\Models\ReturnItem::class => ['supplier'],
                ]);
            }])
            ->when($search, function ($query, $search) {
                $query->whereHas('product', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('note', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'filters' => ['search' => $search],
        ]);
    }
}
