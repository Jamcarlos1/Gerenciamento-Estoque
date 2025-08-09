<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * O namespace aplicado aos controladores
     *
     * @var string|null
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define as rotas da aplicação.
     */
  public function map()
{
    $this->mapApiRoutes();
    $this->mapWebRoutes();
}


    /**
     * Rotas web
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Rotas API
     */
 protected function mapApiRoutes()
{
    Route::prefix('api')
        ->middleware('api')
        ->namespace($this->namespace . '\Api') // Namespace para os controllers API
        ->group(base_path('routes/api.php'));
}

}
