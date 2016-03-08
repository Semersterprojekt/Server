<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Cars;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;

class CarsController extends Controller
{

    //TODO Rethink how the Cars are structured with the image data etc.
    public function index()
    {
        $cars = Car::all();
        return response()->json([
            'data' => $this->transformCollection($cars)
        ]);
    }


    public function transformCollection($cars)
    {
        return array_map([$this, 'transform'], $cars->toArray());
    }


    //TODO Figure out how to serve Images vie API's
    public function transform($car)
    {
        return [
            'car_id' => $car['id'],
            'car_img' => $car['img_path']
        ];
    }
}
