<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'stock',
        'cost_price',
        'price',
        'created_at',
        'updated_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function receivings()
    {
        return $this->hasMany(Receiving::class);
    }

    public function latestReceiving()
    {
        return $this->hasOne(Receiving::class)->latestOfMany();
    }

    public function returnItems()
    {
        return $this->hasMany(ReturnItem::class);
    }

    public function stockOpnames()
    {
        return $this->hasMany(StockOpname::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%');
        });

        $query->when($filters['sort'] ?? null, function ($query, $sort) {
            match ($sort) {
                'oldest' => $query->oldest(),
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                default => $query->latest(),
            };
        });
    }
}
