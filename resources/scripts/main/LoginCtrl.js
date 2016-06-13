/**
 * Created by rijad on 01.06.16.
 */
angular.module('app.controllers').controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $auth, $mdToast) {
    $scope.pictureUrl = "img/icon_without_radius.jpg";

    $scope.logIn = function () {
        var email = $scope.email;
        var password = $scope.password;
        var credentials = {
            email: email,
            password: password
        };

        /**
         * Login process with an error message if user is not admin 
         */
        $auth.login(credentials).then(function (resp) {
            $http.get('http://localhost:8000/api/v1/authenticate/user').success(function (response) {
                var user = JSON.stringify(response.user);
                var userObject = response.user;
                localStorage.setItem('user', user);
                localStorage.setItem('adminUsername', userObject.username);
                localStorage.setItem('adminImage', userObject.img_path);
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
    }
});