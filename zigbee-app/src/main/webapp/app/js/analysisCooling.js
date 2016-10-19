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
        var mainId1 = 'runningAll';
        var mainId2 = 'runningSingle';
        if ($scope.swiper < $scope.mystorages.length) {
            var innerHTML = '<div class="swiper-slide">' +
                '<div id=' + mainId1 + ' style="height:12rem;"></div>' +
                '<div id=' + mainId2 + ' style="height:12rem;"></div>' +
                '</div>';
            $("#chartView").last().append(innerHTML);
            $scope.swiper += 1;
        }
        var myChart1 = echarts.init(document.getElementById('runningAll'));
        var myChart2 = echarts.init(document.getElementById('runningSingle'));
        var option1 = {
            tooltip: {
                trigger: 'axis'
            },
            calculable: false,
            legend: {
                data: ['运行时长', '运行次数']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['2016-09-24', '2016-09-26', '2016-09-28', '2016-09-30', '2016-10-02', '2016-10-04', '2016-10-06', '2016-10-08', '2016-10-10', '2016-10-12', '2016-10-14', '2016-10-16']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '运行时长',
                    axisLabel: {
                        formatter: '{value} m'
                    }
                },
                {
                    type: 'value',
                    name: '运行次数'
                }
            ],
            series: [

                {
                    name: '运行时长',
                    type: 'bar',
                    data: [1012.0, 1014.9, 1017.0, 923.2, 1025.6, 976.7, 1035.6, 1062.2, 1032.6, 1020.0, 1016.4, 1013.3]
                },
                {
                    name: '运行次数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        var option2 = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['2016-09-24', '2016-09-26', '2016-09-28', '2016-09-30', '2016-10-02', '2016-10-04', '2016-10-06', '2016-10-08', '2016-10-10', '2016-10-12', '2016-10-14', '2016-10-16']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '运行平均时长',
                    axisLabel: {
                        formatter: '{value} m'
                    }
                }
            ],
            series: [
                {
                    name: '平均运行时长',
                    type: 'bar',
                    data: [502.0, 534.9, 487.0, 523.2, 425.6, 576.7, 635.6, 562.2, 332.6, 420.0, 526.4, 533.3]
                }
            ]
        };
        myChart1.setOption(option1);
        myChart2.setOption(option2);
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
                text: title
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
