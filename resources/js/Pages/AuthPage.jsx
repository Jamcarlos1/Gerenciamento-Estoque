import React, { useState } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export default function AuthPage() {
    // Estados para registro
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    // Estados para login
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // ⬅️ estado para erros

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/user");
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    // ⬇️ Função para verificar se o e-mail já está cadastrado
    const checkEmailExists = async (email) => {
        if (!email) return;

        try {
            const res = await axios.post("/api/check-email", { email });

            if (res.data.exists) {
                setErrors((prev) => ({
                    ...prev,
                    email: ["Este email já está cadastrado."],
                }));
            } else {
                setErrors((prev) => ({ ...prev, email: null }));
            }
        } catch (err) {
            console.error("Erro ao verificar e-mail", err);
        }
    };

    const handleAuth = async (type) => {
        setMessage(null);
        setLoading(true);

        if (type === "register" && errors.email) {
            setMessage("Corrija os erros antes de continuar.");
            setLoading(false);
            return;
        }

        try {
            await axios.get("/sanctum/csrf-cookie");

            if (type === "register") {
                await axios.post("/register", {
                    name: registerEmail,
                    email: registerEmail,
                    password: registerPassword,
                    password_confirmation: registerPassword,
                });

                setMessage("Registro realizado com sucesso!");
                setRegisterEmail("");
                setRegisterPassword("");
                await fetchUser();
            }

            if (type === "login") {
                await axios.post("/api/login", {
                    email: loginEmail,
                    password: loginPassword,
                });

                setMessage("Login realizado com sucesso!");
                setLoginEmail("");
                setLoginPassword("");
                await fetchUser();
                Inertia.visit("/produtos");
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const first = Object.values(err.response.data.errors)[0][0];
                setMessage(`Erro: ${first}`);
            } else {
                setMessage("Erro ao autenticar.");
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post("/logout");
            setUser(null);
            setMessage("Logout realizado.");
            Inertia.visit("api/login");
        } catch {
            setMessage("Erro ao fazer logout.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
            <h1 className="text-3xl font-bold text-center text-indigo-700">
                Autenticação
            </h1>

            {message && (
                <div
                    className={`text-center ${
                        message.startsWith("Erro")
                            ? "text-red-600"
                            : "text-green-600"
                    }`}
                >
                    {message}
                </div>
            )}

            {!user ? (
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Formulário Registro */}
                    <div>
                        <h2 className="text-xl font-semibold text-center text-indigo-600 mb-4">
                            Registrar
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAuth("register");
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="email"
                                placeholder="Email"
                                value={registerEmail}
                                onChange={(e) =>
                                    setRegisterEmail(e.target.value)
                                }
                                onBlur={() => checkEmailExists(registerEmail)} // ⬅️ dispara verificação ao sair do campo
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email[0]}
                                </p>
                            )}

                            <input
                                type="password"
                                placeholder="Senha"
                                value={registerPassword}
                                onChange={(e) =>
                                    setRegisterPassword(e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {loading ? "Carregando..." : "Registrar"}
                            </button>
                        </form>
                    </div>

                    {/* Formulário Login */}
                    <div>
                        <h2 className="text-xl font-semibold text-center text-indigo-600 mb-4">
                            Login
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAuth("login");
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={loginPassword}
                                onChange={(e) =>
                                    setLoginPassword(e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {loading ? "Carregando..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-2xl">
                        Bem-vindo, {user.name || user.email}
                    </h2>
                    <button
                        onClick={logout}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
