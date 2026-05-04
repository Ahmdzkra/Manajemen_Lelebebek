<?php

namespace App\Http\Requests\StockOpname;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockOpnameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'physical_stock' => ['required', 'integer', 'min:0'],
            'note' => ['nullable', 'string'],
            'date' => ['required', 'date'],
        ];
    }
}
