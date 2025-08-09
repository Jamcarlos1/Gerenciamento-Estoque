<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Inertia\Inertia;

class ProdutosController extends Controller
{
    public function index()
    {
        $produtos = Produto::all();

        return Inertia::render('Produtos', [
            'produtos' => $produtos,
        ]);
    }
}
