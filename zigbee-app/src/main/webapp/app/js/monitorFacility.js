checkLogin();
var app = angular.module('app', []);
app.controller('monitorFacility', function ($scope, $location, $http, $rootScope, $sce) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
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
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {params: {
            "rdcId": rdcId
        }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
        $http.get(ER.coldroot + '/i/platformDoor/findByRdcId?rdcId=' + $scope.rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.platformDoors = data;
            }
        })
        $http.get(ER.coldroot + '/i/coldStorageSet/findHasDoorStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.drawDoor($scope.mystorages[i]);
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
        window.location.href='monitorTemperature.html?storageID=' + $scope.rdcId;
    }
    $scope.goElectric = function () {
        window.location.href='monitorElectric.html?storageID=' + $scope.rdcId;
    }
    $scope.goOtherMonitor = function () {
        window.location.href='monitorCooling.html?storageID=' + $scope.rdcId;
    }

    var getFormatTimeString = function (delta) {
        delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
    }

    var formatTime = function (timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }

    function formatTimeToDay(timeString){
        return formatTime(timeString.substring(0,10)).substring(0,10)
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawDoor = function (storage) {

        $http.get(ER.coldroot + '/i/coldStorageDoor/findByStorageId?storageID=' + storage.id).success(function (data) {
            if (data.length > 0) {
                var doorId = data[0].id;
                $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
                    params: {
                        "oid": doorId,
                        type: 2,
                        key: 'Switch'
                    }
                }).success(function (result) {
                    var data = [];
                    for (var i = 0; i < result.length; i++) {
                        var val = Date.parse(result[i].addtime);
                        var newDate = new Date(val).getTime();
                        data.push({
                            x: newDate,
                            y: result[i].value
                        });
                    }

                    // 冷库门开关监控
                    $(function () {
                        $(document).ready(function () {

                            Highcharts.setOptions({
                                global: {
                                    useUTC: false
                                }
                            });

                            var mainId = 'door' + doorId;
                            if ($scope.swiper < $scope.mystorages.length) {
                                var innerHTML = '<div class="swiper-slide">' +
                                    '<p class="actually">' + storage.name + '</p>' +
                                    '<div id=' + mainId + '></div> ';
                                $("#chartView").last().append(innerHTML);
                                $scope.swiper += 1;
                            }

                            $('#' + mainId).highcharts({
                                chart: {
                                    type: 'column',
                                    animation: Highcharts.svg, // don't animate in old IE
                                    marginRight: 10,
                                    backgroundColor: {
                                        linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                                        stops: [
                                            [0, 'rgb(210, 214, 222)'],
                                            [1, 'rgb(210, 214, 222)']
                                        ]
                                    },
                                    borderColor: '#d2d6de',
                                    borderWidth: 2,
                                    className: 'dark-container',
                                    plotBackgroundColor: 'rgba(210, 214, 222, .1)',
                                    plotBorderColor: '#d2d6de',
                                    plotBorderWidth: 1
                                },
                                title: {
                                    text: '冷库门开关监控'
                                },
                                xAxis: {
                                    type: 'datetime',
                                    tickPixelInterval: 200,
                                },
                                yAxis: {
                                    allowDecimals: false,
                                    labels: {
                                        formatter: function () {
                                            if (this.value === 0) {
                                                return "关";
                                            } else if (this.value === 1) {
                                                return "开";
                                            }
                                        }
                                    },
                                    title: {
                                        text: 'DoorState(0关1开)'
                                    },
                                    plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }],
                                    max: 1,
                                    min: 0,
                                },
                                tooltip: {
                                    formatter: function () {
                                        var state = undefined;
                                        if (this.y === 1) {
                                            state = '冷库处于开门状态';
                                        } else {
                                            state = '冷库处于关门状态';
                                        }

                                        return '<b>' + this.series.name + '</b><br/>' +
                                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                            state;
                                    }
                                },
                                legend: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: false
                                },
                                credits: {
                                    enabled: false // 禁用版权信息
                                },
                                series: [{
                                    name: 'DoorState',
                                    pointPadding: 0, //数据点之间的距离值
                                    groupPadding: 0, //分组之间的距离值
                                    borderWidth: 0,
                                    shadow: false,
                                    pointWidth: 1, //柱子之间的距离值
                                    data: (function () {
                                        return data;
                                    })()
                                }]
                            });
                        });

                    });

                });
            } else {
                var mainId = 'defalt' + $scope.defaltswiper;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.defaltswiper += 1;
                    $scope.swiper += 1;
                }
            }
        })
    }

    $scope.drawFlatform = function (door) {
        var doorId = door.id;
        $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
            params: {
                "oid": doorId,
                type: 11,
                key: 'Switch'
            }
        }).success(function (result) {
            var data = [];
            for (var i = 0; i < result.length; i++) {
                var val = Date.parse(result[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: result[i].value
                });
            }

            $(function () {
                $(document).ready(function () {

                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    var mainId = 'platform' + doorId;
                    if ($scope.swiper < $scope.platformDoors.length) {
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">' + door.name + '</p>' +
                            '<div id=' + mainId + '></div> ';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper += 1;
                    }

                    $('#' + mainId).highcharts({
                        chart: {
                            type: 'column',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 10,
                            backgroundColor: {
                                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                                stops: [
                                    [0, 'rgb(210, 214, 222)'],
                                    [1, 'rgb(210, 214, 222)']
                                ]
                            },
                            borderColor: '#d2d6de',
                            borderWidth: 2,
                            className: 'dark-container',
                            plotBackgroundColor: 'rgba(210, 214, 222, .1)',
                            plotBorderColor: '#d2d6de',
                            plotBorderWidth: 1
                        },
                        title: {
                            text: '月台门开关监控'
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 200,
                        },
                        yAxis: {
                            allowDecimals: false,
                            labels: {
                                formatter: function () {
                                    if (this.value === 0) {
                                        return "关";
                                    } else if (this.value === 1) {
                                        return "开";
                                    }
                                }
                            },
                            title: {
                                text: 'DoorState(0关1开)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }],
                            max: 1,
                            min: 0,
                        },
                        tooltip: {
                            formatter: function () {
                                var state = undefined;
                                if (this.y === 1) {
                                    state = '冷库处于开门状态';
                                } else {
                                    state = '冷库处于关门状态';
                                }

                                return '<b>' + this.series.name + '</b><br/>' +
                                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                    state;
                                //Highcharts.numberFormat(this.y, 2);
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            enabled: false // 禁用版权信息
                        },
                        series: [{
                            name: 'DoorState',
                            pointPadding: 0, //数据点之间的距离值
                            groupPadding: 0, //分组之间的距离值
                            borderWidth: 0,
                            shadow: false,
                            pointWidth: 1, //柱子之间的距离值
                            data: (function () {
                                return data;
                            })()
                        }]
                    });
                });

            });

        })
    }
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    $scope.drawInOutGoods = function (storage) {
        var totalTime = 10;
        var series = []
        var time = []
        var timeMap = {}
        var legend = []
        for(var i=0; i< totalTime;i++){
            xTime = formatTimeToDay(getFormatTimeString(-i* 24 * 60 * 60 * 1000))
            time.unshift(xTime)
            timeMap[xTime] = totalTime - i - 1
        }
        var startDate = formatTimeToDay(getFormatTimeString(-10 * 24 * 60 * 60 * 1000))
        var endDate = getFormatTimeString();
        var url = ER.coldroot + "/i/other/findGoodsByDate?coldstorageId=" + storage.id +
            "&startCollectionTime=" + startDate + "&endCollectionTime=" + endDate;
        $http.get(url).success(function (data) {
            if (Object.keys(data).length > 0) {
                var mainId = "barChart" + storage.id;
                var barId = "#" + mainId;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }

                angular.forEach(data,function(yData,key){
                    outData = {name:key+'出货量',type:'bar',data:new Array(totalTime+1).join("-").split("")};
                    inData = {name:key+'进货量',type:'bar',data:new Array(totalTime+1).join("-").split("")}
                    inTemp = {name:key+'进货温度',type:'line',yAxisIndex: 1,data:new Array(totalTime+1).join("-").split("")}
                    legend.push(key+'出货量',key+'进货量',key+'进货温度');
                    angular.forEach(yData,function(item){
                        var date = new Date(item.date);
                        var dateStr = date.Format("yyyy-MM-dd");
                        outData.data[timeMap[dateStr]] = item['outputQUantity'];
                        inData.data[timeMap[dateStr]] = item['inputQuantity'];
                        inTemp.data[timeMap[dateStr]] = item['inputTemperature'];
                    })
                    series.push(outData,inData,inTemp)
                })
                barOption = {
                	backgroundColor: '#D2D6DE',
                    tooltip : {
                        trigger: 'axis',
                        textStyle:{
                        	fontSize:12
                        }
                    },
                    title:{
                    	text:'日均货物流通监控',
                    	textStyle:{
                        	fontSize:13,
                        	fontWeight:'400'
                        }
                    },
                    legend: {
                        data:legend,
                        y:'bottom',
                    },
                    grid:{
                    	x:40,
                    	y:50,
                    	x2:40,
                    	y2:100,
                    	width:"75%",
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : time
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '货物量(kg)',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        },
                        {
                            type : 'value',
                            name : '温度(°C)',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : series
                };
                var barChart = echarts.init($(barId).get(0));
                barChart.setOption(barOption);
            }
        })
    }

    $scope.drawOther = function () {

        var keyDescribleMap = {
            forkLift: "叉车日耗能", windScreen: "风幕机日耗能",
            pressurePlatform: "液压平台日耗能", chargingPile: "充电桩日耗能"
        }
        url = ER.coldroot + "/i/other/findOtherDeviceCosts?rdcId=" + $scope.rdcId + "&startTime="
            + getFormatTimeString(-30 * 24 * 60 * 60 * 1000) + "&endTime=" + getFormatTimeString()
        $http.get(url).success(function (data) {
            $scope.otherInfos = data;
            angular.forEach(data, function (infos, key) {
                var mainId = key + "Chart";
                var chartId = "#" + mainId;
                if ($scope.swiper < 4) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + keyDescribleMap[key] + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }

                var chart = echarts.init($(chartId).get(0));
                var xData = []
                var yData = []
                angular.forEach(infos, function (info) {
                    yData.push(info.cost)
                    xData.push(formatTime(info.time))
                })
                chart.setOption($scope.creatOption(keyDescribleMap[key], xData, yData,
                    "耗能", "kW.h", keyDescribleMap[key], "line"))
            })
        })
    }

    $scope.activeEnergy = 'storageDoor';
    $scope.storageDoorFacility = function () {
        clearSwiper();
        $scope.activeEnergy = 'storageDoor';
        if ($scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawDoor($scope.mystorages[i]);
            }
        }
    }

    $scope.platformDoorFacility = function () {
        clearSwiper();
        $scope.activeEnergy = 'platformDoor';
        if ($scope.platformDoors && $scope.platformDoors.length > 0) {
            for (var i = 0; i < $scope.platformDoors.length; i++) {
                $scope.drawFlatform($scope.platformDoors[i]);
            }
        }
    }

    $scope.goodsInOutOther = function () {
        clearSwiper();
        $scope.activeEnergy = 'drawInOutGoods';
        if ($scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawInOutGoods($scope.mystorages[i]);
            }
        }
    }

    $scope.otherFacilityFacility = function () {
        clearSwiper();
        $scope.activeEnergy = 'otherFacility';
        $scope.drawOther();
    }

    function clearSwiper() {
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
    }

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type) {
        var option = {
            backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: title,
                x: 'center',
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

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'storageDoor' && $scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawDoor($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'platformDoor' && $scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawFlatform($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'drawInOutGoods' && $scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawInOutGoods($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'otherFacility') {
            $scope.drawOther();
        }
    }, 30000);

});
