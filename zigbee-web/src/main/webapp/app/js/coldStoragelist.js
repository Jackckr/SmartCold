/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http, $location) {

    $scope.goDetail = function (storageID) {
        $state.go('coldStorageComment', {"storageID": storageID});
    }
});