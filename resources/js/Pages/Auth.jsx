import React, { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true; // importante para cookies do Sanctum

export default function Auth() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/user"); // ou /me, se você tiver configurado
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleAuth = async (type) => {
        if (!email || !password) {
            setMessage("Por favor, preencha email e senha.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // 1. Necessário para ativar cookies de sessão
            await axios.get("/sanctum/csrf-cookie");

            if (type === "login") {
                await axios.post("/login", {
                    email,
                    password,
                });
                setMessage("Login realizado com sucesso!");
            } else if (type === "register") {
                await axios.post("/register", {
                    name: email, // ou outro valor se você tiver um campo "name"
                    email,
                    password,
                    password_confirmation: password,
                });
                setMessage("Registro realizado com sucesso!");
            }

            setEmail("");
            setPassword("");
            await fetchUser();
        } catch (error) {
            if (error.response?.data?.errors) {
                const firstError = Object.values(
                    error.response.data.errors
                )[0][0];
                setMessage(`Erro: ${firstError}`);
            } else if (error.response?.data?.message) {
                setMessage(`Erro: ${error.response.data.message}`);
            } else {
                setMessage("Erro na autenticação.");
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
        } catch {
            setMessage("Erro ao fazer logout.");
        }
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "auto",
                padding: 20,
                fontFamily: "Arial, sans-serif",
            }}
        >
            {!user ? (
                <>
                    <h2>Login / Registro</h2>

                    {message && (
                        <p
                            style={{
                                color: message.startsWith("Erro")
                                    ? "red"
                                    : "green",
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 10 }}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: 8, marginBottom: 10 }}
                    />

                    <button
                        onClick={() => handleAuth("login")}
                        disabled={loading}
                        style={{ width: "48%", marginRight: "4%", padding: 10 }}
                    >
                        {loading ? "Carregando..." : "Login"}
                    </button>
                    <button
                        onClick={() => handleAuth("register")}
                        disabled={loading}
                        style={{ width: "48%", padding: 10 }}
                    >
                        {loading ? "Carregando..." : "Registrar"}
                    </button>
                </>
            ) : (
                <>
                    <h2>Bem-vindo, {user?.email || "Usuário"}</h2>
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    <button onClick={logout} style={{ padding: 10 }}>
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}
