<?php

namespace App\Providers;
use Inertia\Inertia;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('auth', [
            'user' => function () {
                // Return manually bound Firebase user if available
                return request()->get('firebase_user') ?? null;
            },
        ]);
    }
}
