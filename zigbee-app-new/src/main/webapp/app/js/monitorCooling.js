checkLogin();
app.controller('monitorCooling', function ($scope, $location, $http, $rootScope, userService) {
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
                	initAllByRdcId(window.localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.initCompressorPressure($scope.rdcId);
                }
            } else {
            	initAllByRdcId(rootRdcId);
                findByRdcId(rootRdcId);
            }
        }
    });

    function findByRdcId(rootRdcId) {
        $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
            $scope.currentRdc = data[0];
            $scope.rdcName =  data[0].name;
            $scope.rdcId =  data[0].id;
            $scope.initCompressorPressure($scope.rdcId);
        });
    }

    $scope.viewStorage = function () {
        for (var i = 0; i < $scope.compressorGroups.length; i++) {
            $scope.drawCompressorPressure($scope.compressorGroups[i]);
        }
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
        $scope.initCompressorPressure(rdc.id);
        initAllByRdcId(rdc.id);
    }

    $scope.goTempture = function () {
        window.location.href='cold360.html?storageID=' + $scope.rdcId;
    }
    $scope.goElectric = function () {
        window.location.href='monitorElectric.html?storageID=' + $scope.rdcId;
    }
    $scope.goFacility = function () {
        window.location.href='monitorFacility.html?storageID=' + $scope.rdcId;
    }
    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.initCompressorPressure = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        // 初始化压缩机组
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.compressorGroups = data;
                $scope.viewStorage();
                angular.forEach($scope.compressorGroups, function (item) {
                    $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(
                        function (data) {
                            item.compressors = data;
                        })
                })
            })
    }

    $scope.drawCompressorPressure = function (compressor) {
        var compressorID = compressor.id;
        var data = [];
        $http.get(ER.coldroot + "/i/compressorGroup/findPressByNums", {
            params: {
                "compressorID": compressorID
            }
        }).success(function (result) {
            var compressorsImg = '';
            if ($scope.swiper < $scope.compressorGroups.length) {
                $http.get(ER.coldroot + "/i/compressorGroup/findCompressorState?compressorGroupId=" + compressorID).success(function (data) {
                    var compressors = data;
                    if (compressors.length > 0) {
                        for (var i = 0; i < compressors.length; i++) {
                            compressorsImg += '<div class="runImg" style="">';
                            if (compressors[i].type == 1 && compressors[i].keyValues.isRunning == 1) {
                                compressorsImg += '<img src="../com/img/pressure1_run.png">&nbsp;';
                            }
                            if (compressors[i].type == 1 && compressors[i].keyValues.isRunning == 0) {
                                compressorsImg += '<img src="../com/img/pressure1_stop.png">&nbsp;';
                            }
                            if (compressors[i].type == 2 && compressors[i].keyValues.isRunning == 1) {
                                compressorsImg += '<img src="../com/img/pressure2_run.png">&nbsp;';
                            }
                            if (compressors[i].type == 2 && compressors[i].keyValues.isRunning == 0) {
                                compressorsImg += '<img src="../com/img/pressure2_stop.png">&nbsp;';
                            }
                            compressorsImg += '<label>' + compressors[i].name + '</label></div>';
                        }
                    }
                    var mainId = "pressureChart" + compressorID;
                    var barId = "#" + mainId;
                    if ($scope.swiper < $scope.compressorGroups.length) {
                        var title = '<p class="pressureImg"><img src="../com/img/run.png"/> 运行 <img src="../com/img/stop.png"/> 停止</p>';
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">' + compressor.name + '</p>' +
                            '<div id=' + mainId + '></div>' +
                            title +
                            compressorsImg +
                            '</div>';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper += 1;
                    }

                    var data = result;
                    var lowPress = data.lowPress.length > 0 ? data.lowPress[0].value : 0;
                    var highPress = data.highPress.length > 0 ? data.highPress[0].value : 100;
                    var pressureChart = echarts.init($(barId).get(0));

                    var dataStyle = {
                        normal: {
                            label: {show: false},
                            labelLine: {show: false}
                        }
                    };
                    var placeHolderStyle = {
                        normal: {
                            color: 'rgba(0,0,0,0)',
                            label: {show: false},
                            labelLine: {show: false}
                        },
                        emphasis: {
                            color: 'rgba(0,0,0,0)'
                        }
                    };
                    var pressureOption = {
                        title: {
                            text: '压力监控',
                            x: 'center',
                            y: 'center',
                            itemGap: 20,
                            textStyle: {
                                color: 'rgba(30,144,255,0.8)',
                                fontFamily: '微软雅黑',
                                fontSize: 25,
                                fontWeight: 'bolder'
                            }
                        },
                        tooltip: {
                            show: true,
                            formatter: "{b} ({d}%)",
                            textStyle: {
                            	fontSize: 12
                            }
                        },
                        legend: {
                            orient: 'horizontal',
                            x: 'center',
                            y: 20,
                            textStyle: {
                            	fontSize: 14
                            },
                            itemGap: 12,
                            data: ['高压' + parseFloat(highPress).toFixed(0)+'kpa', '低压' + parseFloat(lowPress).toFixed(0)+'kpa']
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        series: [
                            {
                                name: '高压压力',
                                type: 'pie',
                                clockWise: false,
                                radius: [70, 90],
                                itemStyle: dataStyle,
                                data: [
                                    {
                                        value: parseInt(highPress / 20),
                                        name: '高压' + parseFloat(highPress).toFixed(0)+'kpa'
                                    },
                                    {
                                        value: 100 - parseInt(highPress / 20),
                                        name: '高压可用:' + (2000 - parseInt(highPress)+'kpa'),
                                        itemStyle: placeHolderStyle
                                    }
                                ]
                            },
                            {
                                name: '低压压力',
                                type: 'pie',
                                clockWise: false,
                                radius: [50, 70],
                                itemStyle: dataStyle,
                                data: [
                                    {
                                        value: parseInt(lowPress / 20),
                                        name: '低压' + parseFloat(lowPress).toFixed(0)+'kpa'
                                    },
                                    {
                                        value: 100 - parseInt(lowPress / 20),
                                        name: '高压可用:' + (2000 - parseInt(lowPress).toFixed(0)+'kpa'),
                                        itemStyle: placeHolderStyle
                                    }
                                ]
                            }
                        ]
                    };
                    pressureChart.setOption(pressureOption);
                })
            }


        })
    }

    $scope.drawCondensation = function (compressor) {
        $http.get(ER.coldroot + "/i/evaporative/findInfoByGroupId?groupId=" + compressor.id).success(
            function (data) {
                var evaporative = data;
                var img = '';
                if (evaporative.evaWater && evaporative.evaWater.isRunning) {
                    img = '<img alt="" src="../com/img/evawater_run1.png" class="myImg1">';
                }
                if (!evaporative.evaWater || !evaporative.evaWater.isRunning) {
                    img = '<img alt="" src="../com/img/evawater_stop.png" class="myImg1">';
                }
                var evaBlowersImg = '';
                if (evaporative.evaBlowers.length > 0) {
                    for (var i = 0; i < evaporative.evaBlowers.length; i++) {
                        evaBlowersImg += '<div style="margin-top:10px;float:left;width:33%;">';
                        if (evaporative.evaBlowers[i].isRunning == 1) {
                            evaBlowersImg += '<img src="../com/img/evablower_run1.png" class="myImg2">';
                        }
                        if (evaporative.evaBlowers[i].isRunning == 0) {
                            evaBlowersImg += '<img src="../com/img/evablower_stop.png" class="myImg2">';
                        }
                        evaBlowersImg += '<label style="font-size:.7rem;">' + evaporative.evaBlowers[i].name + '</label></div>';
                    }
                }
                if ($scope.swiper < $scope.compressorGroups.length) {
                    var title = '<p class="evawaterP"><img src="../com/img/run.png"/> 运行 <img src="../com/img/stop.png"/> 停止</p>';
                    var innerHTML = '<div class="swiper-slide evawater">' +
                        '<p class="actually">' + compressor.name + '</p>' +
                        img +
                        title +
                        evaBlowersImg +
                        '</div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }

            })
    }

    $scope.coldCnt = 0;
    $scope.defrostCnt = 0;
    $scope.freeCnt = 0;
    $scope.drawCompressorBlower = function () {
        $http.get(ER.coldroot + '/i/compressorBlower/findByRdcId', {
            params: {
                "rdcId": $scope.rdcId
            }
        }).success(function (result) {
            $scope.blowers = result;
            var coldCnt = 0;
            var defrostCnt = 0;
            var freeCnt = 0;

            var coldDetails = '';
            var defrostDetails = '';
            var freeDetails = '';
            for (var i = 0; i < result.length; i++) {
                result[i].runTime = parseFloat(result[i].runTime / 3600).toFixed(2)
                result[i].defrostTime = parseFloat(result[i].defrostTime / 3600).toFixed(2)
                if (parseInt(result[i].isRunning) === 1) {
                    coldCnt = coldCnt + 1;
                    if (coldDetails == '') {
                        coldDetails += result[i].blowerId
                    } else {
                        coldDetails += '/' + result[i].blowerId;
                    }
                }
                if (parseInt(result[i].isDefrosting) === 1) {
                    defrostCnt = defrostCnt + 1;
                    if (defrostDetails == '') {
                        defrostDetails += result[i].blowerId;
                    } else {
                        defrostDetails += '/' + result[i].blowerId;
                    }
                }
                if (parseInt(result[i].isRunning) === 0 && parseInt(result[i].isDefrosting) === 0) {
                    freeCnt = freeCnt + 1;
                    if (freeDetails == '') {
                        freeDetails += result[i].blowerId
                    } else {
                        freeDetails += '/' + result[i].blowerId;
                    }
                }
            }

            $scope.coldCnt = coldCnt;
            $scope.defrostCnt = defrostCnt;
            $scope.freeCnt = freeCnt;

            if ($scope.swiper < 1) {
                var innerHTML = '<div class="swiper-slide">' +
                    '<div class="zhengFaSys"> ' +
                    '<span class="info-box-icon bg-green">' +
                    '<i class="fa fa-life-ring bg-green"></i></span> ' +
                    '<div class="info-box-content"> ' +
                    '<span class="info-box-text"><span>制冷&nbsp;</span><span>' + $scope.coldCnt + '</span></span> ' +
                    '<p class="fengji"><span>风机:</span>'+coldDetails+'</p>' +
                    '</div></div>' +
                    '<div class="zhengFaSys"> ' +
                    '<span class="info-box-icon bg-yellow">' +
                    '<i class="fa fa-life-ring bg-yellow"></i></span> ' +
                    '<div class="info-box-content"> ' +
                    '<span class="info-box-text"><span>化霜&nbsp;</span><span>' + $scope.defrostCnt + '</span></span> ' +
                    '<p class="fengji"><span>风机:</span>'+defrostDetails+'</p>' +
                    '</div></div>' +
                    '<div class="zhengFaSys"> ' +
                    '<span class="info-box-icon bg-red">' +
                    '<i class="fa fa-life-ring bg-red"></i></span> ' +
                    '<div class="info-box-content"> ' +
                    '<p><span class="info-box-text"><span>待机&nbsp;</span><span>' + $scope.freeCnt + '</span></span></p>' +
                    '<p class="fengji"><span>风机:</span>'+freeDetails+'</p>' +
                    '</div></div>' +
                    '</div> ';
                $("#chartView").last().append(innerHTML);
                if($scope.coldCnt>0){
                	$(".fa-life-ring.bg-green").addClass("running")
                }
                $scope.swiper += 1;
            }
        })
    }

    $scope.drawExhaustTemper = function (compressor) {
        $http.get(ER.coldroot + '/i/baseInfo/getKeyValueData', {
            params: {
                "oid": compressor.id,
                type: 3,
                key: 'liquidLevel',
                nums: 1
            }
        }).success(function (data) {
            var result = data;
            $http.get(ER.coldroot + "/i/compressorGroup/findCompressorState?compressorGroupId=" + compressor.id).success(function (data) {
                var compressors = data;

                var mainfloatId = "floatPressureChart" + compressor.id;
                var floatId = "#" + mainfloatId;
                var mainexTempId = "exTemperChart" + compressor.id;
                var exTempId = "#" + mainexTempId;
                if ($scope.swiper < $scope.compressorGroups.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + compressor.name + '</p>' +
                        '<div id=' + mainfloatId + ' style="min-height:10rem;margin-bottom:0.3rem;"></div>' +
                        '<div id=' + mainexTempId + ' style="height: 10rem;"></div>' +
                        '</div>';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }

                // 液位计
                var liquidValue = result.length > 0 ? parseFloat(result[0].value.toFixed(1)) : 0;
                $(function () {
                    $(floatId).highcharts({
                        chart: {
                            type: 'column',
                            margin: [50, 50, 50, 80],
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
                            text: '液位',
                            itemGap: 20,
                            y:20,
                            style: {
                                color: 'rgba(30,144,255,0.8)',
                                fontFamily: '微软雅黑',
                                fontSize: ".7rem",
                                fontWeight: 'bolder'
                            }
                        },
                        xAxis: {
                            categories: [
                                '液位'
                            ]
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Level (mm)'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            pointFormat: 'Level is: <b>{point.y:.1f} mm</b>',
                            textStyle: {
                            	fontSize: 12
                            }
                        },
                        credits: {
                            enabled: false // 禁用版权信息
                        },
                        series: [{
                            name: 'Level',
                            data: [liquidValue],
                            dataLabels: {
                                enabled: true,
                                rotation: -90,
                                color: '#FFFFFF',
                                align: 'right',
                                x: 4,
                                y: 10,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif',
                                    textShadow: '0 0 3px black'
                                }
                            }
                        }]
                    });
                });

                // 排气温度
                var exTempChart = echarts.init($(exTempId).get(0));
                var yData = {high: [], low: [], temp: []}
                var xData = []
                angular.forEach(compressors, function (compressor) {
                    xData.push(compressor.name);
                    temp = [{key: 'high', value: compressor.highTemp},
                        {key: 'low', value: compressor.lowTemp},
                        {key: 'temp', value: compressor.keyValues.exTemp}]
                    temp.sort(function (a, b) {
                        return b.value - a.value
                    })
                    yData[temp[0].key].push(temp[0].value - temp[1].value)
                    yData[temp[1].key].push(temp[1].value - temp[2].value)
                    yData[temp[2].key].push(temp[2].value)
                })

                var option = {
                	backgroundColor: '#D2D6DE',
                    legend: {
                        data: ['高温警戒线', '低温警戒线', '当前温度'],
                        align: 'left',
                        left: 10,
                        y:'bottom'
                    },
                    grid: {
                    	x:30,
                    	y:20,
                    	width:'75%'
                    },
                    tooltip: {
                        textStyle: {
                        	fontSize: 12
                        }},
                    xAxis: {
                        data: xData,
                        name: '压缩机',
                        silent: false
                    },
                    yAxis: {
                    	name:'温度(℃)',
                        inverse: true,
                        splitArea: {show: false}
                    },
                    series: [
                        {
                            name: '低温警戒线',
                            type: 'bar',
                            stack: 'one',
                            data: yData.low
                        },
                        {
                            name: '当前温度',
                            type: 'bar',
                            stack: 'one',
                            data: yData.temp
                        },
                        {
                            name: '高温警戒线',
                            type: 'bar',
                            stack: 'one',
                            data: yData.high
                        }
                    ]
                };
                exTempChart.setOption(option)
            })
        })
    }

    $scope.activeEnergy = 'compressorPressure';
    $scope.compressorPressureOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'compressorPressure';
        if ($scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawCompressorPressure($scope.compressorGroups[i]);
            }
        }
    }

    $scope.condensationOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'condensation';
        if ($scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawCondensation($scope.compressorGroups[i]);
            }
        }
    }

    $scope.compressorBlowerOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'compressorBlower';
        $scope.drawCompressorBlower();
    }

    $scope.exhaustTemperOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'exhaustTemper';
        if ($scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawExhaustTemper($scope.compressorGroups[i]);
            }
        }
    }

    function clearSwiper() {
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
    }

    function formatTime(timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "")
        }
    }

    function formatTimeToDay(timeString){
        return formatTime(timeString).substring(0,10)
    }

    $scope.creatOption = function (title, xData, yData, yName, yUnit, lineName, type) {
        var option = {
            tooltip: {
                trigger: 'axis',
                textStyle: {
                	fontSize: 12
                }
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
        if ($scope.activeEnergy == 'compressorPressure' && $scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawCompressorPressure($scope.compressorGroups[i]);
            }
        }
        if ($scope.activeEnergy == 'condensation' && $scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawCondensation($scope.compressorGroups[i]);
            }
        }
        if ($scope.activeEnergy == 'compressorBlower') {
            $scope.drawCompressorBlower();
        }
        if ($scope.activeEnergy == 'exhaustTemper' && $scope.compressorGroups && $scope.compressorGroups.length > 0) {
            for (var i = 0; i < $scope.compressorGroups.length; i++) {
                $scope.drawExhaustTemper($scope.compressorGroups[i]);
            }
        }
    }, 30000);
});
