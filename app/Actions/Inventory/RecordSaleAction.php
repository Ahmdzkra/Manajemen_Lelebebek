<?php

namespace App\Actions\Inventory;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordSaleAction
{
    public function handle(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            $qty = (int) $data['qty'];

            if ($product->stock < $qty) {
                throw ValidationException::withMessages([
                    'qty' => 'Stock tidak mencukupi.',
                ]);
            }

            $stockBefore = $product->stock;
            $total = $product->price * $qty;

            $sale = Sale::create([
                'product_id' => $product->id,
                'qty' => $qty,
                'price' => $product->price,
                'total' => $total,
            ]);

            $product->decrement('stock', $qty);
            $stockAfter = $stockBefore - $qty;

            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'sale',
                'reference_type' => Sale::class,
                'reference_id' => $sale->id,
                'qty_in' => 0,
                'qty_out' => $qty,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'note' => 'Penjualan produk',
                'created_by' => Auth::id(),
            ]);

            return $sale;
        });
    }
}
