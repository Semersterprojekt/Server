angular.module('app', ['app.controllers', 'ngMaterial', 'ngRoute', 'ui.router'])

    .config(['$routeProvider', '$stateProvider',
        function ($routeProvider) {
            $routeProvider.when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);