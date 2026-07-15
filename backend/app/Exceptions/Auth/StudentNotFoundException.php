<?php

namespace App\Exceptions\Auth;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class StudentNotFoundException extends \Exception
{
    public function __construct()
    {
        parent::__construct('Student account not found. Please register first.');
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $this->getMessage(),
        ], Response::HTTP_NOT_FOUND);
    }
}
