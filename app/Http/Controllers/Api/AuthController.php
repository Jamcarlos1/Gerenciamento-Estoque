<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    // Registro
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
           'password' => Hash::make($request->password),

        ]);

        // Opcional: login automático após registro
        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuário registrado com sucesso',
            // 'token' => $token,
            'user' => $user,
        ], 201);
    }

    // Login
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['As credenciais fornecidas estão incorretas.'],
        ]);
    }

    // Se estiver usando sessão com Sanctum, não precisa gerar token
    return response()->json([
        'message' => 'Login realizado com sucesso',
        'user' => $user,
    ]);
}


    // Logout
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request...
        // Se usar tokens pessoais:
        // $request->user()->currentAccessToken()->delete();

        // Se usar SPA + Sanctum com sessão:
        auth()->guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }
}
