<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    protected $fillable = [
        'product_id',
        'system_stock',
        'physical_stock',
        'difference',
        'note',
        'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}