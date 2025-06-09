<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * Show the login page.
     */
    public function showLogin(): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
        ]); // Adjust path if needed
    }
}
