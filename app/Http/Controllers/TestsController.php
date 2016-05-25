<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Test;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class TestsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::check()) {
            $id = Auth::user()->id;
            $user = User::find($id);

            $tests = $user->tests()->get();

            return response()->json([
                'data' => $tests
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Separate the image and save it to disk.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $test = Test::create($request->except('base64'));
        if ($request->base64 != null) {
            $image = Image::make($request->base64);
            $image->resize(1200, 800)->save('img/test/' . $test->id . '.jpg');
            $image->resize(300, 300)->save('img/test_tmbn/' . $test->id . '.jpg');
            $test->img_path = $test->id . '.jpg';
        }
        $test->save();

        return response()->json([
            'message' => $request->all(),
            'status' => 'Saved successfully!'
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show all created Posts
     * Only for admins
     *
     * @return mixed
     */
    public function adminPosts()
    {
        if (Auth::check()) {
            $id = Auth::user()->id;
            $user = User::find($id);

            if ($user->role == 5) {
                return response()->json([
                    'data' => Test::all()
                ], 200);
            }

            return response()->json([
                'error' => 'Not Admin'
            ], 401);
        } else {
            return response()->json([
                'error' => 'Not logged in'
            ], 401);
        }
    }

    /**
     * Show all created users
     * Only for admins
     *
     * @return mixed
     */
    public function adminUsers()
    {
        if (Auth::check()) {
            $id = Auth::user()->id;
            $user = User::find($id);

            if ($user->role == 5) {
                return response()->json([
                    'data' => User::all()
                ], 200);
            }

            return response()->json([
                'error' => 'Not Admin'
            ], 401);
        } else {
            return response()->json([
                'error' => 'Not logged in'
            ], 401);
        }
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
        $posts = $user->tests()->get();


        return response()->json([
            'data' => $posts
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Test::destroy($id);
    }
}
