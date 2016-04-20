<?php

use App\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Rijad Admin
        $user = User::create(
            [
                'username' => 'rijad',
                'email' => 'rijad@gmail.com',
                'password' => bcrypt(12345),
                'role' => 5
            ]);

        // Danilo Admin
        $user = User::create(
            [
                'username' => 'danilo',
                'email' => 'danilo@gmail.com',
                'password' => bcrypt(12345),
                'role' => 5
            ]);
    }
}
