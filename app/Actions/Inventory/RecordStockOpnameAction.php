<?php

namespace App\Actions\Inventory;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\StockOpname;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecordStockOpnameAction
{
    public function handle(array $data): StockOpname
    {
        return DB::transaction(function () use ($data) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            $stockBefore = $product->stock;
            $physicalStock = (int) $data['physical_stock'];
            $difference = $physicalStock - $stockBefore;

            $stockOpname = StockOpname::create([
                'product_id' => $product->id,
                'system_stock' => $stockBefore,
                'physical_stock' => $physicalStock,
                'difference' => $difference,
                'note' => $data['note'] ?? null,
                'date' => $data['date'],
            ]);

            $product->update([
                'stock' => $physicalStock,
            ]);

            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'opname',
                'reference_type' => StockOpname::class,
                'reference_id' => $stockOpname->id,
                'qty_in' => $difference > 0 ? $difference : 0,
                'qty_out' => $difference < 0 ? abs($difference) : 0,
                'stock_before' => $stockBefore,
                'stock_after' => $physicalStock,
                'note' => $data['note'] ?? 'Stock opname',
                'created_by' => Auth::id(),
            ]);

            return $stockOpname;
        });
    }
}
