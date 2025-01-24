<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
  Route::post('login', 'login')->name('login');

  Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', 'logout');
    Route::get('auth-user', 'authUser');
  });
});

Route::prefix('companies')->controller(CompanyController::class)->group(function () {
  Route::middleware('auth:sanctum')->group(function () {
    Route::get('/current-time', 'getCurrentTimeUTC');
    Route::get('/max-id', 'getMaxCompanyId');
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('{company}', 'show');
    Route::post('{company}', 'update');
    Route::post('{company}/status', 'changeStatus');
    Route::delete('{company}', 'destroy');
  });
});

Route::controller(UserController::class)->group(function () {
  Route::post('register', 'store')->name('register');
});