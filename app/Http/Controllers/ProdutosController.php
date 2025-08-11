<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cost_price' => 'required|numeric|min:0',
            'profit_margin' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
        ]);

        Produto::create($validated);

        return redirect()->route('produtos.index')->with('success', 'Produto criado com sucesso!');
    }

    public function update(Request $request, Produto $produto)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'cost_price' => 'required|numeric|min:0',
            'profit_margin' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
        ]);

        $produto->update($validated);

        return redirect()->route('produtos.index')->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Produto $produto)
    {
        $produto->delete();

        return redirect()->route('produtos.index')->with('success', 'Produto excluído com sucesso!');
    }
}
