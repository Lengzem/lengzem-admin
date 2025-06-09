<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\SettingsController;

 Route::get('contact', [SettingsController::class, 'index'])->name('contact');
 Route::get('/profile', [ProfileController::class, 'profile'])->name('profile.edit');
 Route::get('/user', [SettingsController::class, 'editPro'])->name('editPro');



