coldWeb.controller('systemInform', function ($scope, $state, $cookies, $http, $location) {
    // 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.operationLog = [];
    $scope.getSystemInform = function(){
        $http({
            method:'POST',
            url:'/i/systemInform/getSystemInform',
            params:{
                pageNum : $scope.bigCurrentPage,
                pageSize : $scope.maxSize,
                type:$scope.type,
                stype:$scope.stype,
                isReady:$scope.isRead,
                status:$scope.status,
                keyword:$scope.keyword
            }}).success(function (data) {
            $scope.bigTotalItems = data.total;
            $scope.systemInform = data.list;
        });
    }

    $scope.pageChanged = function () {
        $scope.getSystemInform();
    }
    $scope.getSystemInform();

    $scope.goSearch = function(){
        $scope.getComments();
    };
});
