<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', \Illuminate\Validation\Rule::unique('products', 'name')->ignore($this->route('product'))],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
