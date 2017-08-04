/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorBlower', function ($scope, $location, $stateParams,$http,$rootScope) {
    $("#oview").height($(".content-wrapper")[0].clientHeight);
    $scope.coldCnt = 0;
    $scope.defrostCnt = 0;
    $scope.freeCnt = 0;
    $scope.load = function () {
        $http.get('/i/compressorBlower/findByRdcId', {
            params: {
                "rdcId": $stateParams.rdcId
            }
        }).success(function (result) {
           // console.log("result:" + result);
            $scope.blowers = result;
            angular.forEach($rootScope.mystorages,function(obj){ 
            	var  stblower=[];
            	angular.forEach( $scope.blowers,function(item){ 
                         if(obj.id==item.coldStorageId){
                        	 stblower.push(item);
                         }
                }); 
            	obj.blowers=stblower;
            }); 
            var coldCnt =0;
            var defrostCnt = 0;
            var freeCnt = 0;
            for (var i = 0; i < result.length; i++) {
            	result[i].runTime = parseFloat(result[i].runTime / 3600).toFixed(2)
            	result[i].defrostTime = parseFloat(result[i].defrostTime / 3600).toFixed(2)
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
            $scope.coldCnt = coldCnt;//制冷
            $scope.defrostCnt = defrostCnt;//化霜
            $scope.freeCnt = freeCnt;//待机
        })
    }
    $scope.load();

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 30000);
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
   
});
