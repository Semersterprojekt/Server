<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'username'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'role'
    ];


    public static $rules = [
        'username' => 'required|unique:users',
        'email' => 'required|unique:users|email',
        'password' => 'required|min:5',
    ];

    public function cars()
    {
        return $this->hasMany('App\Car');
    }

    public function tests()
    {
        return $this->hasMany('App\Test');
    }

}
