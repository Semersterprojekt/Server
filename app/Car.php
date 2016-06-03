<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = ['img_path', 'user_id', 'brand', 'model', 'geoX', 'geoY'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
