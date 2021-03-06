<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

// We will probably use this later.
Route::group(['middleware' => ['web']], function () {
    //
});


Route::group(['middleware' => 'cors', 'prefix' => 'api/v1'], function () {
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::post('authenticate/register', 'AuthenticateController@register');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');

    Route::resource('cars', 'CarsController');

    Route::post('authenticate/admin', 'AuthenticateController@authenticateAdmin');

    Route::group(['middleware' => ['jwt.auth', 'admin', 'cors']], function () {
        Route::get('admin/posts', 'AdminController@adminPosts');
        Route::get('admin/users', 'AdminController@adminUsers');
        Route::get('admin/userposts/{id}', 'AdminController@adminUserPosts');
        Route::get('admin/postbelongs/{id}', 'AdminController@adminPostBelongs');
        Route::put('admin/updateuser/{id}', 'AuthenticateController@updateUser');
        Route::delete('admin/deleteuser/{id}', 'AuthenticateController@destroy');
    });
});


/*Route::group(['middleware' => ['cors', 'jwt.auth']], function () {
    /*Route::get('img/test/{id}', function() {

    });
});*/
