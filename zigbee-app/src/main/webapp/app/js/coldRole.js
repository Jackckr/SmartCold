checkLogin();
app.controller('coldRole',function ($scope, $location, $http, $rootScope, userService) {
	$scope.user = user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.step = 1;
    /*
    * 分步加载模块
    */
    $scope.goStep1 = function () {
        $scope.step = 1;
    };
    $scope.goStep2 = function () {
        $scope.step = 2;
    };
    $scope.goStep3 = function () {
        $scope.step = 3;
    };
    $scope.goStep4 = function () {
        $scope.step = 4;
    };
    $scope.cancel = function () {
        $(".searchTop").hide();
        $scope.step = 2;
    };
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
        }
    });
    $scope.searchRdcs = function (searchContent) {
        $(".searchTop").show();
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?type=1&filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    };
    $scope.changeRdc = function (rdc) {
        $(".searchTop").hide();
        $scope.step = 2;
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
    };
    $scope.goOtherMonitor = function () {
        location.href='monitorCooling.html?storageID=' + $scope.rdcId;
    };

});
