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
            angular.forEach($scope.compressorGroups, function (item) {
                $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(function (data) {
                    item.compressors = data;
                })
            })
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.aredayTime = function (time) {
        if (time == null || time == "") {
            return "未设置保养信息";
        }
        var text = "还剩  ";
        var date1 = new Date();
        var date2 = new Date(time);
        var date3 = date2.getTime() - date1.getTime();  //时间差的毫秒数
        var days = Math.floor(date3 / (86400000));
        var hours = Math.floor(date3 % (86400000) / (3600000));
        if (days > 0) {
            text += days + "天 ";
        }
        if (hours > 0) {
            text += hours + "小时 ";
        } else {
            text = "已过保养期";
        }
        return text;
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

    jeDate({
        dateCell: "#applyTime",
        format: "YYYY-MM-DD",
        isTime: false,
        zIndex: 10000,
        minDate: "2008-08-08 08:08:08"
    })
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
});
