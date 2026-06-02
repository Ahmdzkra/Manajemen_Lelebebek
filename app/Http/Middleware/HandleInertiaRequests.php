<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Calculate low stock items for global notifications
        $lowStockProducts = \App\Models\Product::where('stock', '<', 500)
            ->select('id', 'name', 'stock')
            ->orderBy('stock', 'asc')
            ->get();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'role' => $request->user()->role,
                        'avatar' => $request->user()->avatar,
                    ]
                    : null,
                'role' => $request->user()?->role,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'print_id' => fn () => $request->session()->get('print_id'),
            ],
            'notifications' => [
                'low_stock_count' => $lowStockProducts->count(),
                'low_stock_products' => $lowStockProducts,
            ],
        ]);
    }
}
