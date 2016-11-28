checkLogin();
var app = angular.module('app', []);
app.controller('monitorTemperature', function ($scope, $location, $http, $rootScope) {
	$scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    Highcharts.setOptions({ global: { useUTC: false }});

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
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.load($scope.mystorages[i],false);
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
    }

    $scope.goElectric = function () {
        window.location.href='monitorElectric.html?storageID=' + $scope.rdcId;
    }
    $scope.goFacility = function () {
        window.location.href='monitorFacility.html?storageID=' + $scope.rdcId;
    }
    $scope.goOtherMonitor = function () {
        window.location.href='monitorCooling.html?storageID=' + $scope.rdcId;
    }

    var formatTime = function (timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }

    $scope.swiper = 0;
    $scope.load = function (storage,isreload ) {
        var storageID = storage.id;
        $scope.mystorageName = storage.name;

        var data = [];
        var startData = [];
        var datumTempData = [];
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
        
        $http.get(ER.coldroot + '/i/coldStorage/getTempByTime', { params: {'key': 'Temp',"oid": storageID, "startTime": formatTime(startTime), "endTime": formatTime(endTime)}}).success(function (result) {
            var list = result.list;
            var startTemperature = parseFloat(result.startTemperature);
            var tempDiff = parseFloat(result.tempdiff);
            var datumTemp = startTemperature + 0.5 * tempDiff;
            for (var i = 0; i < list.length; i++) {
                var val = Date.parse(list[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({x: newDate, y: list[i].value});
            }
            if (data.length > 0) {
                startData.push({x: data[0].x, y: startTemperature });
                datumTempData.push({ x: data[0].x, y: datumTemp });
            } else {
                data.push({x: startTime.getTime(), y: null});
                data.push({x: endTime.getTime(), y: null});
                startData.push({x: endTime.getTime(), y: startTemperature});
                datumTempData.push({x: endTime.getTime(), y: datumTemp});
            }

            //温度实时图——环形图
            var temper = list[0] ? parseFloat(list[0].value).toFixed(1) : '';
            var mainId = 'main' + storage.id;
            if(isreload){//避免重新创建
                var chart=	$('#' + mainId).highcharts();
                chart.series[0].setData(data);
                chart.series[1].setData(startData);
                chart.series[2].setData(datumTempData);
                $("#tm"+mainId).html(temper+"℃");
                return;
            }
                //var swiper = getElementsByClassName("swiper-slide");
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '</p>' +
                        '<p id="tm'+mainId+'" class="temperaturenum">' + temper + '℃</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                $('#' + mainId).highcharts({
                    chart: {
                        type: 'spline',
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
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                    },
                    yAxis: {
                        title: {
                            text: '温度(℃)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }, {
                            color: 'red',           //线的颜色，定义为红色
                            dashStyle: 'solid',     //默认值，这里定义为实线
                            value: startTemperature,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                            width: 2,
                            label: {
                                text: '设定温度(' + startTemperature + '℃)', //标签的内容
                                align: 'right',                //标签的水平位置，水平居左,默认是水平居中center
                                x: 0                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                            }//标示线的宽度，2px
                        },
                            {
                                color: 'red',           //线的颜色，定义为红色
                                dashStyle: 'solid',     //默认值，这里定义为实线
                                value: datumTemp,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                width: 2,
                                label: {
                                    text: '基准温度(' + datumTemp + '℃)', //标签的内容
                                    align: 'right',                //标签的水平位置，水平居左,默认是水平居中center
                                    x: 0                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                }//标示线的宽度，2px
                            }]
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
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
                        name: '温度',
                        markPoint: {
                            data: [
                                {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        data: (function () {
                            return data;
                        })()
                    },
                        {
                            name: '设定温度',
                            color: 'red',
                            dashStyle: 'solid',
                            marker: {
                                symbol: 'circle'
                            },
                            data: (function () {
                                return startData;
                            })()
                        },
                        {
                            name: '基准温度',
                            color: 'red',
                            dashStyle: 'solid',
                            marker: {
                                symbol: 'circle'
                            },
                            data: (function () {
                                return datumTempData;
                            })()
                        }]
                });
            });
    }

    function clearSwiper() {
        $scope.swiper = 0;
        $("div").remove(".swiper-slide");
    }
    
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.load($scope.mystorages[i],true);
            }
        }
    }, 30000);

});
