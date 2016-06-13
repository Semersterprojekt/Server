/**
 * Created by rijad on 01.06.16.
 */
angular.module('app.controllers').controller('LogoutCtrl', function ($rootScope, $scope, $state, $interval) {
    $scope.$on('$viewContentLoaded', function () {
        $interval.cancel($rootScope.HomePromise);
        $interval.cancel($rootScope.ToolsPromise);
        localStorage.clear();
    });
});