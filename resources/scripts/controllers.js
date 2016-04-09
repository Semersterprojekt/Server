/**
 * Created by rijad on 23.03.16.
 */
var app = angular.module('app.controllers', ['ngMaterial', 'ui.router']);

app.controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $auth) {
//    var loginUrl = 'http://193.5.58.95/api/v1/authenticate';
    $scope.pictureUrl = "img/icon_without_radius.jpg";

    $scope.logIn = function () {
        var email = $scope.email;
        var password = $scope.password;
        //var headers = {headers: {'Content-Type': 'application/json'}};
        var credentials = {
            email: email,
            password: password
        };

        $auth.login(credentials).then(function () {
            $http.get('http://193.5.58.95/api/v1/authenticate/user').success(function (response) {
                    var user = JSON.stringify(response.user);
                    localStorage.setItem('user', user);
                    $rootScope.currentUser = response.user;
                    $state.go('home');
                })
                .error(function () {
                    $scope.loginError = true;
                    $scope.loginErrorText = error.data.error;
                    console.log($scope.loginErrorText);
                })
        });
        /*$http.post(loginUrl, credentials, headers).then(function (resp) {
         $rootScope.token = resp.data.token;
         console.log("das ist der Token  " + $rootScope.token);
         if (resp.status == 200) {
         $state.go("home");
         }
         }, function (fail) {
         console.log(fail);
         });*/
    }
});

app.controller('HomeCtrl', function ($rootScope, $scope, $http, $timeout, $mdSidenav) {
    $scope.$on('$viewContentLoaded', function () {
        $mdSidenav('left').toggle();
    });

    $scope.close = function () {
        $mdSidenav('left').toggle();
    };

    $scope.radius = Math.floor(Math.random() * 100);
});