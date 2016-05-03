/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorBlower', function ($scope, $location, $stateParams,$http) {
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
                if (parseInt(result[i].state) === 0){
                    coldCnt = coldCnt + 1;
                }
                if (parseInt(result[i].state) === 1){
                    defrostCnt = defrostCnt + 1;
                }
                if (parseInt(result[i].state) === 2){
                    freeCnt = freeCnt + 1;
                }
            }
            $scope.coldCnt = coldCnt;
            $scope.defrostCnt = defrostCnt;
            $scope.freeCnt = freeCnt;
        })
    }
    $scope.load();

    var timeTicket;
    timeTicket = setInterval(function () {
        if (document.getElementById('blowerPage') !='' && document.getElementById('blowerPage') != undefined && document.getElementById('blowerPage') !=null) {
            $scope.load();
        } else {
            clearInterval(timeTicket);
        }
    }, 30000);
});
