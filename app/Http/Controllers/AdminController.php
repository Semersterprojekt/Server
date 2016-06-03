<?php

namespace App\Http\Controllers;

use App\Car;
use App\Http\Requests;
use App\User;
use Auth;

class AdminController extends Controller
{
    /**
     * Show all created Posts
     * Only for admins
     *
     * @return mixed
     */
    public function adminPosts()
    {
        return response()->json([
            'data' => Car::orderBy('created_at', 'desc')->get()
        ], 200);
    }

    /**
     * Show all created users
     * Only for admins
     *
     * @return mixed
     */
    public function adminUsers()
    {
        return response()->json([
            'data' => User::all()
        ], 200);

    }


    public function adminPostBelongs($id)
    {
        return response()->json([
            'user' => Car::find($id)->user()->get()
        ], 200);
    }


    /**
     * Gets all the Posts posted by the user with $id
     *
     * @param $id user id
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminUserPosts($id)
    {
        $user = User::find($id);
        $posts = $user->cars()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $posts
        ], 200);
    }

}
