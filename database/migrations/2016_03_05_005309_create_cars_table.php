<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars', function(Blueprint $table){
            $table->increments('id');
            $table->text('img_path');
            $table->text('title');
            $table->float('geoX', 10, 6);
            $table->float('geoY', 10, 6);
            $table->timestamp('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('cars');
    }
}
