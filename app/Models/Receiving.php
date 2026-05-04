<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receiving extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'invoice_no',
        'supplier_id',
        'product_id',
        'qty',
        'cost_price',
        'total',
        'date',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
