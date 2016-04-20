var app = angular.module('app',
    [
        'app.controllers',
        'ngMaterial',
        'ui.router',
        'satellizer',
        'permission'
    ]);

app.run(function (PermissionStore, $auth) {
    PermissionStore
        .definePermission('admin', function (stateParams) {
            return $auth.isAuthenticated();
        });

    PermissionStore.definePermission('anon', function (stateParams) {
        return !$auth.isAuthenticated();
    });

});

app.config(['$stateProvider', '$urlRouterProvider', '$authProvider',
    function ($stateProvider, $urlRouterProvider, $authProvider) {
        //$authProvider.loginUrl = 'http://193.5.58.95/api/v1/authenticate/admin';
        //$authProvider.loginUrl = 'http://localhost/api/v1/authenticate/admin';
        $authProvider.loginUrl = 'http://193.5.58.95/api/v1/authenticate/admin';
        $stateProvider
            .state('log', {
                url: '/login',
                data: {
                    permissions: {
                        except: ['admin'],
                        redirectTo: 'home'
                    }
                },
                /*
                 views: {
                 'loginContent': {
                 templateUrl: 'views/login.html',
                 controller: 'LoginCtrl'
                 }
                 }
                 */
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('home', {
                url: '/home',
                data: {
                    permissions: {
                        except: ['anon'],
                        redirectTo: 'log'
                    }
                },
                /*
                 views: {
                 'homeContent': {

                 }
                 }*/
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            });

        $urlRouterProvider.otherwise('/login');
    }]);


app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('red');
});