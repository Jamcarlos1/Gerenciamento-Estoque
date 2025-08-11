import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

export default function Produtos() {
    const { produtos, flash } = usePage().props;

    const [form, setForm] = useState({
        id: null,
        name: "",
        cost_price: "",
        profit_margin: "",
        description: "",
        category: "",
    });

    const formatPrice = (value) =>
        value !== null && value !== undefined
            ? parseFloat(value).toFixed(2)
            : "0.00";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.id) {
            Inertia.put(`/produtos/${form.id}`, form);
        } else {
            Inertia.post("/produtos", form);
        }
        setForm({
            id: null,
            name: "",
            cost_price: "",
            profit_margin: "",
            description: "",
            category: "",
        });
    };

    const handleEdit = (produto) => {
        setForm(produto);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            Inertia.delete(`/produtos/${id}`);
        }
    };

    return (
        <section className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center">
                Produtos
            </h1>

            {flash?.success && (
                <div className="mb-4 text-green-600 text-center font-medium">
                    {flash.success}
                </div>
            )}

            {/* Formulário */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4 border border-gray-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Preço de Custo"
                        value={form.cost_price}
                        onChange={(e) =>
                            setForm({ ...form, cost_price: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Margem de Lucro (%)"
                        value={form.profit_margin}
                        onChange={(e) =>
                            setForm({ ...form, profit_margin: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Categoria"
                        value={form.category}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
                <textarea
                    placeholder="Descrição"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                ></textarea>
                <button
                    type="submit"
                    className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    {form.id ? "Atualizar" : "Adicionar"} Produto
                </button>
            </form>

            {/* Lista em tabela */}
            {produtos.length === 0 ? (
                <p className="text-center text-gray-500">
                    Nenhum produto encontrado.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="p-3 text-left">Nome</th>
                                <th className="p-3 text-left">Custo (R$)</th>
                                <th className="p-3 text-left">Lucro (%)</th>
                                <th className="p-3 text-left">Categoria</th>
                                <th className="p-3 text-left">Venda (R$)</th>
                                <th className="p-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">
                                        {formatPrice(p.cost_price)}
                                    </td>
                                    <td className="p-3">
                                        {formatPrice(p.profit_margin)}
                                    </td>
                                    <td className="p-3">
                                        {p.category || "Sem categoria"}
                                    </td>
                                    <td className="p-3">
                                        {formatPrice(p.sale_price)}
                                    </td>
                                    <td className="p-3 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
