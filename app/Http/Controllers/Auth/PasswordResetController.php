<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;

class PasswordResetController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/ForgotPassword');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

     protected Auth $auth;

    public function __construct()
    {
        $this->auth = (new Factory)
            ->withServiceAccount(config('services.firebase.credentials_file'))
            ->createAuth();
    }

    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid email address.'], 422);
        }

        try {
            $link = $this->auth->getPasswordResetLink($request->email);
            // You can optionally email this yourself, or just return it for testing
            return response()->json(['message' => 'Reset email sent successfully.', 'link' => $link]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Unable to send reset link.'], 500);
        }
    }
}
