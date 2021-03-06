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
        $authProvider.loginUrl = 'http://localhost:8000/api/v1/authenticate/admin';
        $stateProvider
            .state('log', {
                url: '/login',
                data: {
                    permissions: {
                        except: ['admin'],
                        redirectTo: 'home'
                    }
                },
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
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            }).state('tools', {
            url: '/tools',
            data: {
                permissions: {
                    except: ['anon'],
                    redirectTo: 'log'
                }
            },
            templateUrl: 'views/tools.html',
            controller: 'ToolsCtrl'
        }).state('logout', {
            url: '/login',
            data: {
                permissions: {
                    except: ['anon'],
                    redirectTo: 'log'
                }
            },
            templateUrl: 'views/login.html',
            controller: 'LogoutCtrl'
        });

        $urlRouterProvider.otherwise('/login');
    }]);


app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('red');
});