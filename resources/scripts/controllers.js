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
        var credentials = {
            email: email,
            password: password
        };

        $auth.login(credentials).then(function (resp) {
            $http.get('http://193.5.58.95/api/v1/authenticate/user').success(function (response) {
                var user = JSON.stringify(response.user);
                var userObject = response.user;
                localStorage.setItem('user', user);
                localStorage.setItem('adminUsername', userObject.username);
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

app.controller('HomeCtrl', function ($rootScope, $scope, $http, $timeout, $mdSidenav, $state, $mdDialog) {
    $scope.$on('$viewContentLoaded', function () {
        $mdSidenav('left').toggle();

        $http.get('http://193.5.58.95/api/v1/admin/users').success(function (response) {
            //var parsed = JSON.parse(response);
            $scope.users = response.data;
        });
        $scope.username = localStorage.getItem('adminUsername');
    });

    var originatorEv;
    $scope.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.redial = function (event, post) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the post?')
            .textContent('This will remove the post from the online database.')
            .ariaLabel('Deletition')
            .parent('body')
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $scope.status = 'You have deleted the Post.';
            console.log(post);
        });


        originatorEv = null;

        /*$mdDialog.show(
         $mdDialog.alert()
         .targetEvent(originatorEv)
         .clickOutsideToClose(true)
         .parent('body')
         .title('Suddenly, a redial')
         .textContent('You just called a friend; who told you the most amazing story. Have a cookie!')
         .ok('That was easy')
         );*/
    };


    $scope.close = function () {
        $mdSidenav('left').toggle();

        /*for (var prop in $scope.users) {
         if (!$scope.users.hasOwnProperty(prop)) {
         //The current property is not a direct property of p
         continue;
         }
         }*/
    };

    $scope.radius = Math.floor(Math.random() * 100);
    $scope.selected = null;

    $scope.loadPosts = function (user) {
        $http.get('http://193.5.58.95/api/v1/admin/userposts/' + user.id).success(function (response) {
            $scope.selectedPosts = response.data;
        });

        console.log('selected: ' + user.username);
    };
});


app.controller('ToolsCtrl', function ($scope, $http, $timeout, $mdSidenav, $state, $interval) {
    $http.get('http://193.5.58.95/api/v1/admin/users').success(function (response) {
        $scope.users = response.data;

        $scope.groupedUsers = _.groupBy($scope.users, function (item) {
            return item.created_at;
        });

        console.log($scope.users);
        console.log($scope.groupedUsers);

        $scope.userDates = [];
        $scope.userUsernames = [];
        $scope.userCount = [];

        for (var key in $scope.groupedUsers) {
            $scope.userDates.push(key);
            //console.log(key);
            //console.log($scope.groupedUsers[key]);
            var innerObject = $scope.groupedUsers[key];
            $scope.userCount.push(innerObject.length);
            for (var inner in innerObject) {
                //console.log(innerObject[inner]);
                $scope.userUsernames.push(innerObject[inner].username);
            }
        }

        //$scope.userCount.pop();
        $scope.map = null;

        /**
         * Google Maps function
         */
        function initMap() {
            var mapDiv = document.getElementById('map');
            $scope.map = new google.maps.Map(mapDiv, {
                center: {lat: 46.8095958, lng: 7.1032696},
                zoom: 8
            });
        }

        initMap();

        /**
         * Line Chart function
         */
        $('#line-container').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Registrierte User'
            },
            xAxis: {
                categories: $scope.userDates
            },
            yAxis: {
                title: {
                    text: 'User Anzahl'
                }
            },
            series: [{
                name: 'User registriert',
                dataLabel: $scope.userUsernames,
                data: $scope.userCount
            }]
        });

        console.log($scope.userCount);
        console.log($scope.userUsernames);
    });

    $scope.$on('$viewContentLoaded', function () {

        $interval(function () {
            $http.get('http://193.5.58.95/api/v1/admin/posts').success(function (response) {
                $scope.allPosts = response.data;

                console.log('Interval done');
                // set multiple marker
                for (var i = 0; i < $scope.allPosts.length; i++) {
                    // init markers
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.allPosts[i].geoX, $scope.allPosts[i].geoY),
                        map: $scope.map,
                        title: 'Post' + i,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    });

                    // process multiple info windows
                    (function (marker, i) {
                        // add click event

                        function toggleBounce(mark) {
                            if (mark.getAnimation() !== null) {
                                mark.setAnimation(null);
                            } else {
                                mark.setAnimation(google.maps.Animation.BOUNCE);
                            }
                        }

                        var contentString = '<md-card class="post-card" ng-repeat="post in selectedPosts">' +
                            '<div class="cell">' +
                            '<img src="http://193.5.58.95/img/test/' + $scope.allPosts[i].img_path + '">' +
                            '</div>' +
                            '<md-content layout="row">' +
                            '<md-content layout="column" layout-align="center center" flex>' +
                            '<h4>' + $scope.allPosts[i].brand + '  ' + $scope.allPosts[i].model + '</h4>' +
                            '</md-content>' +
                            '</md-content>' +
                            '</md-card>';

                        google.maps.event.addListener(marker, 'click', function () {
                            $scope.map.panTo(marker.getPosition());
                            infowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            infowindow.open($scope.map, marker);
                            toggleBounce(marker);
                        });
                    })(marker, i);
                }
            });
        }, 2000);
    });

    $scope.close = function () {
        $mdSidenav('left').toggle();
    };

});

app.controller('LogoutCtrl', function ($scope, $state) {
    $scope.$on('$viewContentLoaded', function () {
        localStorage.clear();
    });
});


