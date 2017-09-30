checkLogin();
app.controller('monitorElectric', function ($scope, $location, $http, $rootScope ,userService) {
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
    };
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
                findByRdcId(rootRdcId)
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
        // 初始化电量
        $http.get(ER.coldroot + '/i/power/findByRdcId?rdcId=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.powers = data;
                for (var i = 0; i < $scope.powers.length; i++) {
                    $scope.load($scope.powers[i]);//222
                }
            }
        });
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
        clearSwiper();
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
    }
    $scope.goTemperature = function () {
        window.location.href = 'analysis.html?storageID=' + $scope.rdcId;
    }
    $scope.goTransport = function () {
        window.location.href = 'analysisTransport.html?storageID=' + $scope.rdcId;
    }
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }
    $scope.goElectric = function () {
        window.location.href='analysisElectric.html?storageID=' + $scope.rdcId;
    };

    var getFormatTimeString = function (delta) {
        delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
    }
    var formatTime=function(timeString){
        if (typeof(timeString) == "string"){
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"");
        }else{
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"");
        }
    };
    $scope.swiper = 0;
    $scope.load = function (powerSet) {
        var powerid = powerSet.id;
        var endTime = getFormatTimeString();
        var startTime = getFormatTimeString(-30 * 24 * 60 * 60 * 1000);
        var url = ER.coldroot + "/i/AnalysisController/getAnalysisDataByDate?type=" + 10 + "&oid=" + powerid
            + "&keys=TotalPWC" + "&startTime=" + startTime + "&endTime=" + endTime;
        $http.get(url).success(function (data) {
            var powerData = data['TotalPWC'];
            var xData = [];
            var yData = [];
            if(powerData.length>0){
                angular.forEach(powerData, function (item) {
                    xData.push(formatTime(item['date']).split(" ")[0]);
                    yData.push(item['value']);
                });
            }
            var mainId = 'power' + powerid;
            if ($scope.swiper < $scope.powers.length) {
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">' + powerSet.name + '</p>' +
                    '<div id=' + mainId + ' style="min-height: 15rem;"></div> ';
                $("#chartView").last().append(innerHTML);
                $scope.swiper += 1;
            }
            var lineChart = echarts.init($('#' + mainId)[0]);
            var option = $scope.creatOption('日累计耗电量', xData, yData, '日耗电量', 'kW.h', '日耗电量', 'bar');
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
        if ($scope.powers && $scope.powers.length > 0) {
            for (var m = 0; m < $scope.powers.length; m++) {
                $scope.load($scope.powers[m]);//333
            }
        }
    }
    $scope.waterEnergy = function () {
        clearSwiper();
        $scope.activeEnergy = 'water';
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + $scope.rdcId).success(
            function (data) {
                $scope.compressorGroups = data;
                angular.forEach($scope.compressorGroups, function (item) {
                    endTime = getFormatTimeString();
                    startTime = getFormatTimeString(-30*24 * 60 * 60 * 1000);
                    url = ER.coldroot + "/i/AnalysisController/getAnalysisDataByDate?type=10&oid=" + item.id
                        + "&keys=WaterCost" + "&startTime=" + startTime + "&endTime=" + endTime;
                    $http.get(url).success(function (data) {
                        $scope.waterData = data['WaterCost'];
                        var xData = [];
                        var yData = [];
                        angular.forEach($scope.waterData, function (item) {
                            yData.push(item['value']);
                            xData.push(formatTime(item['date']).split(" ")[0]);
                        });
                        var mainId = 'water' + item.id;
                        if ($scope.swiper < $scope.compressorGroups.length) {
                            var innerHTML = '<div class="swiper-slide">' +
                                '<p class="actually">' + item.name + '</p>' +
                                '<div id=' + mainId + ' style="min-height: 15rem;"></div> ';
                            $("#chartView").last().append(innerHTML);
                            $scope.swiper += 1;
                        }
                        var lineChart = echarts.init($('#' + mainId).get(0));
                        var option = getEchartSingleOption('日累计耗水量', xData, yData, '日耗水量', 't', '日耗水量', 'bar', parseInt(yData[0]));
                        lineChart.setOption(option);
                    });
                })
            })
    }

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'power' && $scope.powers && $scope.powers.length > 0) {
            for (var i = 0; i < $scope.powers.length; i++) {
                $scope.load($scope.powers[i]);//111
            }
        }
        if ($scope.activeEnergy == 'water') {
            $scope.waterEnergy();
        }
    }, 30000);

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type, yMin, yMax) {
    	min = max = yData.length > 0?yData[0]:0;
		angular.forEach(yData,function(item,index){
			yData[index] = yData[index].toFixed(2);
			min = Math.min(min,yData[index]);
            max = Math.max(max,yData[index]);
		});
		if(min>=0){
			yMin=0;
		}else{
			yMin = max - min < 1 && type == 'line' ?min - 10:yMin;
		};
        var option = {
            backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title,
                x: 'left',
                textStyle: {
                    fontSize: 13,
                    fontWeight: '400'
                }
            },
            calculable: true,
            grid: {
                x: 55,
                y: 60,
                x2: 20,
                y2: 20
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
                    name: yName + "(" + yUnit + ")",
                    min : yMin ? yMin : 'auto',
		            max : yMax ? yMax : 'auto',
		            minInterval : 1
                }
            ],
            series: [
                {
                    name: lineName,
                    type: type,
                    data: yData,
                    smooth:true
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

    function getEchartSingleOption(title, xData, yData, yName, yUnit, lineName, type, yMin, yMax) {
        min = max = yData.length > 0 ? yData[0] : 0
        angular.forEach(yData, function (item, index) {
            yData[index] = yData[index].toFixed(2);
            min = Math.min(min, yData[index])
            max = Math.max(max, yData[index])
        })
        if (max === 0 && min === 0) {
            yMin = 0;
        } else {
            yMin = max - min < 1 && type == 'line' ? min - 10 : yMin;
        }
        option = {
            backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title,
                textStyle: {
                    fontSize: 13,
                    fontWeight: '400'
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yName + "(" + yUnit + ")",
                    min: yMin ? yMin : 'auto',
                    max: yMax ? yMax : 'auto',
                    minInterval: 1
                }
            ],
            series: [
                {
                    name: lineName,
                    type: type,
                    data: yData,
                    smooth:true
                }
            ]
        };
        return option
    }
});
