<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\User;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator;

class AuthenticateController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['authenticateAdmin', 'register', 'authenticate']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return "Auth index";
    }

    public function register(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, User::$rules);

        if ($validator->fails()) {
            return response()->json([$validator->errors()], 400);
        } else {
            $user = User::create();
            $user->username = $request->username;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);

            $image = Image::make($request->base64);
            $image->resize(1200, 800)->save('img/users/' . $user->id . '.jpg');
            $image->resize(300, 300)->save('img/users_tmbn/' . $user->id . '.jpg');

            $user->img_path = $user->id . ".jpg";
            $user->save();

            $credentials = $request->only('email', 'password');

            try {
                // verify the credentials and create a token for the user
                if (!$token = JWTAuth::attempt($credentials)) {
                    return response()->json(['error' => 'invalid_credentials'], 401);
                }
            } catch (JWTException $e) {
                // something went wrong
                return response()->json(['error' => 'could_not_create_token'], 500);
            }

            return response()->json(compact('token'));
        }
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');
        try {
            // verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    public function authenticateAdmin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $user = User::where('email', '=', $request->email)->first();
        if ($user->role == 5) {
            // if no errors are encountered we can return a JWT
            return response()->json(compact('token'));
        } else {
            return response()->json([
                'You shall not pass' => 'Nod Admin',
            ], 401);
        }
    }

    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    public function destroy($id)
    {
        if (Auth::check()) {
            $id = Auth::user()->id;
            $user = User::find($id);

            if ($user->role == 5) {
                $user = User::find($id);
                $user->delete();

                return response()->json([
                    'message' => 'User' . $user->username
                ], 200);
            }
        }

        return response()->json([
            'error' => 'Not Admin'
        ], 403);
    }
}
