coldWeb.controller('systemInformInfo', function ($scope, $state, $cookies, $http, $location,$stateParams) {
    $scope.systemId = $stateParams.sysId;
    $scope.getSystemInformInfo=function () {
        $http({
            method:"post",
            url:"/i/systemInform/getSystemInformInfo",
            params:{
                id:$scope.systemId
            }
        }).success(function (data) {
            $scope.systemInformObject=data;
        });
      };
    $scope.pageChanged = function () {
        $scope.getSystemInformInfo();
    };
    $scope.getSystemInformInfo();
});
