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
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = StockMovement::with(['product', 'user'])
            ->with(['reference' => function ($morphTo) {
                $morphTo->morphWith([
                    \App\Models\Receiving::class => ['supplier'],
                    \App\Models\ReturnItem::class => ['supplier'],
                ]);
            }]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('product', function ($pQ) use ($search) {
                    $pQ->where('name', 'like', "%{$search}%");
                })->orWhere('note', 'like', "%{$search}%");
            });
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $movements = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'filters' => [
                'search' => $search,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
