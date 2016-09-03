checkLogin();
var app = angular.module('app', []);
app.controller('otherMonitor', function ($scope, $location, $http, $rootScope, $sce) {
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    //if (window.user.roleid == 3); 超管特殊处理
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            $scope.rdcId = $scope.storages[0].id;
            $scope.viewStorage($scope.rdcId);
            $scope.initCompressorPressure($scope.rdcId);
        }
    });

    $scope.viewStorage = function (rdcId) {
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.drawInOutGoods($scope.mystorages[i]);
                }
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.swiper = 0;
    $scope.defaltswiper = 0;

    $scope.drawInOutGoods = function(storage){
        var mainId = "barChart" + storage.id;
        var barId = "#" + mainId;
        if ($scope.swiper < $scope.mystorages.length){
            var innerHTML = '<div class="swiper-slide">' +
                '<p class="actually">'+storage.name+'</p>' +
                '<div id='+mainId+'></div> ';
            $("#chartView").last().append(innerHTML);
            $scope.swiper +=1;
        }
        var barChart = echarts.init($(barId).get(0));
        var frozenIn = [];
        var frozenOut = [];
        var freshIn = [];
        var freshOut = [];
        var frozenTemp = [];
        var freshTemp = [];
        var time = [];
        var url = ER.coldroot + "/i/other/findGoodsByDate?coldstorageId=" + storage.id +
            "&startCollectionTime=" + getFormatTimeString(-10 * 24 * 60 * 60 * 1000) + "&endCollectionTime=" + getFormatTimeString()
        $http.get(url).success(function(data){
            angular.forEach(data,function(item){
                frozenIn.push(item.frozenInputQuantity);
                frozenOut.push(item.forzenOutputQuantity);
                freshIn.push(item.freshIutputQuantity);
                freshOut.push(item.freshOutputQuantity);
                frozenTemp.push(item.frozenInputTemperature);
                freshTemp.push(item.freshInputTemperature);
                time.push(formatTime(item.collectionTime));
            })
            barOption = {
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                legend: {
                    data:['冻品进货量','冻品发货量','鲜品进货量','鲜品发货量','冻品进货温度','鲜品进货温度']
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
                        name : '货物量',
                        axisLabel : {
                            formatter: '{value} kg'
                        }
                    },
                    {
                        type : 'value',
                        name : '温度',
                        axisLabel : {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series : [
                    {
                        name:'冻品进货量',
                        type:'bar',
                        data:frozenIn
                    },
                    {
                        name:'冻品发货量',
                        type:'bar',
                        data:frozenOut
                    },
                    {
                        name:'鲜品进货量',
                        type:'bar',
                        data:freshIn
                    },
                    {
                        name:'鲜品发货量',
                        type:'bar',
                        data:freshOut
                    },
                    {
                        name:'冻品进货温度',
                        type:'line',
                        yAxisIndex: 1,
                        data:frozenTemp
                    },
                    {
                        name:'鲜品进货温度',
                        type:'line',
                        yAxisIndex: 1,
                        data:freshTemp
                    }
                ]
            };
            barChart.setOption(barOption);
        })
    }

    $scope.initCompressorPressure = function(rdcId){
        // 初始化压缩机组
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.compressorGroups = data;
                angular.forEach($scope.compressorGroups, function (item) {
                    $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(
                        function (data) {
                            item.compressors = data;
                        })
                })
            })
    }

    $scope.drawCompressorPressure = function(compressor){
        var compressorID = compressor.id;
        var data = [];
        $http.get(ER.coldroot + "/i/compressorGroup/findPressByNums", {
            params: {
                "compressorID": compressorID
            }
        }).success(function (result) {
            var mainId = "pressureChart" + compressorID;
            var barId = "#" + mainId;
            if ($scope.swiper < $scope.compressorGroups.length){
                var innerHTML = '<div class="swiper-slide">' +
                    '<p class="actually">'+compressor.name+'</p>' +
                    '<div id='+mainId+'></div> ';
                $("#chartView").last().append(innerHTML);
                $scope.swiper +=1;
            }

            var data = result;
            var lowPress = data.lowPress.length>0?data.lowPress[0].value:0;
            var highPress = data.highPress.length>0?data.highPress[0].value:100;
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
                    formatter: "{b} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    x: 30,
                    y: 250,
                    itemGap: 12,
                    data: ['高压' + parseFloat(highPress).toFixed(0), '低压' + parseFloat(lowPress).toFixed(0)]
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
                                name: '高压' + parseFloat(highPress).toFixed(0)
                            },
                            {
                                value: 100 - parseInt(highPress / 20),
                                name: '高压可用:' + (2000 - parseInt(highPress)),
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
                                name: '低压' + parseFloat(lowPress).toFixed(0)
                            },
                            {
                                value: 100 - parseInt(lowPress / 20),
                                name: '高压可用:' + (2000 - parseInt(lowPress).toFixed(0)),
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            };
            pressureChart.setOption(pressureOption);
        })
        //$http.get("/i/compressorGroup/findCompressorState?compressorGroupId=" + compressorID).success(
        //    function(data){
        //        $scope.compressors = data;
        //        $scope.exTemp(data);
        //    })

        //
        //$http.get('/i/baseInfo/getKeyValueData', {
        //    params: {
        //        "oid": compressorID,
        //        type:3,
        //        key:'liquidLevel',
        //        nums:1
        //    }
        //}).success(function(data){
        //    var liquidValue = data.length > 0?parseFloat(data[0].value.toFixed(1)):0;
        //    $scope.liquidMonitor(liquidValue);
        //})
    }

    $scope.drawCondensation = function(compressor){
        $http.get(ER.coldroot + "/i/evaporative/findInfoByGroupId?groupId=" + compressor.id).success(
            function(data){
                var evaporative = data;
                var img = '';
                if (evaporative.evaWater && evaporative.evaWater.isRunning) {
                    img = '<img alt="" src="../../com/img/evawater_run.png" style="margin-top:10px;" class="myImg">';
                }
                if (!evaporative.evaWater || !evaporative.evaWater.isRunning) {
                    img = '<img alt="" src="../../com/img/evawater_stop.png" style="margin-top:10px;" class="myImg">';
                }
                var evaBlowersImg = '';
                if (evaporative.evaBlowers.length > 0) {
                    for (var i = 0; i < evaporative.evaBlowers.length; i++) {
                        evaBlowersImg += '<div style="margin-top:10px;float:left;" class="text-center">';
                        if (evaporative.evaBlowers[i].isRunning==1){
                            evaBlowersImg += '<img src="../../com/img/evablower_run.png" style="float:left;width: 50px;height: 50px;" class="myImg">';
                        }
                        if (evaporative.evaBlowers[i].isRunning==0) {
                            evaBlowersImg += '<img src="../../com/img/evablower_stop.png" style="float:left;width: 50px;height: 50px;" class="myImg">';
                        }
                        evaBlowersImg += '<label>' + evaporative.evaBlowers[i].name + '</label></div>';
                    }
                }
                if ($scope.swiper < $scope.compressorGroups.length){
                    var innerHTML = '<div class="swiper-slide">' +
                        '<p class="actually">'+compressor.name+'</p>' +
                        '<img src="../../com/img/eva_run.png" style="height: 12px;width: 20px;"/> 运行 <img src="../../com/img/stop.png" style="height: 12px;width: 20px;"/> 停止' +
                        img +
                        evaBlowersImg +
                        '</div> ';
                    $("#chartView").last().append(innerHTML);
                    $scope.swiper +=1;
                }

            })
    }

    $scope.coldCnt = 0;
    $scope.defrostCnt = 0;
    $scope.freeCnt = 0;
    $scope.drawCompressorBlower = function() {
        $http.get(ER.coldroot + '/i/compressorBlower/findByRdcId', {
            params: {
                "rdcId": $scope.rdcId
            }
        }).success(function (result) {
            $scope.blowers = result;
            var coldCnt =0;
            var defrostCnt = 0;
            var freeCnt = 0;
            for (var i = 0; i < result.length; i++) {
                result[i].runTime = parseFloat(result[i].runTime / 3600).toFixed(2)
                result[i].defrostTime = parseFloat(result[i].defrostTime / 3600).toFixed(2)
                if (parseInt(result[i].isRunning) === 1){
                    coldCnt = coldCnt + 1;
                }
                if (parseInt(result[i].isDefrosting) === 1){
                    defrostCnt = defrostCnt + 1;
                }
                if (parseInt(result[i].isRunning) === 0 && parseInt(result[i].isDefrosting) === 0){
                    freeCnt = freeCnt + 1;
                }
            }
            $scope.coldCnt = coldCnt;
            $scope.defrostCnt = defrostCnt;
            $scope.freeCnt = freeCnt;

            if ($scope.swiper < 1){
                var innerHTML = '<div class="swiper-slide">' +
                    '<div style="height: 100px"> ' +
                    '<span class="info-box-icon bg-green" style="height: 85px;width: 85px;">' +
                    '<i class="fa fa-life-ring bg-green"></i></span> ' +
                    '<div class="info-box-content" style="padding-left: 2px"> ' +
                    '<span class="info-box-text"><span style="font-size: 20px;color: coral">制冷</span><span style="font-size: 40px;color: coral">&nbsp;&nbsp;'+$scope.coldCnt+'</span></span> ' +
                    '</div></div>' +
                    '<div style="height: 100px"> ' +
                    '<span class="info-box-icon bg-yellow" style="height: 85px;width: 85px;">' +
                    '<i class="fa fa-life-ring bg-yellow"></i></span> ' +
                    '<div class="info-box-content" style="padding-left: 2px"> ' +
                    '<span class="info-box-text"><span style="font-size: 20px;color: coral">化霜</span><span style="font-size: 40px;color: coral">&nbsp;&nbsp;'+$scope.defrostCnt+'</span></span> ' +
                    '</div></div>' +
                    '<div style="height: 100px"> ' +
                    '<span class="info-box-icon bg-red" style="height: 85px;width: 85px;">' +
                    '<i class="fa fa-life-ring bg-red"></i></span> ' +
                    '<div class="info-box-content" style="padding-left: 2px"> ' +
                    '<span class="info-box-text"><span style="font-size: 20px;color: coral">待机</span><span style="font-size: 40px;color: coral">&nbsp;&nbsp;'+$scope.freeCnt+'</span></span> ' +
                    '</div></div>' +
                    '</div> ';
                $("#chartView").last().append(innerHTML);
                $scope.swiper +=1;
            }
        })
    }

    $scope.activeEnergy = 'drawInOutGoods';
    $scope.goodsInOutOther = function () {
        clearSwiper();
        $scope.activeEnergy = 'drawInOutGoods';
        for (var i = 0; i < $scope.mystorages.length; i++) {
            $scope.drawInOutGoods($scope.mystorages[i]);
        }
    }

    $scope.compressorPressureOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'compressorPressure';
        for (var i = 0; i < $scope.compressorGroups.length; i++) {
            $scope.drawCompressorPressure($scope.compressorGroups[i]);
        }
    }

    $scope.condensationOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'condensation';
        for (var i = 0; i < $scope.compressorGroups.length; i++) {
            $scope.drawCondensation($scope.compressorGroups[i]);
        }
    }

    $scope.compressorBlowerOther = function () {
        clearSwiper();
        $scope.swiper = 0;
        $scope.activeEnergy = 'compressorBlower';
        $scope.drawCompressorBlower();
    }

    function clearSwiper(){
        $("div").remove(".swiper-slide");
        $scope.swiper = 0;
        $scope.defaltswiper = 0;
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

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.activeEnergy == 'drawInOutGoods'){
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.drawInOutGoods($scope.mystorages[i]);
            }
        }
        if ($scope.activeEnergy == 'compressorBlower'){
            $scope.drawCompressorBlower();
        }
    }, 30000);

});
