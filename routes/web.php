<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('article', function () {
    return Inertia::render('Article');
})->middleware(['auth', 'verified'])->name('article');

Route::get('user', function () {
    return Inertia::render('User');
})->middleware(['auth', 'verified'])->name('user');

Route::get('category', function () {
    return Inertia::render('Category');
})->middleware(['auth', 'verified'])->name('category');

Route::get('tag', function () {
    return Inertia::render('Tag');
})->middleware(['auth', 'verified'])->name('tag');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
