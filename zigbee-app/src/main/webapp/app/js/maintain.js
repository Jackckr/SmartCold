checkLogin();
var app = angular.module('app', []);
app.controller('maintain', function ($scope, $location, $http) {
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
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
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
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

    $scope.smgroid = null;
    $scope.sytime = undefined;
    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": $scope.rdcId
            }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(function (data) {
            $scope.compressorGroups = data;
            var oid = [];
            angular.forEach($scope.compressorGroups, function (item) {
                oid.push(item.id);
                $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(function (data) {
                    item.compressors = data;
                })
            })
            $scope.smgroid = oid.join(',');
            $http.get(ER.coldroot + '/i/physicalController/getCompressorinfo', {params: {oids: $scope.smgroid}}).success(function (data) {
                $scope.sytime = data.entity;
                angular.forEach($scope.compressorGroups, function (item) {
                    angular.forEach(item.compressors, function (obj) {
                        obj.sytm = $scope.aredayTime(obj);
                    });
                });
            });
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.aredayTime = function (obj) {
        if (obj.maintenancetime && obj.lastMaintainTime) {
            var sytime = $scope.sytime[obj.id];
            if (sytime <= 0) {
                return '已超保养期' + sytime;
            }
            return "还剩  " + parseInt(sytime) + "小时";
        } else {
            return "未设置保养时间";
        }
    };

    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    }

    /*tab切换*/
    $(".mylog").click(function (event) {
        var $index = $(this).index();
        $('.mainTainBottomL>div').eq($index).show().siblings().hide();
        $(this).addClass('current').siblings().removeClass('current');
    })
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
    }

    function checkInput() {
        var flag = true;
        // 检查必须填写项
        if ($scope.unitname == undefined || $scope.unitname == '') {
            flag = false;
        }
        return flag;
    }

    $scope.addMaintenance = function () {
        if (checkInput()) {
            $http({
                method: 'POST',
                url: ER.coldroot + '/i/maintenance/addMaintenance',
                params: {
                    unitname: encodeURI($scope.unitname, "UTF-8"),
                    reason: encodeURI($scope.reason, "UTF-8"),
                    ordertime: $scope.ordertime
                }
            }).success(function (data) {
                if (data) {
                    alert("添加成功");
                }
                else {
                    alert("添加失败");
                }
            });

        } else {
            alert("机组名称不允许为空!");
        }
    };
});
