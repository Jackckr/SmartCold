checkLogin();
app.controller('alarmLog', function ($scope, $location, $http, $rootScope, userService) {
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?type=1&filter=";
    $scope.alarmTotalCnt = 0;
    $scope.alarmMsgs = [];

    $(".mylog").click(function (event) {
        var _index = $(this).index();
        $('.warn_sec>div').eq(_index).show().siblings().hide();
        $(this).addClass('current').siblings().removeClass('current');
    })
    $scope.initData=function(){
        $scope.alluser = JSON.parse(sessionStorage.vm)
        $scope.alarm = [];
        if ($scope.user.role == 3) {
            $scope.rdclist = [$scope.alluser.choserdc];
        } else {
            $scope.rdclist = $scope.alluser.allUserRdcs;
        }
        //rdc策略
        angular.forEach($scope.rdclist, function(obj, i) {
            $http.get(ER.coldroot+'/i/AlarmController/getDatilAlarmMsg', {
                params: {
                    userId: $scope.user.id,
                    type: 1,
                    rdcId: obj.id
                }
            }).success(function(data, status, headers, config) {
                //
                if (data.length > 0) {
                    $scope.alarm.push({
                        name: obj.name,
                        alarm: data
                    });
                }
            });
        });
    };
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
                    initAllByRdcId(window.localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
                initAllByRdcId(rootRdcId);
                findByRdcId(rootRdcId);
            }
        }
        $scope.changeTempEcharts();
    });
    $scope.changeTempEcharts=function () {
        $http.get(ER.coldroot+'/i/coldStorageSet/findStorageSetByUserId' ,{params: {rdcId:$rootScope.rdcId,userId:user.id,type:user.type}} ).success(function(data,status,headers,config){// 初始化冷库
            $rootScope.Tempset=[];
            $rootScope.mystorages = data;
            $rootScope.storageModal = data[0];
            $scope.initData();
        });
    }

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
    };

    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
        $scope.changeTempEcharts();
    }
});
