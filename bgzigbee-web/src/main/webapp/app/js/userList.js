coldWeb.controller('userlist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
    $scope.Allusers = "";
    // 获取当前冷库的列表
    $http.get('/i/user/findUserList').success(function (data) {
        $scope.Allusers = data;
    });
});
