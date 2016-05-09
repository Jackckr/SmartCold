/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorBlower', function ($scope, $location, $stateParams,$http,$rootScope) {
    console.log($stateParams.userId);
    $scope.coldCnt = 0;
    $scope.defrostCnt = 0;
    $scope.freeCnt = 0;
    $scope.load = function () {
        $http.get('/i/compressorBlower/findByUserId', {
            params: {
                "userId": $stateParams.userId
            }
        }).success(function (result) {
            console.log("result:" + result);
            $scope.blowers = result;
            var coldCnt =0;
            var defrostCnt = 0;
            var freeCnt = 0;
            for (var i = 0; i < result.length; i++) {
                console.log("result:" + result[i].coldStorageId + ",blowerId: " + result[i].blowerId + ",coldStorageName: " + result[i].coldStorageName );
                if (parseInt(result[i].isRunning) === 1){
                    coldCnt = coldCnt + 1;
                }
                if (parseInt(result[i].isDefrosting) === 1){
                    defrostCnt = defrostCnt + 1;
                }
                if (parseInt(result[i].isRunning) === 0 && parseInt(result[i].isDefrosting) === 0){
                    freeCnt = freeCnt + 1;
                }
            }
            $scope.coldCnt = coldCnt;
            $scope.defrostCnt = defrostCnt;
            $scope.freeCnt = freeCnt;
        })
    }
    $scope.load();

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);

});
