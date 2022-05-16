<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(
    function () {
        Route::get('/user/profile', function (Request $request) {
            return $request->user();
        });
        Route::post('/tokens', function (Request $request) {
            if ($request->json()->all()['token_type'] == 'checkout') {
                $token = $request->user()->createToken('checkout', ['payments-create']);
            } else {
                $token = $request->user()->createToken('transaction', ['payments-read']);
            }


            return ['token' => $token->plainTextToken];
        });
        Route::get('/tokens', function (Request $request) {

            $tokens = $request->user()->tokens()->get();

            return ['active_tokens' => $tokens];
        });

        Route::delete('/token/{id}', function (Request $request, $id) {

            $request->user()->tokens()->where('id', $id)->delete();

            return [];
        })->whereNumber('id');
    }
);
Route::middleware(['auth:sanctum','ability:payments-create'])->group(
    function () {
        Route::post('/checkout', function (Request $request) {
            return ['url' => 'http://localhost/checkout'];
        });
    }
);
Route::middleware(['auth:sanctum','ability:payments-read'])->group(
    function () {
        Route::get('/transactions', function (Request $request) {
            return ['transactions' => []];
        });
    }
);
