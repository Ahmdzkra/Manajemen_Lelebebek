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
            $receivings = [];
            
            $today = now()->format('Ymd');
            $lastNumber = Receiving::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $invoiceNo = 'RCV-' . $today . '-' . str_pad($lastNumber, 3, '0', STR_PAD_LEFT);

            foreach ($data['items'] as $item) {
                $productName = trim($item['product_name']);
                
                if (!empty($item['product_id'])) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                } else {
                    $product = Product::where('name', $productName)->lockForUpdate()->first();
                    if (!$product) {
                        $hargaBaru = (float) $item['cost_price'];
                        $hargaJual = ceil($hargaBaru * 1.2 / 100) * 100; // Margin 20% otomatis untuk barang baru
                        $product = Product::create([
                            'name' => $productName,
                            'stock' => 0,
                            'cost_price' => $hargaBaru,
                            'price' => $hargaJual
                        ]);
                    }
                }

                $qty = (int) $item['qty'];
                $hargaBaru = (float) $item['cost_price'];

                $stokLama = $product->stock;
                $hppLama = $product->cost_price ?? 0;
                $totalStok = $stokLama + $qty;

                // HPP Baru = ((Stok Lama x HPP Lama) + (Stok Baru x Harga Baru)) / Total Stok
                $hppBaru = $totalStok > 0 
                    ? (($stokLama * $hppLama) + ($qty * $hargaBaru)) / $totalStok 
                    : $hargaBaru;

                $updates = ['cost_price' => $hppBaru];

                // Hanya update harga jual jika HPP baru naik melebihi harga jual saat ini
                // Jika HPP baru turun, harga jual tetap mengikuti harga tertinggi terakhir
                if ($hppBaru >= $product->price) {
                    $updates['price'] = ceil($hppBaru * 1.2 / 100) * 100; // Margin 20%, pembulatan ke ratusan
                }

                $product->update($updates);

                $stockBefore = $stokLama;

                $receiving = Receiving::create([
                    'invoice_no' => $invoiceNo,
                    'supplier_id' => $data['supplier_id'],
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'cost_price' => $hargaBaru, // Harga beli aktual untuk riwayat penerimaan
                    'total' => $qty * $hargaBaru,
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

                $receivings[] = $receiving;
            }

            return end($receivings);
        });
    }
}
