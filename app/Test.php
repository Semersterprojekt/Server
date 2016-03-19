<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    protected $table = 'tests';

    protected $fillable = ['img_path', 'user_id', 'data', 'comment'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
