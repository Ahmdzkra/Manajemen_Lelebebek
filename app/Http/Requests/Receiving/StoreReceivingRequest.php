<?php

namespace App\Http\Requests\Receiving;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceivingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'product_id' => ['nullable', 'exists:products,id'],
            'product_name' => ['required_without:product_id', 'nullable', 'string', 'max:255'],
            'qty' => ['required', 'integer', 'min:1'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date'],
        ];
    }
}
