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
        $endpoint = $request->query('endpoint');
        if (!$endpoint) {
            return response()->json(['error' => 'Missing endpoint'], 400);
        }

        // Build the full backend API URL
        $apiUrl = "https://api.lengzem.in/api/{$endpoint}";
        $apiKey = '12345qwerty';

        // --- START OF MODIFICATION ---

        // Capture the incoming Authorization header (the user's Bearer token)
        $authorizationHeader = $request->header('Authorization');

        // Common headers for the outgoing request
        $headers = [
            'X-API-KEY' => $apiKey, // Your server-to-server API key
            'Content-Type' => 'application/json',
            'Accept' => 'application/json', // Good practice to include Accept header
        ];

        // If an Authorization header was present on the incoming request, add it to the outgoing headers.
        // This securely forwards the user's token to the backend API.
        if (!empty($authorizationHeader)) {
            $headers['Authorization'] = $authorizationHeader;
        }

        // --- END OF MODIFICATION ---


        $method = strtolower($request->method()); // Use strtolower for case-insensitivity

        // A slightly cleaner way to build the request
        $pendingRequest = Http::withHeaders($headers);

        switch ($method) {
            case 'post':
                $response = $pendingRequest->post($apiUrl, $request->all());
                break;

            case 'put':
                $response = $pendingRequest->put($apiUrl, $request->all());
                break;

            case 'patch':
                $response = $pendingRequest->patch($apiUrl, $request->all());
                break;

            case 'delete':
                $response = $pendingRequest->delete($apiUrl);
                break;

            case 'get':
            default:
                // For GET requests, we pass query parameters, not the request body
                $response = $pendingRequest->get($apiUrl, $request->query());
                break;
        }

        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type') ?? 'application/json');
    }
}
