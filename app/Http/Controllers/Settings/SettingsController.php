<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
     /**
     * Show the Contact Us page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('ContactUsCom');
    }

    public function editPro()
    {
        return Inertia::render('EditUserCom');
    }
}
