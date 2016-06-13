/**
 * Created by rijad on 01.06.16.
 */
angular.module('app.controllers').controller('ToolsCtrl', function ($rootScope, $scope, $http, $timeout, $mdSidenav, $state, $interval) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.dataLoaded = false;
        $scope.postsLoaded = false;
        $scope.brandSelected = false;
        $scope.detailsLoaded = false;
        $scope.username = localStorage.getItem('adminUsername');
        $scope.markers = [];

        //Stop the HomeCtrl interval
        $interval.cancel($rootScope.HomePromise);
        $scope.startToolsInterval();
        $scope.initPie();
    });

    /**
     * Start the ToolsCtrl $interval and store the promise to ToolsPromise
     */
    $scope.startToolsInterval = function () {
        $rootScope.ToolsPromise = $interval(function () {
            $scope.setMarkers();
        }, 4000);
    };

    /**
     * Get all user data for line graph
     */
    function lineGraphInit() {
        $http.get('http://localhost:8000/api/v1/admin/users').success(function (response) {
            $scope.users = response.data;
            $scope.map = null;

            /**
             * Google Maps function
             */
            $scope.initMap = function () {
                var mapDiv = document.getElementById('map');
                $scope.map = new google.maps.Map(mapDiv, {
                    center: {lat: 47.3775499, lng: 8.4666756},
                    zoom: 8
                });

                //Global variable for infowindow toggle
                $scope.infowindow = null;
            };

            $scope.initMap();

            //Take the user data, group it by creation date and form it for the line graph
            for (var key in $scope.users) {
                if ($scope.users.hasOwnProperty(key)) {
                    $scope.users[key].created_at = formatDate($scope.users[key].created_at);
                }
            }

            for (var key in $scope.allPosts) {
                if ($scope.allPosts.hasOwnProperty(key)) {
                    $scope.allPosts[key].created_at = formatDate($scope.allPosts[key].created_at);
                }
            }

            $scope.groupedUsersDate = _.groupBy($scope.users, function (item) {
                return item.created_at;
            });

            //Inverse the Array because of the last date
            var posts = $scope.allPosts;
            posts.reverse();

            $scope.groupedPostsDate = _.groupBy(posts, function (item) {
                return item.created_at;
            });

            Object.keys($scope.groupedPostsDate).reverse();

            $scope.userDates = [];
            $scope.userData = [];
            $scope.userUsernames = [];
            $scope.userCount = [];
            $scope.userTotal = $scope.users.length;

            $scope.postsData = [];
            $scope.postDates = [];
            $scope.postCount = [];


            // Data preparation for the graph
            for (var key in $scope.groupedUsersDate) {
                var userObject = {};
                var usernameArray = [];
                $scope.userDates.push(key);
                var innerObject = $scope.groupedUsersDate[key];
                $scope.userCount.push(innerObject.length);
                userObject.y = innerObject.length;

                for (var inner in innerObject) {
                    $scope.userUsernames.push(innerObject[inner].username);
                    usernameArray.push(innerObject[inner].username);
                }
                userObject.name = usernameArray;
                $scope.userData.push(userObject);
            }

            for (var key in $scope.groupedPostsDate) {
                var postObject = {};
                var postBrands = [];
                $scope.postDates.push(key);
                var innerObject = $scope.groupedPostsDate[key];
                $scope.postCount.push(innerObject.length);
                postObject.y = innerObject.length;
                for (var inner in innerObject) {
                    postBrands.push(innerObject[inner].brand);
                }
                postObject.name = postBrands;
                $scope.postsData.push(postObject);
            }

            /**
             * Line Chart function
             */
            $('#line-container').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Registrierte User: ' + $scope.userTotal + ', Posts: ' + $scope.allPosts.length
                },
                xAxis: [{
                    categories: $scope.postDates
                }, {
                    categories: $scope.userDates,
                }],
                yAxis: {
                    title: {
                        text: 'User Anzahl'
                    }
                },
                series: [{
                    name: 'User',
                    type: 'spline',
                    data: $scope.userData,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                    }

                }, {
                    name: 'Posts',
                    type: 'spline',
                    data: $scope.postsData,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                    }
                }]
            });

            $scope.dataLoaded = true;
            $scope.setMarkers();

        });
    }

    /**
     * Initialise the Pie Chart with the Brand and Model data
     */
    $scope.initPie = function () {
        $http.get('http://localhost:8000/api/v1/admin/posts').success(function (response) {
            $scope.allPosts = response.data;
            lineGraphInit();

            $scope.groupedPostsBrand = _.groupBy($scope.allPosts, function (item) {
                return item.brand;
            });

            var postsLength = $scope.allPosts.length;
            var brandsLength = 0;
            $scope.brandArray = [];

            for (var key in $scope.groupedPostsBrand) {
                var brandObject = {};
                var brandCount = $scope.groupedPostsBrand[key].length;

                brandObject.name = key;
                brandObject.y = (100 / postsLength) * brandCount;

                if (isFloat(brandObject.y)) {
                    brandObject.y = parseFloat(brandObject.y.toFixed(2));
                }

                brandsLength++;
                $scope.brandArray.push(brandObject);
            }

            /**
             * Initialise the Pie Chart container for available brands
             */
            $('#pie-container').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Brands der registrierten Fahrzeuge: ' + brandsLength + '<br> Mit ' + postsLength + ' Fahrzeugen'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                            //$scope.map.panTo(marker.getPosition());
                        }
                    }
                },
                series: [{
                    name: 'Anteil',
                    colorByPoint: true,
                    data: $scope.brandArray,
                    point: {
                        events: {
                            click: function (event) {
                                loadModels(this.name);
                                $scope.brandSelected = true;
                            }
                        }
                    }
                }]
            });

            /**
             * Load the model Data associated with the selected brand
             * @param brand
             */
            function loadModels(brand) {
                $scope.models = $scope.groupedPostsBrand[brand];

                $scope.groupedModels = _.groupBy($scope.models, function (item) {
                    return item.model;
                });

                var allModelsLength = $scope.models.length;
                var modelsLength = 0;

                $scope.modelsArray = [];

                for (var key in $scope.groupedModels) {
                    var modelObject = {};
                    var modelCount = $scope.groupedModels[key].length;

                    modelObject.name = key;
                    modelObject.y = (100 / allModelsLength) * modelCount;

                    if (isFloat(modelObject.y)) {
                        modelObject.y = parseFloat(modelObject.y.toFixed(2));
                    }

                    modelsLength++;
                    $scope.modelsArray.push(modelObject);
                }

                /**
                 * Initialise the Pie Chart container for the models associated with brand
                 */
                $('#pie-sub-container').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'Modele von ' + brand + ': ' + modelsLength + '<br>Mit ' + allModelsLength + ' Fahrzeugen'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Brands',
                        colorByPoint: true,
                        data: $scope.modelsArray
                    }]
                });
            }
        });
    };

    /**
     * Set all markers on the google map
     * The markers represents all the Cars that have been posted by all users.
     */
    $scope.setMarkers = function () {
        $http.get('http://localhost:8000/api/v1/admin/posts').success(function (response) {
            $scope.allPosts = response.data;

            // set multiple marker
            for (var i = 0; i < $scope.allPosts.length; i++) {
                // init markers
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.allPosts[i].geoX, $scope.allPosts[i].geoY),
                    map: $scope.map,
                    title: $scope.allPosts[i].brand + " : " + $scope.allPosts[i].model,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });

                // Marker array for later removal from map
                $scope.markers.push(marker);

                // process multiple info windows
                (function (marker, i) {

                    var contentString = '<md-card class="post-card">' +
                        '<div class="cell">' +
                        '<img src="http://localhost:8000/img/cars_tmbn/' + $scope.allPosts[i].img_path + '">' +
                        '</div>' +
                        '<md-content layout="row">' +
                        '<md-content layout="column" layout-align="center center" flex>' +
                        '<h4>' + $scope.allPosts[i].brand + '  ' + $scope.allPosts[i].model + '</h4>' +
                        '</md-content>' +
                        '</md-content>' +
                        '</md-card>';

                    google.maps.event.addListener(marker, 'click', function () {
                        if ($scope.infowindow) {
                            $scope.infowindow.close();
                        }
                        $scope.loadDetails($scope.allPosts[i]);
                        $scope.infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        $scope.infowindow.open($scope.map, marker);
                    });
                })(marker, i);
            }
        });
    };

    /**
     * Close Sidenav on click
     */
    $scope.close = function () {
        $mdSidenav('left').toggle();
    };

    /**
     * Load Markers to the google map depending on the set Brand
     * @param brand
     */
    $scope.setBrand = function (brand) {
        $interval.cancel($rootScope.ToolsPromise);

        $scope.modelsMap = $scope.groupedPostsBrand[brand.name];

        for (i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
        }

        // set multiple marker
        for (var i = 0; i < $scope.modelsMap.length; i++) {
            // init markers
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.modelsMap[i].geoX, $scope.modelsMap[i].geoY),
                map: $scope.map,
                title: 'Post' + i,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            $scope.markers.push(marker);

            // process multiple info windows
            (function (marker, i) {

                var contentString = '<md-card class="post-card">' +
                    '<div class="cell">' +
                    '<img src="http://localhost:8000/img/cars_tmbn/' + $scope.modelsMap[i].img_path + '">' +
                    '</div>' +
                    '<md-content layout="row">' +
                    '<md-content layout="column" layout-align="center center" flex>' +
                    '<h4>' + $scope.modelsMap[i].brand + '  ' + $scope.modelsMap[i].model + '</h4>' +
                    '</md-content>' +
                    '</md-content>' +
                    '</md-card>';

                /**
                 * Click event listener for every marker
                 */
                google.maps.event.addListener(marker, 'click', function () {
                    if ($scope.lastMarker != undefined) {
                        $scope.lastMarker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
                    }

                    if ($scope.infowindow) {
                        $scope.infowindow.close();
                    }
                    $scope.loadDetails($scope.modelsMap[i]);
                    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
                    $scope.lastMarker = marker;

                    $scope.infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    $scope.infowindow.open($scope.map, marker);
                });
            })(marker, i);
        }
    };

    /**
     * Load details of a Car stored under the selected marker
     * @param post
     */
    $scope.loadDetails = function (post) {
        $scope.detailsLoaded = true;
        $http.get('http://localhost:8000/api/v1/admin/postbelongs/' + post.id).success(function (response) {

            var theUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
                '' + post.geoX + ',' + post.geoY + '&key=AIzaSyC7iEtfjUuGybd2KYJC7ml80UmpbKpZwK0';

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    var address = JSON && JSON.parse(xmlHttp.responseText) || $.parseJSON(xmlHttp.responseText);
                $scope.postAddress = address.results[0].formatted_address;
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);

            $scope.postDetailed = post;
            $scope.postUser = response.user[0];
        });
    };

    /**
     * Reset the map and the markers
     */
    $scope.resetMap = function () {
        $scope.selector = undefined;

        for (i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
        }
        $scope.detailsLoaded = false;
        $scope.setMarkers();
        $scope.startToolsInterval();
    };

    function isFloat(n) {
        return n === +n && n !== (n | 0);
    }

    function isInteger(n) {
        return n === +n && n === (n | 0);
    }

    function formatDate(date) {
        var d = new Date(date.replace(/-/g, '/'));
        return d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();//+ " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }

});