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

    public function create()
    {
        //
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $validated['name'] = trim($validated['name']);

        Product::create([
            'name' => $validated['name'],
            'stock' => $validated['stock'],
            'price' => $validated['price'],
        ]);

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
