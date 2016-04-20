var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.jsOutput = 'public/js';
elixir.config.cssOutput = 'public/css';

elixir(function (mix) {
//    mix.sass('app.scss');
    mix.scripts([
        './resources/scripts/bower_components/angular/angular.js',
        './resources/scripts/bower_components/angular-animate/angular-animate.js',
        './resources/scripts/bower_components/angular-aria/angular-aria.js',
        './resources/scripts/bower_components/angular-material/angular-material.js',
        //'./resources/scripts/bower_components/angular-route/angular-route.js',
        './resources/scripts/bower_components/angular-ui-router/release/angular-ui-router.js',
        './resources/scripts/bower_components/angular-ui/build/angular-ui.js',
        './resources/scripts/bower_components/satellizer/satellizer.js',
        './resources/scripts/bower_components/angular-permission/dist/angular-permission.js',
        './resources/scripts/app.js',
        './resources/scripts/controllers.js',
        './resources/scripts/jquery-1.11.3.min.js',
        './resources/scripts/jquery-ui.min.js',
        './resources/scripts/highcharts.js',
        './resources/scripts/highcharts-more.js',
    ]);

    mix.styles([
        './resources/scripts/bower_components/angular-material/angular-material.min.css',
        './resources/scripts/bower_components/angular-material/angular-material.layouts.min.css',
        //'./resources/assets/sass/style.css',
    ]);

    mix.sass('app.scss');

    mix.copy('./resources/views/templates/*.html', 'public/views/');
    // Application Scripts
    /* mix.scripts([
     '../../../resources/scripts/app.js'
     ], 'public/js/app.js');*/
});
