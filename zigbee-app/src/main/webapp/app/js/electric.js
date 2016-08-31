checkLogin();
var app = angular.module('app', []);
app.controller('electric', function ($scope, $location, $http, $rootScope) {
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.activeEnergy = 'power';
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    //if (window.user.roleid == 3); 超管特殊处理
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            $scope.rdcId = $scope.storages[0].id;
            $scope.viewStorage($scope.rdcId);
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
                '<div id='+mainId+' style="height: 18rem;width: 18rem;position: relative;left: 1rem"></div> ';
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

    function clearSwiper(){
        $("div").remove(".swiper-slide");
    }

    $scope.powerEnergy = function(){
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'power';

        for (var i = 0; i < $scope.powers.length; i++) {
            $scope.load($scope.powers[i]);
        }
    }

    $scope.waterEnergy = function(){
        clearSwiper();
        $scope.activeEnergy = 'water';

        var mainId = 'water';
        var innerHTML = '<div class="swiper-slide">' +
            '<div id='+mainId+' style="height: 18rem;width: 18rem;position: relative;left: 1rem"></div> ';
        $("#chartView").last().append(innerHTML);

        var barCharts = echarts.init($('#' + mainId)[0]);
        $http.get(ER.coldroot + "/i/compressorGroup/getAllWaterCostByRdcId?rdcId=" + $scope.rdcId).success(
            function(data){
                $scope.waterCosts = data;
                var xData = []
                var yData = []
                angular.forEach($scope.waterCosts,function(item){
                    xData.push(item.compressorGroupName);
                    yData.push(item.waterCost);
                })
                var option = $scope.creatOption('日实时累积耗水量', xData, yData, '耗水量', 't', '耗水量', 'bar');
                barCharts.setOption(option);
            })
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'power'){
            for (var i = 0; i < $scope.powers.length; i++) {
                $scope.load($scope.powers[i]);
            }
        }
        if ($scope.activeEnergy == 'water'){
            $scope.waterEnergy();
        }
    }, 30000);

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type){
        var option = {
            tooltip : {
                trigger: 'axis'
            },
            title: {
                text: title,
                x:'left',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#333'          // 主标题文字颜色
                },
            },
            calculable : true,
            grid: {
                x:55,
                y: 60,
                x2: 75,
                /*y2: 60,*/
            },
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
