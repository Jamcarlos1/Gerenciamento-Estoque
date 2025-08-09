<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProdutosController;
use Laravel\Fortify\Fortify;

// 🔒 Garante que o Fortify forneça a view padrão (caso esteja usando blade)
Fortify::loginView(fn () => view('auth.login'));

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ✅ Produtos públicos
Route::get('/produtos', [ProdutosController::class, 'index'])->name('produtos.index');

// ✅ Página Inertia com Login e Registro via React
Route::get('/login-api', function () {
    return Inertia::render('AuthPage');
})->name('login.api');

// ✅ Rotas personalizadas de login/logout usando Fortify (caso precise diretamente no web.php)
Route::middleware(['web'])->group(function () {
    Route::post('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy']);
});

// ✅ Inclui todas as rotas padrão de auth (via Fortify)
require __DIR__.'/auth.php';
