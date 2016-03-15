<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
        protected $table = 'tests';

        protected $fillable = ['img_path', 'data', 'comment'];




}
