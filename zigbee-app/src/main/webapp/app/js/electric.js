checkLogin();
var app = angular.module('app', []);
app.controller('electric', function ($scope, $location, $http, $rootScope) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.activeEnergy = 'power';
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";

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
            if (rootRdcId == undefined || rootRdcId == null) {
                $scope.currentRdc = $scope.storages[0];
                $scope.rdcId = $scope.storages[0].id;
                $scope.rdcName = $scope.storages[0].name;
                $scope.viewStorage($scope.storages[0].id);
            } else {
                $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
                    $scope.currentRdc = data[0];
                    $scope.rdcName = data[0].name;
                    $scope.rdcId = data[0].id;
                    $scope.viewStorage($scope.rdcId);
                });
            }
        }
    });

    $scope.viewStorage = function (rdcId) {
        // 初始化电量
        $http.get(ER.coldroot + '/i/power/findByRdcId?rdcId=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.powers = data;
                for (var i = 0; i < $scope.powers.length; i++) {
                    $scope.load($scope.powers[i]);
                }
            }
        })
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }
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
    $scope.changeRdc = function (rdc) {
        clearSwiper();
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
    }
    $scope.goTempture = function () {
        window.location.href = 'cold360.html?storageID=' + $scope.rdcId;
    }
    $scope.goFacility = function () {
        window.location.href = 'facility.html?storageID=' + $scope.rdcId;
    }
    $scope.goOtherMonitor = function () {
        window.location.href = 'other.html?storageID=' + $scope.rdcId;
    }

    var getFormatTimeString = function (delta) {
        delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
    }

    $scope.swiper = 0;
    $scope.load = function (powerSet) {
        var powerid = powerSet.id;
        var endTime = getFormatTimeString();
        var startTime = getFormatTimeString(-1 * 60 * 60 * 1000);
        url = ER.coldroot + "/i/baseInfo/getKeyValueDataByTime?type=" + 10 + "&oid=" + powerid
            + "&key=PWC" + "&startTime=" + startTime + "&endTime=" + endTime;
        $http.get(url).success(function (data) {
            var powerData = data;
            var xData = [];
            var yData = [];
            angular.forEach(powerData, function (item) {
                xData.unshift(formatTimeToMinute(item.addtime))
                yData.unshift(item.value * powerSet.radio)
            })

            var currentPower = '';
            if (data.length > 0) {
                currentPower = data[data.length - 1] ? parseFloat(data[data.length - 1].value * powerSet.radio).toFixed(1) : '';
            }
            var mainId = 'power' + powerid;
            if ($scope.swiper < $scope.powers.length) {
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">' + powerSet.name + '</p>' +
                    '<p class="temperaturenum">' + currentPower + 'kW.h</p>' +
                    '<div id=' + mainId + ' style="min-height: 15rem;"></div> ';
                $("#chartView").last().append(innerHTML);
                $scope.swiper += 1;
            }
            var lineChart = echarts.init($('#' + mainId)[0]);
            var option = $scope.creatOption('累积电量实时监控', xData, yData, '电量', 'kW.h', '电量', 'line');
            lineChart.setOption(option);
        })
    }

    function clearSwiper() {
        $scope.swiper = 0;
        $("div").remove(".swiper-slide");
    }

    $scope.powerEnergy = function () {
        clearSwiper();
        $scope.activeEnergy = 'power';

        for (var i = 0; i < $scope.powers.length; i++) {
            $scope.load($scope.powers[i]);
        }
    }

    $scope.waterEnergy = function () {
        clearSwiper();
        $scope.activeEnergy = 'water';
        $http.get(ER.coldroot + "/i/compressorGroup/getAllWaterCostByRdcId?rdcId=" + $scope.rdcId).success(
            function (data) {
                $scope.waterCosts = data;
                var currentWaterCost = '';
                if (data.length > 0) {
                    currentWaterCost = data[data.length - 1] ? parseFloat(data[data.length - 1].waterCost).toFixed(2) : '';
                }
                var xData = []
                var yData = []
                angular.forEach($scope.waterCosts, function (item) {
                    xData.push(item.compressorGroupName);
                    yData.push(item.waterCost);
                })
                var option = $scope.creatOption('日实时累积耗水量', xData, yData, '耗水量', 't', '耗水量', 'bar');
                var mainId = 'water';
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">水表1</p>' +
                    '<p class="temperaturenum">' + currentWaterCost + 't</p>' +
                    '<div id=' + mainId + ' style="height: 18rem;"></div> ';
                $("#chartView").last().append(innerHTML);

                var barCharts = echarts.init($('#' + mainId)[0]);
                barCharts.setOption(option);
            })
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'power') {
            for (var i = 0; i < $scope.powers.length; i++) {
                $scope.load($scope.powers[i]);
            }
        }
        if ($scope.activeEnergy == 'water') {
            $scope.waterEnergy();
        }
    }, 30000);

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type) {
        var option = {
            backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title,
                x: 'left',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#333'          // 主标题文字颜色
                },
            },
            calculable: true,
            grid: {
                x: 55,
                y: 60,
                x2: 75,
                /*y2: 60,*/
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yName + "(" + yUnit + ")"
                }
            ],
            series: [
                {
                    name: lineName,
                    type: type,
                    data: yData,
                }
            ]
        };
        return option
    }

    function formatTimeToMinute(timeString) {
        return formatTime(timeString).substring(0, 16);
    }

    function formatTime(timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }
});
