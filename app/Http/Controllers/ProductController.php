<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Products/Index', [
            'products' => Product::with('latestReceiving')
                ->filter($request->only('search', 'sort'))
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only('search', 'sort'),
        ]);
    }

    public function master(Request $request)
    {
        return Inertia::render('MasterProducts/Index', [
            'products' => Product::filter($request->only('search', 'sort'))
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only('search', 'sort'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(StoreProductRequest $request)
    {
        // Jalankan migrasi secara otomatis jika belum dijalankan
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);

        $validated = $request->validated();
        $validated['name'] = trim($validated['name']);

        $productData = [
            'name' => $validated['name'],
            'stock' => 0,
            'price' => 0,
            'cost_price' => null,
        ];

        if (!empty($validated['created_at'])) {
            $productData['created_at'] = $validated['created_at'];
            $productData['updated_at'] = $validated['created_at'];
        }

        Product::create($productData);

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product)
    {
        //
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        $validated['name'] = trim($validated['name']);

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
        ]);

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
