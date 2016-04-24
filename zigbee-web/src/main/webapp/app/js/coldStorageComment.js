/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageComment', function ($rootScope, $scope, $cookies, $http, $location) {

    $scope.goColdStorageDetail = function () {
        document.getElementById('detail').setAttribute("class", "active");
        document.getElementById('coldStorageDetail').setAttribute("class", "tab-pane active");
        document.getElementById('comment').removeAttribute("class");
        document.getElementById('coldStorageComment').removeAttribute("class");
        document.getElementById('coldStorageComment').setAttribute("class", "tab-pane");
    }
    $scope.goColdStorageComment = function () {
        document.getElementById('comment').setAttribute("class", "active");
        document.getElementById('coldStorageComment').setAttribute("class", "tab-pane active");
        document.getElementById('detail').removeAttribute("class");
        document.getElementById('coldStorageDetail').removeAttribute("class");
        document.getElementById('coldStorageDetail').setAttribute("class", "tab-pane");
    }
});