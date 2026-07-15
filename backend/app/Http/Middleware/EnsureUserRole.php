<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role, string ...$additionalRoles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized',
                'data' => (object) [],
            ], 401);
        }

        $allowedRoles = array_map('trim', explode(',', $role));

        foreach ($additionalRoles as $additionalRole) {
            $allowedRoles = array_merge($allowedRoles, array_map('trim', explode(',', $additionalRole)));
        }

        $allowedRoles = array_filter(array_map('strval', $allowedRoles));

        if (!in_array($request->user()->role, $allowedRoles, true)) {
            return response()->json([
                'status' => false,
                'message' => "This action requires {" . implode(',', $allowedRoles) . "} role",
                'data' => (object) [],
            ], 403);
        }

        return $next($request);
    }
}
