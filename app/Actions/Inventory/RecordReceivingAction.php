<?php

namespace App\Actions\Inventory;

use App\Models\Product;
use App\Models\Receiving;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordReceivingAction
{
    public function handle(array $data): Receiving
    {
        return DB::transaction(function () use ($data) {
            if (!empty($data['product_id'])) {
                $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            } else {
                // Create new product if it doesn't exist
                $product = Product::create([
                    'name' => $data['product_name'],
                    'stock' => 0,
                    'price' => 0, // Will be set in Product management page
                ]);
                $product = $product->fresh();
            }

            $qty = (int) $data['qty'];
            $costPrice = (float) $data['cost_price'];

            // Hanya update harga jual jika harga modal naik melebihi harga jual saat ini
            // Jika harga modal turun, harga jual tetap mengikuti harga tertinggi terakhir
            if ($costPrice >= $product->price) {
                $newSellingPrice = ceil($costPrice * 1.2 / 100) * 100; // Margin 20%, pembulatan ke ratusan
                $product->update(['price' => $newSellingPrice]);
            }

            $stockBefore = $product->stock;
            $today = now()->format('Ymd');
            $lastNumber = Receiving::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $invoiceNo = 'RCV-' . $today . '-' . str_pad($lastNumber, 3, '0', STR_PAD_LEFT);

            $receiving = Receiving::create([
                'invoice_no' => $invoiceNo,
                'supplier_id' => $data['supplier_id'],
                'product_id' => $product->id,
                'qty' => $qty,
                'cost_price' => $costPrice,
                'total' => $qty * $costPrice,
                'date' => $data['date'],
            ]);

            $product->increment('stock', $qty);
            $stockAfter = $stockBefore + $qty;

            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'receiving',
                'reference_type' => Receiving::class,
                'reference_id' => $receiving->id,
                'qty_in' => $qty,
                'qty_out' => 0,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'note' => 'Penerimaan barang ' . $invoiceNo,
                'created_by' => Auth::id(),
            ]);

            return $receiving;
        });
    }
}
