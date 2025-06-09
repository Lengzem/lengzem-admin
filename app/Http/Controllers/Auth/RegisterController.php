<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /**
     * Show the registration page.
     */
    public function showRegister(): Response
    {
        return Inertia::render('auth/Register'); // Adjust path if needed
    }
    public function showEdit(): Response
    {
        return Inertia::render('auth/EditUser'); // Adjust path if needed
    }
}
