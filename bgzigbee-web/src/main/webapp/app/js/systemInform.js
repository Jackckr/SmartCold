coldWeb.controller('systemInform', function ($scope, $state, $cookies, $http, $location) {
    // 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 0;
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
    };
  
    $scope.getSystemInform();

    $scope.readSystemInform=function (id) {
        $http({
            method:'POST',
            url:'/i/systemInform/getNewSystemInform',
            params:{
                id:id
            }}).success(function (data) {
            $("span[class='count']").html(data.length);
        });
        $scope.getSystemInform();
    };
    $scope.manage=function (id) {
        var r=confirm("确认处理?");
        if (!r) {
            return;
        }
        var option = $("input:checked");
        var checkId="";
        for(var i=0;i<option.length;i++){
            checkId+=option[i].value+",";
        }
        $http({
            method: 'POST',
            url: '/i/systemInform/manageSystemInform',
            params: {
                id: id,
                checkId:checkId
            }
        }).success(function () {
        	 $scope.getSystemInform();
        });
    };
    $scope.pageChanged = function () {
        $scope.getSystemInform();
    };
});
