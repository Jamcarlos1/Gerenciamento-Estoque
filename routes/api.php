<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckEmailController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Essas rotas são carregadas pelo RouteServiceProvider dentro de um grupo
| atribuído ao middleware "api". Ideal para APIs com autenticação via tokens.
| Laravel Sanctum pode ser usado com SPA ou APIs com tokens.
*/


Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/check-email', [CheckEmailController::class, 'check']);


// 🔒 Rotas protegidas (requer token Sanctum ou cookie de sessão)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});



