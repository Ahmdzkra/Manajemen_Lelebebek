<?php

namespace App\Actions\Inventory;

use App\Models\Product;
use App\Models\ReturnItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordReturnAction
{
    public function handle(array $data): ReturnItem
    {
        return DB::transaction(function () use ($data) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            $qty = (int) $data['qty'];

            if ($qty > $product->stock) {
                throw ValidationException::withMessages([
                    'qty' => 'Stok tidak mencukupi untuk retur.',
                ]);
            }

            $stockBefore = $product->stock;

            $returnItem = ReturnItem::create([
                'supplier_id' => $data['supplier_id'],
                'product_id' => $product->id,
                'qty' => $qty,
                'reason' => $data['reason'],
                'date' => $data['date'],
            ]);

            $product->decrement('stock', $qty);
            $stockAfter = $stockBefore - $qty;

            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'return',
                'reference_type' => ReturnItem::class,
                'reference_id' => $returnItem->id,
                'qty_in' => 0,
                'qty_out' => $qty,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'note' => $data['reason'],
                'created_by' => Auth::id(),
            ]);

            return $returnItem;
        });
    }
}
