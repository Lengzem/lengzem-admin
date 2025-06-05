<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiProxyController extends Controller
{
    public function proxyRequest(Request $request)
{
    if ($request->getMethod() == 'OPTIONS') {
        return response()->json([], 200);
    }

    // API URL and API Key
    $endpoint = $request->query('endpoint'); // e.g., movies, get-subscription, etc.
    if (!$endpoint) {
        return response()->json(['error' => 'Missing endpoint'], 400);
    }

    // Build the full backend API URL
    $apiUrl = "http://192.168.1.37:8000/api/{$endpoint}";
    $apiKey = '12345qwerty';

    // Common headers
    $headers = [
        'X-API-KEY' => $apiKey,
        'Content-Type' => 'application/json',
    ];

    $method = $request->method();

    switch ($method) {
        case 'POST':
            $response = Http::withHeaders($headers)->post($apiUrl, $request->all());
            break;

        case 'PUT':
            $response = Http::withHeaders($headers)->put($apiUrl, $request->all());
            break;

        case 'PATCH':
            $response = Http::withHeaders($headers)->patch($apiUrl, $request->all());
            break;

        case 'DELETE':
            $response = Http::withHeaders($headers)->delete($apiUrl);
            break;

        case 'GET':
        default:
            $response = Http::withHeaders($headers)->get($apiUrl, $request->query());
            break;
    }

    return response()->json($response->json(), $response->status());
}
}