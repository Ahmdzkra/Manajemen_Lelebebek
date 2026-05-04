<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'product_id',
        'qty',
        'price',
        'total',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}