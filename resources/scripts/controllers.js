/**
 * Created by rijad on 23.03.16.
 */
var app = angular.module('app.controllers', ['ngMaterial', 'ui.router']);

app.controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $auth, $mdToast) {
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

        $auth.login(credentials).then(function (resp) {
            $http.get('http://193.5.58.95/api/v1/authenticate/user').success(function (response) {
                    var user = JSON.stringify(response.user);
                    localStorage.setItem('user', user);
                    $rootScope.currentUser = response.user;
                    $state.go('home');
                })
                .error(function () {
                    console.log('fehler');
                    $scope.loginError = true;
                    $scope.loginErrorText = error.data.error;
                    console.log($scope.loginErrorText);
                })
        }).catch(function (response) {
                // Handle errors here, such as displaying a notification
                // for invalid email and/or password.
                $mdToast.show({
                    hideDelay: 3000,
                    position: 'top left right',
                    templateUrl: 'views/login-fail-toast.html'
                });
            }
        );

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
})
;

app.controller('HomeCtrl', function ($rootScope, $scope, $http, $timeout, $mdSidenav) {
    $scope.$on('$viewContentLoaded', function () {
        $mdSidenav('left').toggle();

        $http.get('http://193.5.58.95/api/v1/admin/users').success(function (response) {
            //var parsed = JSON.parse(response);
            $scope.users = response.data;
        });
    });

    $scope.close = function () {
        $mdSidenav('left').toggle();

        for (var prop in $scope.users) {
            if (!$scope.users.hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue;
            }
            console.log(prop.username);
        }
    };

    $scope.radius = Math.floor(Math.random() * 100);

    /**
     * Line Chart function
     */
    $(function () {
        $('#line-container').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Angemeldete User '
            },
            xAxis: {
                categories: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni']
            },
            yAxis: {
                title: {
                    text: 'User Anzahl'
                }
            },
            series: [{
                name: 'User',
                data: [1, 0, 4, 2, 1, 0, 1, 2, 5, 3]
            }],
        });
    });
});


