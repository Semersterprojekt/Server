<?php

namespace App\Http\Controllers;

use App\Car;
use App\Http\Requests;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class CarsController extends Controller
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

            $cars = $user->cars()->get();

            return response()->json([
                'data' => $cars
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
        $car = Car::create($request->except('base64'));
        if ($request->base64 != null) {
            $image = Image::make($request->base64);
            $image->resize(1200, 800)->save('img/cars/' . $car->id . '.jpg');
            $image->resize(300, 300)->save('img/cars_tmbn/' . $car->id . '.jpg');
            $car->img_path = $car->id . '.jpg';
        }
        $car->save();

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
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Car::destroy($id);
    }
}
