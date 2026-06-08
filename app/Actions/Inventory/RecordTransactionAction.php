<?php

namespace App\Actions\Inventory;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordTransactionAction
{
    public function handle(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $today = now()->format('Ymd');
            $lastNumber = Transaction::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $calculatedSubtotal = 0;
            $itemsToProcess = [];

            // Decode items if it is passed as a JSON string (due to FormData uploads)
            $items = isset($data['items']) 
                ? (is_string($data['items']) ? json_decode($data['items'], true) : $data['items']) 
                : [];

            if (!is_array($items)) {
                throw new \InvalidArgumentException("Invalid format for items.");
            }

            foreach ($items as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['qty']) {
                    throw ValidationException::withMessages([
                        'items' => "Stok produk {$product->name} tidak mencukupi.",
                    ]);
                }

                $sellingPrice = $product->price;
                $itemSubtotal = $item['qty'] * $sellingPrice;
                $calculatedSubtotal += $itemSubtotal;

                // Get latest cost price for profit calculation
                $lastReceiving = $product->receivings()->latest()->first();
                $costPrice = $lastReceiving ? $lastReceiving->cost_price : 0;

                $itemsToProcess[] = [
                    'product' => $product,
                    'qty' => $item['qty'],
                    'cost_price' => $costPrice,
                    'selling_price' => $sellingPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            $discount = $data['discount'] ?? 0;
            $calculatedTax = $calculatedSubtotal * 0.1; // 10% tax
            $calculatedTotal = $calculatedSubtotal - $discount + $calculatedTax;
            
            $payAmount = $data['pay_amount'];
            $changeAmount = $payAmount - $calculatedTotal;

            if ($payAmount < $calculatedTotal) {
                 throw ValidationException::withMessages([
                        'pay_amount' => "Uang pembayaran kurang.",
                 ]);
            }

            $invoiceNo = 'INV-' . $today . '-' . str_pad($lastNumber, 4, '0', STR_PAD_LEFT);

            // Handle uploading of the transfer proof file if present
            $transferProofPath = null;
            if (isset($data['transfer_proof']) && $data['transfer_proof'] instanceof \Illuminate\Http\UploadedFile) {
                $transferProofPath = $data['transfer_proof']->store('transfer_proofs', 'public');
            }

            $transaction = Transaction::create([
                'invoice_no' => $invoiceNo,
                'user_id' => Auth::id(),
                'subtotal' => $calculatedSubtotal,
                'discount' => $discount,
                'tax' => $calculatedTax,
                'total' => $calculatedTotal,
                'pay_amount' => $payAmount,
                'change_amount' => $changeAmount,
                'payment_method' => $data['payment_method'] ?? 'cash',
                'transfer_proof' => $transferProofPath,
                'note' => $data['note'] ?? null,
            ]);

            foreach ($itemsToProcess as $processedItem) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $processedItem['product']->id,
                    'qty' => $processedItem['qty'],
                    'cost_price' => $processedItem['cost_price'],
                    'selling_price' => $processedItem['selling_price'],
                    'subtotal' => $processedItem['subtotal'],
                ]);

                $product = $processedItem['product'];
                $stockBefore = $product->stock;
                $product->decrement('stock', $processedItem['qty']);
                $stockAfter = $product->stock;

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'sale',
                    'reference_type' => Transaction::class,
                    'reference_id' => $transaction->id,
                    'qty_in' => 0,
                    'qty_out' => $processedItem['qty'],
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockAfter,
                    'note' => "Penjualan {$invoiceNo}",
                    'created_by' => Auth::id(),
                ]);
            }

            return $transaction;
        });
    }
}
