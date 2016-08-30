checkLogin();
var app = angular.module('app', []);
app.controller('electric', function ($scope, $location, $http, $rootScope) {
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    //if (window.user.roleid == 3); 超管特殊处理
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            $scope.viewStorage($scope.storages[0].id);
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

    var getFormatTimeString = function(delta){
        delta = delta ? delta + 8 * 60 * 60 * 1000: 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/,"")
    }

    var formatTime = function(timeString){
        if (typeof(timeString) == "string"){
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
        }else{
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
        }
    }

    $scope.swiper = 0;
    $scope.load = function (powerSet) {
        var powerid = powerSet.id;

        var mainId = 'power' + powerid;
        if ($scope.swiper < $scope.powers.length){
            var innerHTML = '<div class="swiper-slide">' +
                '<p class="actually">'+powerSet.name+'</p>' +
                '<div id='+mainId+' style="height: 350px;width: 350px;position: relative;left: 20px"></div> ';
            $("#chartView").last().append(innerHTML);
            $scope.swiper +=1;
        }

        var lineChart = echarts.init($('#' + mainId)[0]);
        var endTime = getFormatTimeString();
        var startTime = getFormatTimeString(-1 * 60 * 60 * 1000);
        url = ER.coldroot + "/i/baseInfo/getKeyValueDataByTime?type=" + 10 + "&oid=" + powerid
            + "&key=PWC" + "&startTime=" + startTime + "&endTime=" + endTime;
        $http.get(url).success(function(data){
            var powerData = data;
            var xData = [];
            var yData = [];
            angular.forEach(powerData,function(item){
                xData.unshift(formatTime(item.addtime))
                yData.unshift(item.value * powerSet.radio)
            })
            var option = $scope.creatOption('累积电量实时监控', xData, yData, '电量', 'kW.h', '电量', 'line');
            lineChart.setOption(option);
        })
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        for (var i = 0; i < $scope.powers.length; i++) {
            $scope.load($scope.powers[i]);
        }
    }, 30000);

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type){
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            title: {
                text: title
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : xData
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : yName + "(" + yUnit + ")"
                }
            ],
            series : [
                {
                    name:lineName,
                    type: type,
                    data:yData,
                }
            ]
        };
        return option
    }

});
