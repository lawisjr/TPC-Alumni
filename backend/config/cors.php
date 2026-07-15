<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure CORS settings for your application. This
    | configuration is used by the HandleCors middleware to check incoming
    | cross-origin requests.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',           // Admin web app
        'http://localhost:5173',           // Vite dev server
        'http://10.0.2.2:5173',            // Android emulator to Vite dev
        'http://10.0.2.2:3000',            // Android emulator to port 3000
        'http://10.0.2.2:8000',            // Android emulator to backend
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',
    ],

    'allowed_origins_patterns' => [
        '#http://10\.0\.2\.2.*#',
        '#http://localhost.*#',
        '#http://127\.0\.0\.1.*#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Content-Type', 'Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,
];
