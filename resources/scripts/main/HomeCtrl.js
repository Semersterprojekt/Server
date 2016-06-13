/**
 * Created by rijad on 01.06.16.
 */
angular.module('app.controllers').controller('HomeCtrl', function ($rootScope,
                                                                   $scope, $http, $timeout, $mdSidenav,
                                                                   $state, $mdDialog, $mdMedia, $interval) {
    /**
     * Executed immediately upon View Loaded
     */
    $scope.$on('$viewContentLoaded', function () {
        $mdSidenav('left').toggle();

        //Flags for showing / hiding html elements
        $scope.noneSelected = true;
        $scope.usersLoaded = false;
        $scope.beingEdited = false;
        $scope.syncOn = true;

        $interval.cancel($rootScope.ToolsPromise);
        $rootScope.ToolsPromise = null;
        $scope.startHomeInterval();

        $http.get('http://localhost:8000/api/v1/admin/users').success(function (response) {
            $scope.users = response.data;
            $scope.usersLoaded = true;
        });

        // Active admin data
        $scope.username = localStorage.getItem('adminUsername');
        $scope.userImage = localStorage.getItem('adminImage');
    });

    var originatorEv;

    /**
     * Open the Menu with aditional functionality
     * @param $mdOpenMenu
     * @param ev
     */
    $scope.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    /**
     * Menu Click Event on Post Delete
     * @param event
     * @param post
     */
    $scope.redial = function (event, post) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this?')
            .textContent('This will remove it completely from the database.')
            .ariaLabel('Deletition')
            .parent('body')
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'It is deleted.';
            $http.delete('http://localhost:8000/api/v1/cars/' + post).success(function (response) {
                $scope.loadPosts($scope.selectedUser);
            });
        });
        originatorEv = null;
    };

    /**
     * Menu Click Event on User Delete
     * @param event
     * @param user
     */
    $scope.redialUser = function (event, user) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete user -> ' + user.username + '?')
            .textContent('This will remove the User and all his posts from the database.')
            .ariaLabel('Deletition')
            .parent('body')
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'It is deleted.';
            $http.delete('http://localhost:8000/api/v1/admin/deleteuser/' + user.id).success(function (response) {
                $http.get('http://localhost:8000/api/v1/admin/users').success(function (response) {
                    $scope.users = response.data;
                    $scope.selectedUser = undefined;
                });
            });
        });
        originatorEv = null;
    };

    /**
     * Menu Click Event on User Edit
     * @param event
     * @param user
     */
    $scope.redialEditUser = function (event, user) {
        $scope.editedUser = user;
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/useredit.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            locals: {
                items: $scope.editedUser
            }
        })
            .then(function () {
                $scope.status = 'You said the information was.';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    /**
     * Closes the Sidenav
     */
    $scope.close = function () {
        $mdSidenav('left').toggle();
    };

    /**
     * Load Posts from the selected user in the user list
     * @param user
     */
    $scope.loadPosts = function (user) {
        $scope.noneSelected = false;
        $scope.selectedUser = user;
        $http.get('http://localhost:8000/api/v1/admin/userposts/' + user.id).success(function (response) {
            $scope.selectedPosts = response.data;
        });
    };

    /**
     * Start of the Users and Posts update interval (with return of HomePromise)
     */
    $scope.startHomeInterval = function () {
        $rootScope.HomePromise = $interval(function () {
            $http.get('http://localhost:8000/api/v1/admin/users').success(function (response) {
                //var parsed = JSON.parse(response);
                $scope.users = response.data;
            });

            if ($scope.selectedUser != undefined)
                $http.get('http://localhost:8000/api/v1/admin/userposts/' + $scope.selectedUser.id).success(function (response) {
                    $scope.selectedPosts = response.data;
                });
        }, 5000);
    };

    /**
     * Toggles the $interval with the promise HomePromise
     */
    $scope.toggleSync = function () {
        if($rootScope.HomePromise != null) {
            $interval.cancel($rootScope.HomePromise);
            $rootScope.HomePromise = null;
            $scope.syncOn = false;
        }
        else {
            $scope.startHomeInterval();
            $scope.syncOn = true;
        }
    };

    /**
     * Private Controller for the Dialog on User edit function
     *
     * @param $rootScope
     * @param $scope
     * @param $mdDialog
     * @param items
     * @constructor
     */
    function DialogController($rootScope, $scope, $mdDialog, items) {
        $scope.loading = false;
        $scope.items = items;

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        /**
         * Updates the Inputted user data via PUT request
         * @param user
         */
        $scope.updateUser = function (user) {
            $scope.loading = true;
            $rootScope.beingEdited = true;

            var url = 'http://localhost:8000/api/v1/admin/updateuser/' + user.id;
            var headers = {headers: {'Content-Type': 'application/json'}};
            var data = {
                username: user.username,
                email: user.email,
                base64: user.img_path
            };

            $http.put(url, data, headers).success(function (response) {
                $scope.loading = false;
                $mdDialog.hide();
            });
        }
    }
});
