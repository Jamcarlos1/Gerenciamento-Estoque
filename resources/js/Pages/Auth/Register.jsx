import React from "react";
import axios from "axios";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, processing, errors, reset, setErrors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            // 1. Obtém o cookie CSRF necessário para a autenticação via sessão
            await axios.get("/sanctum/csrf-cookie");

            // 2. Faz o registro do usuário
            await axios.post("/api/register", {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            // 3. Redireciona para o dashboard
            window.location.href = "/dashboard";

            // 4. Limpa o formulário (opcional)
            reset();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Erro desconhecido:", error);
                setErrors({ general: "Ocorreu um erro. Tente novamente." });
            }
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-indigo-700 text-center">
                    Create an Account
                </h2>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {errors.general && (
                        <div className="text-red-600 text-center">
                            {errors.general}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <Link
                            href="/login"
                            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton
                            className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={processing}
                        >
                            {processing ? "Registering..." : "Register"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
