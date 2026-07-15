<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        // CORS
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        // Trust proxies
        $middleware->trustProxies(at: '*');
        // Middleware aliases
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserRole::class,
            'active' => \App\Http\Middleware\EnsureUserIsActive::class,
            'verified.student' => \App\Http\Middleware\EnsureStudentIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();