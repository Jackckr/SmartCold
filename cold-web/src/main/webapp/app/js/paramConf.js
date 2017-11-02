coldWeb.controller('paramConf', function ($http, $rootScope, $scope) {
    $scope.rollWrite=function (key, value, devId,type) {
        $scope.rollKey=key;
        $scope.rollValue=value;
        $scope.rollDevId=devId;
        $scope.rollType=type;
        $scope.checkRollWrite=false;
        $('#rollWriteData').modal({
            keyboard: true
        });
    };
    $scope.submitRollData=function () {
        var floatRex = /^-?[0-9]{1}[\d]{0,10}\.?[\d]{0,2}$/;
        var intRex = /^-?[0-9]\d*$/;
        var bitRex=/^[0-1{1}]$/;
        $scope.checkRollWrite=false;
        if($scope.rollType=='float'&&!floatRex.test($scope.rollValue)||
            $scope.rollType=='int'&&!intRex.test($scope.rollValue)||
        $scope.rollType=='bit'&&!bitRex.test($scope.rollValue)){
            $scope.checkRollWrite=true;
            return false;
        }
        $http({url:'/i/updateConfig',method:'post',params:{apid:$scope.rollDevId,key:$scope.rollKey,val:$scope.rollValue,token:window.user.token}}).success(function (data) {
            data?alert("回写成功！"):alert("回写失败！");
            $("#rollWriteData").modal('hide');
        });
    };
    $http({
        method: 'post',
        url: '/i/userlave/getUserLaveByUid',
        params: {uid: $rootScope.user.id}
    }).success(function (data) {
        $scope.acl1 = data.acl1 ? data.acl1 : "";
        $scope.acl2 = data.acl2 ? data.acl2 : "";
    });

    $http({
        method: 'post',
        url: '/i/setting/getRdcConf',
        params: {rdcid: $rootScope.rdcId}
    }).success(function (rdcConf) {
        $scope.rdcConfArr = rdcConf;
        if(rdcConf!=""){
            var spliceArr=[];
            angular.forEach($scope.rdcConfArr, function (item, preindex) {
                spliceArr.push(0);
                $scope.rdcConfArr[preindex].mapping = JSON.parse(item.mapping);
                $http({method: 'post', url: '/i/getQTData', params: {apid: item.devId}}).success(function (data) {
                    $scope.mapping=angular.copy($scope.mapping=angular.copy($scope.rdcConfArr[preindex].mapping));
                    angular.forEach($scope.mapping, function (item, index) {
                        var aclRexStr = item.key;
                        var regExp = new RegExp(aclRexStr);
                        if (window.user.level == 1 && !regExp.test($scope.acl1) || window.user.level == 2 && !regExp.test($scope.acl2)) {
                            $scope.rdcConfArr[preindex].mapping.splice(index-spliceArr[preindex], 1);
                            spliceArr[preindex]+=1;
                        }else {
                            var rexStr = ':"' + item.key + '","currentvalue":"(-*\\d*\\.*\\d*)"';
                            var rex = new RegExp(rexStr);
                            var match = data.message.match(rex);
                            $scope.rdcConfArr[preindex].mapping[index-spliceArr[preindex]].value = match[1];
                        }
                    });
                });
            });
        }
    });
});
