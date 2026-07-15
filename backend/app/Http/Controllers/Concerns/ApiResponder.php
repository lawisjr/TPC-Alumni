<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

trait ApiResponder
{
    protected function success(string $message, $data = null, int $code = 200): JsonResponse
    {
        return response()->json(['status' => true, 'message' => $message, 'data' => $data ?? (object) []], $code);
    }

    protected function error(string $message, int $code = 500, $data = null): JsonResponse
    {
        return response()->json(['status' => false, 'message' => $message, 'data' => $data ?? (object) []], $code);
    }

    protected function successResponse($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        // If it's a paginated resource collection, preserve meta and links
        if ($data instanceof ResourceCollection && method_exists($data->resource, 'currentPage')) {
            $paginated = $data->response()->getData(true);
            return response()->json([
                'status'  => true,
                'message' => $message,
                'data'    => $paginated['data'],
                'meta'    => $paginated['meta'],
                'links'   => $paginated['links'],
            ], $code);
        }

        return response()->json(['status' => true, 'message' => $message, 'data' => $data ?? (object) []], $code);
    }

    protected function errorResponse(string $message, int $code = 500, $data = null): JsonResponse
    {
        return response()->json(['status' => false, 'message' => $message, 'data' => $data ?? (object) []], $code);
    }
}