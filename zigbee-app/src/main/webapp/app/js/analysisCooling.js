checkLogin();
var app = angular.module('app', []);
app.controller('analysisCooling', function ($scope, $location, $http, $rootScope, $timeout) {
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
                $scope.drawCoolingAnalysis();
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

    $scope.goTemperature = function () {
        window.location.href = 'analysis.html?storageID=' + $scope.rdcId;
    }
    $scope.goTransport = function () {
        window.location.href = 'analysisTransport.html?storageID=' + $scope.rdcId;
    }
    $scope.goQuery = function () {
        window.location.href = 'analysisQuery.html?storageID=' + $scope.rdcId;
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawCoolingAnalysis = function () {
        $http.get(ER.coldroot + '/i/AnalysisController/getCoolingAnalysis', {params: {rdcId: $scope.rdcId}}).success(function (data) {
            if (data.success) {
                Highcharts.setOptions({colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']});
                var mainId = 'coolingSys';
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">制冷系统运行效率趋势</p>' +
                    '<div id=' + mainId + ' style="height:350px"></div> ';
                $("#chartView").last().append(innerHTML);

                $('#' + mainId).highcharts({
                    chart: {backgroundColor: '#D2D6DE', plotBackgroundColor: "#D2D6DE"},
                    title: {text: '', x: -20}, credits: {enabled: false},
                    xAxis: {categories: data.entity.xdata},
                    yAxis: {
                        title: {text: ''},
                        gridLineColor: '#808080',
                        plotLines: [{value: 0, width: 1, color: '#808080'}]
                    },
                    legend: {layout: 'horizontal', align: 'center', borderWidth: 0},
                    series: data.entity.chdata
                });
            } else {
                alert(data.message);
            }
        });
    }

    $scope.drawWarnCount = function () {
        var innerHTML = '<div class="swiper-slide">' +
            '<p class="actually">制冷告警统计</p>' +
            '<table class="cold_warn">' +
            '<tbody>' +
            '<tr><th colspan="3">高危报警统计</th> </tr>' +
            '<tr> <td></td> <td>上月累计次数</td> <td>本月累计次数</td> </tr>' +
            '<tr> <td>高压报警</td> <td><i>0</i></td> <td><i>0</i></td> </tr> <tr>' +
            '<td>电源报警</td> <td><i>0</i></td> <td><i>0</i></td> </tr>' +
            '<tr> <td>缺油报警</td> <td><i>0</i></td> <td><i>0</i></td> </tr>' +
            '<tr><th colspan="3">常规报警统计</th></tr>' +
            '<tr> <td></td> <td>上月累计次数</td> <td>本月累计次数</td>' +
            '</tr> <tr> <td>常规报警</td> <td><i>0</i></td> <td><i>0</i></td> </tr>' +
            '</tbody></table>' +
            '</div> ';
        $("#chartView").last().append(innerHTML);
        $http.get(ER.coldroot + '/i/warn/getWarncoldAnalysis', {params: {rdcId: $scope.rdcId}}).success(function (data) {
            if (data.success) {

            } else {
                //alert(data.message);
            }
        });
    }

    $scope.drawRunAnalysis = function () {

        $scope.showMap = {}
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/compressor/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcId": $scope.rdcId,
                'keys': 'RunningTime,RunningCount'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                $timeout(function () {
                    xData = []
                    yData1 = []
                    yData2 = []
                    yData3 = []
                    var chartId = key + "Chart"
                    var chartId1 = chartId + "1";
                    var chartId2 = chartId + "2";

                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + key + '</p>' +
                        '<div id=' + chartId1 + ' style="min-height:14rem;margin-bottom:.3rem;"></div>' +
                        '<div id=' + chartId2 + ' style="height: 14rem;"></div>' +
                        '</div>';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;

                    var chart1 = echarts.init(document.getElementById(chartId1));
                    var chart2 = echarts.init(document.getElementById(chartId2));
                    $scope.showMap[chartId + '1'] = storage['RunningTime'].length
                    $scope.showMap[chartId + '2'] = storage['RunningTime'].length
                    angular.forEach(storage['RunningTime'], function (item, index) {
                        xData.unshift(formatTime(item['date']).split(" ")[0])
                        yData1.unshift((item['value'] / 60).toFixed(2))
                        yData2.unshift(storage['RunningCount'][index].value)
                        yData3.unshift(
                            storage['RunningCount'][index].value == 0 ? 0 : item['value'] / storage['RunningCount'][index].value / 60
                        )
                    })
                    var option = {
                        backgroundColor: '#D2D6DE',
                        title: {
                            text: '近30日累积运行总时长及日运行次数',
                            textStyle: {
                                fontSize: 13,
                                fontWeight: 'normal'
                            },
                        },
                        tooltip: {
                            trigger: 'axis',
                            textStyle: {
                                fontSize: 12      // 主标题文字颜色
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
                            data: ['运行时长', '运行次数'],
                            y: 'bottom'
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: xData
                            }
                        ],
                        grid:{
                        	x:45
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '运行时长(m)',
                                max: 1500,
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            },
                            {
                                type: 'value',
                                name: '运行次数',
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '运行时长',
                                type: 'bar',
                                data: yData1
                            },
                            {
                                name: '运行次数',
                                type: 'line',
                                yAxisIndex: 1,
                                data: yData2
                            }
                        ]
                    };
                    chart1.setOption(option)
                    chart2.setOption($scope.getEchartSingleOption("近30日日平均运行时长", xData, yData3, "平均运行时间", "m", "m", "bar"))
                }, 0)
            })
        })
    }

    $scope.goEffectAnalysis = function () {
        clearSwiper();
        $scope.drawCoolingAnalysis();
    }

    $scope.goWarnCount = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawWarnCount();
    }

    $scope.goRunAnalysis = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawRunAnalysis();
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
                    fontWeight: 'normal'
                },
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            grid:{
            	x:45
            },
            yAxis: [
                {
                    type: 'value',
                    name: yName + "(" + yUnit + ")",
                    min: yMin ? yMin : 0
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
        return option;
    }
});
