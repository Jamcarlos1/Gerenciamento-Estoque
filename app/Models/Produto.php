<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produtos';

    protected $fillable = [
        'name',
        'cost_price',
        'profit_margin',
        'description',
        'category',
    ];

    protected $casts = [
        'cost_price' => 'float',
        'profit_margin' => 'float',
    ];

    protected $appends = ['sale_price'];

    public function getSalePriceAttribute(): string
    {
        $cost = $this->cost_price ?? 0;
        $margin = $this->profit_margin ?? 0;

        $salePrice = $cost * (1 + $margin / 100);

        return number_format($salePrice, 2, '.', '');
    }
}
