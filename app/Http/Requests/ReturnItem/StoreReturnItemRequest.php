<?php

namespace App\Http\Requests\ReturnItem;

use Illuminate\Foundation\Http\FormRequest;

class StoreReturnItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'product_id' => ['required', 'exists:products,id'],
            'qty' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string'],
            'date' => ['required', 'date'],
        ];
    }
}
