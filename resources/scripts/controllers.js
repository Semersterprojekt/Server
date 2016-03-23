/**
 * Created by rijad on 23.03.16.
 */
var app = angular.module('app.controllers', ['ngMaterial', 'ui.router']);

app.controller('LoginCtrl', function ($rootScope, $scope, $http) {
    var token;
    var loginUrl = 'http://193.5.58.95/api/v1/authenticate';
    $scope.pictureUrl = "img/icon_without_radius.jpg";
    console.log("bin im login Controller");

    $scope.logIn = function () {
        var username = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var headers = {headers: {'Content-Type': 'application/json'}};
        var data = {
            username: username,
            email: username,
            password: password
        };

        $http.post(loginUrl, data, headers).then(function (resp) {
            console.log(resp);
            //    console.log(resp.statusText + "status");
            //    console.log("Sry bro. falsche anmeldedaten");
            $rootScope.token = resp.data.token;
            console.log("das ist der Token  " + $rootScope.token);
            if (resp.status == 200) {
                //$state.go("tab.upload");
            }

        }, function (fail) {
            console.log(fail);
        });

    }


});