<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\FirebaseAuth;
use Cashfree\Cashfree;
use App\Http\Controllers\Movie\PlayerController;
use Illuminate\Http\Request;

Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::get('dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
Route::get('user', fn () => Inertia::render('User'))->name('user');
Route::get('category', fn () => Inertia::render('Category'))->name('category');
Route::get('tag', fn () => Inertia::render('Tag'))->name('tag');
Route::get('author', fn () => Inertia::render('Authors'))->name('author');
Route::get('article', fn () => Inertia::render('Article'))->name('article');
Route::get('article/add', fn () => Inertia::render('AddArticle'))->name('articalAdd');