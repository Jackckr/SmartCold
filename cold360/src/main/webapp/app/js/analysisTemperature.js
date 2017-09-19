checkLogin();
app.controller('analysisTemperature', function ($scope, $location,$timeout, $http, $rootScope, userService) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.showMap=new Object();
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
                findByRdcId(rootRdcId);
            }
        }
    });
    $scope.drawOverTemperatureTime = function() {
        var endTime = new Date(), startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'OverTempL1Time,OverTempL2Time,OverTempL3Time'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data, function (storage, key) {
                $timeout(function () {
                    xData = [], series = [], chartId = key + "_Chart";

                    if (storage.OverTempL1Time && storage.OverTempL2Time && storage.OverTempL3Time) {
                        var L1 = [], L2 = [], L3 = [], totaL1time = 0, totaL2time = 0, totaL3time = 0;
                        angular.forEach(storage.OverTempL1Time, function (item) {
                            xData.unshift(formatTime(item['date']).split(" ")[0]);
                            L1.unshift(item.value);
                            totaL1time += item.value;
                        });
                        angular.forEach(storage.OverTempL2Time, function (item) {
                            L2.unshift(item.value);
                            totaL2time += item.value;
                        });
                        angular.forEach(storage.OverTempL3Time, function (item) {
                            L3.unshift(item.value);
                            totaL3time += item.value;
                        });
                        series.push({name: '危险超温告警', type: 'bar', data: L1});
                        series.push({name: '严重超温告警', type: 'bar', data: L2});
                        series.push({name: '正常超温告警', type: 'bar', data: L2});
                        $scope.showMap.key = [L1.length, L2.length, L3.length];
                    }
                    if ($scope.swiper < $scope.mystorages.length) {
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">' + key + '</p>' +
                            '<div id=' + chartId + '></div><div class="box-body"><div class="clearfix text-center"> <div class="alert alert-danger col-xs-4 col-xs-4 col-xs-4"><p>危险告警:</p>'+$scope.showMap.key[0]+'次</div> <div class="alert alert-warning col-xs-4 col-xs-4 col-xs-4"><p>严重告警:</p>'+$scope.showMap.key[1]+'次</div> <div class="alert alert-info col-xs-4 col-xs-4 col-xs-4"><p>正常告警:</p>'+$scope.showMap.key[2]+'次</div> </div> </div>';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper += 1;
                    }
                    var chart = echarts.init($('#' + chartId).get(0));
                    angular.forEach(storage['ChaoWenYinZi'], function (item, index) {
                        yData1.unshift(storage['ChaoWenYinZi'][index]['value'])
                        yData2.unshift(storage['MaxTemp'][index]['value'])
                        xData.unshift(formatTime(item['date']).split(" ")[0])
                    });
                    var option = {
                        backgroundColor: '#D2D6DE',
                        tooltip: {
                            trigger: 'axis',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        legend: {data: ['危险超温告警', '严重超温告警', '正常超温告警']},
                        xAxis: [{type: 'category', data: xData}],
                        yAxis: [{type: 'value'}],
                        series: series
                    };
                    chart.setOption(option);
                }, 0);
            });
        });
    };
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
                // $scope.drawOverTemperature();
                $scope.initTemCount();
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

    $scope.goTransport = function () {
        window.location.href = 'analysisTransport.html?storageID=' + $scope.rdcId;
    }
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }
    $scope.goReport = function () {
        window.location.href = 'analysisReport.html?storageID=' + $scope.rdcId;
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawOverTemperature = function () {
        var endTime = new Date();
        var startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        $http.get(ER.coldroot + '/i/coldStorage/findAnalysisByRdcidKeysDate', {
            params: {
                "startTime": formatTime(startTime),
                "endTime": formatTime(endTime),
                "rdcid": $scope.rdcId,
                'keys': 'OverTempL1Time,OverTempL2Time,OverTempL3Time'
            }
        }).success(function (data) {
            $scope.data = data;
            angular.forEach(data,function(storage,key){
                $timeout(function(){
                    xData = [],series = [], chartId = key + "_Chart";
                    if(storage.OverTempL1Time&&storage.OverTempL2Time&&storage.OverTempL3Time){
                        var L1=[],L2=[],L3=[],totaL1time=0,totaL2time=0,totaL3time=0;
                        angular.forEach(storage.OverTempL1Time,function(item){xData.unshift(formatTime(item['date']).split(" ")[0]);L1.unshift(item.value);totaL1time+=item.value;});
                        angular.forEach(storage.OverTempL2Time,function(item){L2.unshift(item.value );totaL2time+=item.value;});
                        angular.forEach(storage.OverTempL3Time,function(item){L3.unshift(item.value);totaL3time+=item.value;});
                        series.push({name:'危险超温告警', type:'bar',  data:L1});
                        series.push({name:'严重超温告警', type:'bar',  data:L2});
                        series.push({name:'正常超温告警', type:'bar',  data:L2});
                        $scope.showMap.key=[totaL1time,totaL2time,totaL3time];
                    }

                    var option = {
                        backgroundColor: '#D2D6DE',
                        legend: {data:['危险超温告警','严重超温告警','正常超温告警']},
                        tooltip : { trigger: 'axis' },
                        toolbox: {
                            show : false,
                            feature : {  dataView : {show: true, readOnly: false}, magicType : {show: true, type: ['line', 'bar']},restore : {show: true}, saveAsImage : {show: true}}
                        },
                        calculable : true,
                        xAxis  : [{ type : 'category', data : xData}],
                        yAxis  : [{type : 'value' }],
                        series : series
                    };
                    var mainId = 'overTemperature' + key;
                    if ($scope.swiper < $scope.mystorages.length) {
                        var innerHTML = '<div class="swiper-slide">' +
                            '<p class="actually">' + key + '</p>' +
                            '<div id=' + mainId + '></div><div class="box-body"><div class="clearfix text-center"> <div class="alert alert-danger col-xs-4 col-xs-4 col-xs-4"><p>危险告警:</p>'+$scope.showMap.key[0]+'分钟</div> <div class="alert alert-warning col-xs-4 col-xs-4 col-xs-4"><p>严重告警:</p>'+$scope.showMap.key[1]+'分钟</div> <div class="alert alert-info col-xs-4 col-xs-4 col-xs-4"><p>正常告警:</p>'+$scope.showMap.key[2]+'分钟</div> </div> </div> ';
                        $("#chartView").last().append(innerHTML);
                        $scope.swiper += 1;
                    }
                    var chart = echarts.init($('#' + mainId).get(0));
                    chart.setOption(option);
                },0);
            });
        });
    };

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
                    		fontSize: ".75rem",
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
                    yData.unshift(item['value'].toFixed(2))
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
                    yData1.unshift(0 - storage['JiangWenYinZi'][index]['value'].toFixed(2))
                    yData2.unshift(storage['ShengWenYinZi'][index]['value'].toFixed(2))
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


    /*超温时间及次数*/
    $scope.endTime = new Date();
    $scope.startTime = new Date($scope.endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
    $scope.sumDatavalue={};
    $scope.initTemCount=function(){
        clearSwiper();
        $scope.swiper = 0;
        angular.forEach($scope.mystorages,function(storage){
            var chartId="Chart_"+storage.id;
            if ($scope.swiper < $scope.mystorages.length) {
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">' + storage.name + '&nbsp;&nbsp;超温时长及次数统计</p>' +
                    '<div id=' + chartId + '></div></div>';
                $("#chartView").last().append(innerHTML);
                $scope.swiper += 1;
            }
            $scope.overTempAndCount(storage);
        });
    };
    $scope.overTempAndCount=function (storage) {
        $http.get(ER.coldroot+'/i/AnalysisController/getAnalysisDataByKey',
            { params: {type:1, oid:storage.id, keys:'ChaoWenShiJian,ChaoWenCiShu', startTime:formatTime($scope.startTime), endTime:formatTime($scope.endTime)}}).success(function (data) {
            var val=0, ccount=0,ctime=0;
            var otlist=	data['ChaoWenShiJian'],oclist=	data['ChaoWenCiShu'];
            var xAxis=[],count=[],time=[],tempct=new Object();
            if(oclist.length>0){
                angular.forEach(oclist,function(item,index){
                    tempct[item['date']]=item['value'];
                });
            }
            if(otlist.length>0){
                angular.forEach(otlist,function(item,index){
                    val=parseFloat((item['value'] / 60).toFixed());ctime+=val;
                    xAxis.unshift(formatTime(item['date']).split(" ")[0]);
                    if( tempct[item['date']]){
                        ccount+= tempct[item['date']];
                        count.unshift( tempct[item['date']]);
                    }else{
                        count.unshift(val>0?1:0);
                    }
                    time.unshift(val);
                });
            }
            $scope.sumDatavalue[storage.id]=[ccount,ctime];
            $scope.dwoverTempAndCount("Chart_"+storage.id, xAxis, count, time);
        });
    };
    $scope.dwoverTempAndCount=function(emid,xAxis,count,time){
        var option={
            tooltip : { trigger: 'axis' ,textStyle: { fontSize: 12 }},
            backgroundColor: '#D2D6DE',
            calculable : true,
            grid: {x: 40,y: 40,width: '76%'},
            legend: { data:['超温时间','超温次数'],y:'bottom' },
            xAxis : [ { type : 'category', data : xAxis }  ],
            yAxis : [ { type : 'value',name : '超温时间(分钟)', max : 1500 }, { type : 'value', name : '超温次数(次)' } ],
            series :[ {name:'超温时间', type:'bar', data:time, tooltip: {  valueSuffix: '分钟' }}, {name:'超温次数', type:'line', yAxisIndex: 1, data:count,tooltip: {  valueSuffix: ' 次'}  } ]
        };
        var chart = echarts.init(document.getElementById(emid));
        chart.setOption(option);
    };
    /*超温时间及次数 end*/
    /*超温比例*/
    $scope.initTemScore=function(){
        clearSwiper();
        $scope.swiper = 0;
        $scope.overTempScore();
    };
    $scope.overTempScore = function(chartId){
        $scope.showMap = {};
        $http.get(ER.coldroot+'/i/coldStorage/findAnalysisByRdcidKeysDate',{
            params: {
                "startTime": formatTime($scope.startTime),
                "endTime": formatTime($scope.endTime),
                "rdcid": $scope.rdcId,
                'keys':'ChaoWenYinZi,MaxTemp'
            }
        }).success(function(data){
            $scope.data = data;
            angular.forEach($scope.mystorages,function(storage){
                var mainId=storage.name+"Chart";
                if ($scope.swiper < $scope.mystorages.length) {
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">' + storage.name + '&nbsp;&nbsp;30日超温比例统计</p>' +
                        '<div id=' + mainId + '></div></div>';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper += 1;
                }
            });
            angular.forEach(data,function(storage,key){
                $timeout(function(){
                    yData1 = []; yData2 = []; xData = [];
                    var chartId = key + "Chart";
                    var chart = echarts.init(document.getElementById(chartId));
                    $scope.showMap[chartId] = storage['ChaoWenYinZi'].length || storage['MaxTemp'].length;

                    angular.forEach(storage['ChaoWenYinZi'],function(item,index){
                        yData1.unshift(storage['ChaoWenYinZi'][index]['value'])
                        yData2.unshift(storage['MaxTemp'][index]['value'])
                        xData.unshift(formatTime(item['date']).split(" ")[0])
                    });
                    option = {
                        tooltip : { trigger: 'axis' ,textStyle: { fontSize: 12 }},
                        backgroundColor: '#D2D6DE',
                        calculable : true,
                        grid: {x: 35,x2: 35,y: 40,width: '78%'},
                        legend: { data:['超温比例','最高温度'],y:'bottom' },
                        xAxis : [  {type : 'category',  data : xData} ],
                        yAxis : [  {type : 'value', name : '超温比例/%', max : 100, axisLabel : {  formatter: '{value}' } },{ type : 'value',name : '最高温度/°C', axisLabel : {formatter: '{value}' } }],
                        series: [  { name:'超温比例', type:'bar', data:yData1}, { name:'最高温度', type:'line', yAxisIndex: 1, data:yData2 } ]
                    };
                    chart.setOption(option);
                })
            },0)
        })
    };
    /*超温比例 end*/
    $scope.overTemperatureTemper = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawOverTemperature();
    };
    $scope.overTemperatureTime = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.drawOverTemperatureTime();
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
    console.log(rootRdcId)
    console.log($scope.rdcId)
});
