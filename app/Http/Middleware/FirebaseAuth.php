<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Kreait\Firebase\Factory;
use Firebase\Auth\Token\Exception\InvalidToken;
use Firebase\Auth\Token\Exception\IssuedInTheFuture;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Firebase\Auth\Token\Exception\ExpiredToken;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('🔥 FirebaseAuth middleware triggered.');


        // Get Firebase ID token from the Authorization header
        $idToken = $request->bearerToken();

        if (!$idToken) {
            Log::info('⚠️ No Firebase ID token found. Continuing as guest.');
            return $next($request); // Allow guests through
        }

        try {
            $auth = (new Factory)
                ->withServiceAccount(config('services.firebase.credentials_file'))
                ->createAuth();

            // Verify Firebase ID token
            $verifiedIdToken = $auth->verifyIdToken($idToken);
            $uid = $verifiedIdToken->claims()->get('sub');

            if (!$uid) {
                Log::warning('🚫 Token verified but UID not found. Skipping login.');
                return $next($request); // Proceed without user login
            }

            // Check if the user exists in the database
            $user = User::where('firebase_uid', $uid)->first();

            if ($user) {
                // Log the user in
                Auth::login($user);
                $request->merge(['firebase_user' => $user]);

                Log::info("✅ Firebase user {$user->email} logged in via UID: {$uid}");
            } else {
                Log::info("🔍 No user found for Firebase UID: {$uid}. Skipping login.");
            }

        } catch (InvalidToken $e) {
            Log::warning('❗ Invalid Firebase token: ' . $e->getMessage());
        } catch (IssuedInTheFuture $e) {
            Log::warning('❗ Firebase token issued in the future: ' . $e->getMessage());
        } catch (ExpiredToken $e) {
            Log::warning('❗ Firebase token has expired: ' . $e->getMessage());
        } catch (\Throwable $e) {
            Log::error('🔥 Firebase auth unexpected error: ' . $e->getMessage());
        }

        return $next($request);
    }
}