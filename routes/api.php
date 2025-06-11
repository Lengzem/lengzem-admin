<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\ApiProxyController;

Route::get('/firebase-user', function () {
        return response()->json([
            'user' => auth()->user()
        ]);
    });

Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
Route::post('forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.reset');

Route::post('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.post');
Route::get('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.get');
Route::put('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.put');
Route::delete('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.delete');

Route::get('/ProEdit', [RegisterController::class, 'showEdit'])->name('ProEdit');
Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
