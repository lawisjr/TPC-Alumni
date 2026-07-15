<?php

namespace App\Exceptions\Auth;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class InvalidCredentialsException extends \Exception
{
    public function __construct()
    {
        parent::__construct('Invalid credentials');
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $this->getMessage(),
        ], Response::HTTP_UNAUTHORIZED);
    }
}
