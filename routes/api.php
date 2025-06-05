<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiProxyController;


Route::post('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.post');
Route::get('/proxy', [ApiProxyController::class, 'proxyRequest'])->name('proxy.get');