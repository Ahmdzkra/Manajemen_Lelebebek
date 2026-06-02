<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReturnItem extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'supplier_id',
        'product_id',
        'qty',
        'reason',
        'date',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class)->withTrashed();
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
