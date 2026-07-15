<?php

namespace App\Exceptions\Auth;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AccountInactiveException extends \Exception
{
    public function __construct()
    {
        parent::__construct('Your account is inactive. Please contact admin.');
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $this->getMessage(),
        ], Response::HTTP_FORBIDDEN);
    }
}
