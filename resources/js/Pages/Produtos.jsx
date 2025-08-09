import { usePage } from "@inertiajs/react";

export default function Produtos() {
    const produtos = usePage().props.produtos || [];

    const formatPrice = (value) => parseFloat(value).toFixed(2);

    return (
        <section className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center">
                Produtos
            </h1>

            {produtos.length === 0 ? (
                <p className="text-center text-gray-500">
                    Nenhum produto encontrado.
                </p>
            ) : (
                <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {produtos.map((p) => (
                        <li
                            key={p.id}
                            className="bg-white shadow-lg rounded-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                                {p.name}
                            </h2>

                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">
                                    Preço de Custo:
                                </span>{" "}
                                R$ {formatPrice(p.cost_price)}
                            </p>

                            <p className="text-green-600 mb-1">
                                <span className="font-medium">Lucro:</span> R${" "}
                                {formatPrice(p.profit_margin)}
                            </p>

                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">Categoria:</span>{" "}
                                {p.category || "Sem categoria"}
                            </p>

                            {p.description && (
                                <p className="italic text-gray-500 mb-4">
                                    {p.description}
                                </p>
                            )}

                            <p className="text-lg font-bold text-indigo-700">
                                Preço de Venda: R$ {formatPrice(p.sale_price)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
