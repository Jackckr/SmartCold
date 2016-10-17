checkLogin();
var app = angular.module('app', []);
app.controller('analysisTemperature', function ($scope, $location, $http, $rootScope, $timeout) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
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
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                $scope.drawOverTemperature();
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

    $scope.goTransport = function () {
        window.location.href = 'analysisTransport.html?storageID=' + $scope.rdcId;
    }
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }
    $scope.goQuery = function () {
        window.location.href = 'analysisQuery.html?storageID=' + $scope.rdcId;
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawOverTemperature = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'ChaoWenShiJian'
            }
        }).success(function (data) {
            angular.forEach(data, function (storage, key) {
                xData = []
                yData = []
                var mainId = 'overTemperature' + key;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                var chart = echarts.init($('#' + mainId).get(0));
                angular.forEach(storage['ChaoWenShiJian'], function (item) {
                    xData.unshift(formatTime(item['date']).split(" ")[0])
                    yData.unshift(item['value'] / 60)
                })
                chart.setOption($scope.getEchartSingleOption("30日超温时间", xData, yData, "时间", "m", "超温时间", "bar"));
            })
        });
    }

    $scope.drawOverTemperatureYZ = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'ChaoWenYinZi,MaxTemp'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                yData1 = [];
                yData2 = [];
                xData = [];
                var mainId = 'overTemperatureYZ' + key;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                var chart = echarts.init($('#' + mainId).get(0));
                angular.forEach(storage['ChaoWenYinZi'], function (item, index) {
                    yData1.unshift(storage['ChaoWenYinZi'][index]['value'])
                    yData2.unshift(storage['MaxTemp'][index]['value'])
                    xData.unshift(formatTime(item['date']).split(" ")[0])
                })
                var option = {
                	backgroundColor: '#D2D6DE',
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 12          
                        }
                    },
                    title: {
                    	text: '30日超温时间因子',
                    	textStyle: {
                    		fontSize: 13,
                    		fontWeight: '400'
                    	}
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    legend: {
                        data: ['超温因子', '最高温度'],
                        y: 'bottom'
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
                            name: '超温因子(%)',
                            max: 100,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '最高温度(°C)',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '超温因子',
                            type: 'bar',
                            data: yData1
                        },
                        {
                            name: '最高温度',
                            type: 'line',
                            yAxisIndex: 1,
                            data: yData2
                        }
                    ]
                };
                chart.setOption(option);
            })
        })
    }

    $scope.drawBWYZ = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'BaoWenYinZi'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                xData = []
                yData = []
                var mainId = 'BWYZ' + key;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                var chart = echarts.init($('#' + mainId).get(0));
                angular.forEach(storage['BaoWenYinZi'], function (item) {
                    yData.unshift(item['value'])
                    xData.unshift(formatTime(item['date']).split(" ")[0])
                })
                chart.setOption($scope.getEchartSingleOption("30日保温因子τ趋势图", xData, yData, "保温因子", "τ", "τ", "bar"));
            })
        })
    }

    $scope.drawWDZQYZTemper = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'JiangWenYinZi,ShengWenYinZi'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                xData = []
                yData1 = []
                yData2 = []
                var mainId = 'WDZQYZ' + key;
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + mainId + '></div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
                var chart = echarts.init($('#' + mainId).get(0));
                angular.forEach(storage['JiangWenYinZi'], function (item, index) {
                    xData.unshift(formatTime(item['date']).split(" ")[0])
                    yData1.unshift(0 - storage['JiangWenYinZi'][index]['value'])
                    yData2.unshift(storage['ShengWenYinZi'][index]['value'])
                })
                var option = {
                	backgroundColor: '#D2D6DE',
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontSize: 12          
                        }
                    },
                    title: {
                    	text: '30日温度周期因子趋势图',
                    	textStyle: {
                    		fontSize: 13,
                    		fontWeight: '400'         
                        }
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    legend: {
                        data: ['降温因子', '升温因子'],
                        y:'bottom'
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
                            name: '温度因子',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    grid: {
                    	x: 50
                    },
                    series: [
                        {
                            name: '升温因子',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(255,67,80)'
                                }
                            },
                            data: yData2
                        },
                        {
                            name: '降温因子',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(135,206,250)'
                                }
                            },
                            data: yData1
                        }
                    ]
                };
                chart.setOption(option);
            })
        })
    }

    $scope.overTemperatureTemper = function () {
        clearSwiper();
        $scope.drawOverTemperature();
    }

    $scope.overTemperatureYZTemper = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawOverTemperatureYZ();
    }

    $scope.BWYZTemper = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawBWYZ();
    }

    $scope.WDZQYZTemper = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawWDZQYZTemper();
    }

    function clearSwiper() {
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
    }

    var formatTime = function (timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type) {
        var option = {
            backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12          
                }
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

    $scope.getEchartSingleOption = function (title, xData, yData, yName, yUnit, lineName, type, yMin) {
        var option = {
    		backgroundColor: '#D2D6DE',
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 12          
                }
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
                    min: yMin ? yMin : 0
                }
            ],
            grid: {
            	x:50
            },
            series: [
                {
                    name: lineName,
                    type: type,
                    data: yData,
                }
            ]
        };
        return option;
    }
});
