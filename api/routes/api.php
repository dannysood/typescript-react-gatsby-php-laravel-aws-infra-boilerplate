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
Route::post('/', function (Request $request) {
    return "Successful Response With No Middleware";
});

Route::middleware('auth:sanctum')->group(
    function() {
        Route::get('/user/profile', function (Request $request) {
            return $request->user();
        });
        Route::post('/tokens/create', function (Request $request) {
            if($request->json()->all()["token_type"] == "checkout"){
                $token = $request->user()->createToken("checkout", [['payments:create']]);
            } else {
                $token = $request->user()->createToken("transaction", [['payments:read']]);
            }


            return ['token' => $token->plainTextToken];
        });
        Route::get('/tokens', function (Request $request) {

            $tokens = $request->user()->tokens()->get();

            return ['active_tokens' => $tokens];
        });
    }
);
