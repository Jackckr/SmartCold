coldWeb.controller('accessConfiguration',function ($http,$rootScope, $scope) {
    initTable(1);
    $scope.accredit=function (aclIndex) {
        $scope.aclFlag=aclIndex==1?true:false;
       initTable(aclIndex);
    };
    $scope.changePwd=function () {
      $("#changPwd").modal({
          keyboard: true
      });
    };
    $scope.submitChangePwd=function () {
        if($scope.pwd!=$scope.repwd){return false;}
        $http({url:"/i/userlave/updatePwd",method:"post",params:{uid:$rootScope.user.id,acl:$scope.aclFlag?1:2,pwd:$scope.pwd}}).success(function (data) {
            $scope.pwd="";
            $scope.repwd="";
            $("#changPwd").modal('hide');
            alert(data.message);
        });
    };
    $scope.saveConf=function () {
        $http({url:"/i/userlave/updateAclConf",method:"post",params:{uid:$rootScope.user.id,acl:$scope.aclFlag?1:2,aclString:$scope.aclFlag?$scope.acl1:$scope.acl2}}).success(function (data) {
            alert(data.message);
        });
    };
    $http({method:'post',url:'/i/userlave/getUserLaveByUid',params:{uid:$rootScope.user.id}}).success(function (data) {
        $scope.acl1=data.acl1?data.acl1:"";
        $scope.acl2=data.acl2?data.acl2:"";
    });
    $scope.changeAcl=function (parIndex,index) {
        var conf = $scope.rdcConfArr[parIndex].mapping[index];
        $scope.rdcConfArr[parIndex].mapping[index].acl=conf.acl?0:1;
        if($scope.aclFlag){
            var split = $scope.acl1==""?[]:$scope.acl1.split(',');
            conf.acl?split.push(conf.key):split.splice(split.indexOf(conf.key),1);
            $scope.acl1=split.join();
        }else {
            var split2 =$scope.acl2==""?[]:$scope.acl2.split(',');
            conf.acl?split2.push(conf.key):split2.splice(split2.indexOf(conf.key),1);
            $scope.acl2=split2.join();
        }
    };
    function initTable(aclIndex) {
        $http({
            method:'post',
            url:'/i/setting/getRdcConf',
            params:{rdcid:$rootScope.rdcId}
        }).success(function (rdcConf) {
            $scope.rdcConfArr=rdcConf;
            if(rdcConf!=''){
                angular.forEach(rdcConf,function (item, preindex) {
                    $scope.rdcConfArr[preindex].mapping=JSON.parse(item.mapping);
                    $http({method:'post',url:'/i/getQTData',params:{apid:item.devId}}).success(function (data) {
                        angular.forEach($scope.rdcConfArr[preindex].mapping,function (item,index) {
                            var rexStr=':"'+item.key+'","currentvalue":"(-*\\d*\\.*\\d*)"';
                            var rex=new RegExp(rexStr);
                            var match = data.message.match(rex);
                            $scope.rdcConfArr[preindex].mapping[index].value=match[1];
                            var aclRexStr=item.key;
                            var regExp = new RegExp(aclRexStr);
                            var aclStr=aclIndex==1?$scope.acl1:$scope.acl2;
                            if(regExp.test(aclStr)){
                                $scope.rdcConfArr[preindex].mapping[index].acl=1;
                            }else {
                                $scope.rdcConfArr[preindex].mapping[index].acl=0;
                            }
                        });
                    });
                });
            }
        });
    }
});