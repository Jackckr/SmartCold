checkLogin();
var app = angular.module('app', []);
app.controller('alarmLog', function ($scope, $location, $http, $rootScope) {
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?type=1&filter=";
    $scope.alarmTotalCnt = 0;
    $scope.alarmMsgs = [];

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var rootRdcId = $.getUrlParam('storageID');

    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            if (!rootRdcId) {
                if (window.localStorage.rdcId) {
                	setStorage(window.localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
            	setStorage(rootRdcId);
                findByRdcId(rootRdcId);
            }
        }
    });

    function findByRdcId(rootRdcId) {
        $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
            $scope.currentRdc = data[0];
            $scope.rdcName = data[0].name;
            $scope.rdcId = data[0].id;
            $scope.viewStorage($scope.rdcId);
        });
    }

    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": rdcId
            }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
                $scope.alarmMsgs = data;
            }
        });
        setStorage(rdcId);
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }
    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?type=1&filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    }
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
    }
    /**
     * 权限  
     * start
     * 
     * 
    */
    function setStorage(rootRdcId) {
    	initAllByRdcId = function(rootRdcId){
	        $rootScope.rdcId = rootRdcId;
	        $http({method:'POST',url:ER.coldroot + '/i/acl/getRUACL',params:{rdcid : $rootScope.rdcId,uid : window.user.id}}).success(function (data) {
	      		$rootScope.aclml=data.aclml;
	      		$rootScope.pagstate=[];
	      		$("body .role_limit").removeClass("role_limit");
	      		angular.forEach(data.aclml,function(obj,i){ 
	      			if(obj.acl){
	      				if(!obj.hasnode){  
	      					// 技术原因，无法处理
//			      					coldWeb.stateProvider.state(obj.controller,{url:obj.tourl,controller: obj.controller,  templateUrl: obj.templateUrl });
	      				}
	      			}else{
	      				$("#ml_acl"+obj.id).addClass("role_limit");
	      				$("#ml_acl"+obj.id+" *").addClass("role_limit");
	      				$("#ml_acl"+obj.id+" *").attr("disabled",true); 
	      				$("#ml_acl"+obj.id+" *").attr("disabled",true); 
	      				if(window.user.type==1){
	      					$("#ml_acl"+obj.id+" *").addClass("hide");
		      				$("#ml_acl"+obj.id+" *").addClass("hide");
	      				}
	      			}
	      		});
	        });
    	};
    	initAllByRdcId(rootRdcId)
    };
    
    /**
     * 权限
     * 
     * end
     * 
    */
});
