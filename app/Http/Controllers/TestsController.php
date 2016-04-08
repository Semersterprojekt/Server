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
        //$tests = Test::all();

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $image = Image::make($request->base64);
        $test = Test::create($request->except('base64'));

        $image->resize(1200, 800)->save('img/test/' . $test->id . '.jpg');
        $image->resize(300, 300)->save('img/test_tmbn/' . $test->id . '.jpg');

        $test->img_path = $test->id . '.jpg';
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
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }


    //Für Semesterprojekt nur
    public function adminPosts()
    {
        if (Auth::check()) {
            return Test::all();
        }
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
