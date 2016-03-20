/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorPressure', function ($scope, $location, $stateParams) {
    console.log($stateParams.storageID);
    $scope.load = function () {

        // 高压压力实时图——仪表盘
        var highChart = echarts.init(document.getElementById('pressureChart'));
        var highOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '高压压力',
                    type: 'gauge',
                    min: -100,
                    max: 100,
                    detail: {formatter: '{value}Kpa'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '高压压力'}]
                }
            ]
        };

        highChart.setOption(highOption);


        // 低压压力实时图——仪表盘
        var lowChart = echarts.init(document.getElementById('pressure1Chart'));
        var lowOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '低压压力',
                    type: 'gauge',
                    min: -100,
                    max: 100,
                    detail: {formatter: '{value}Kpa'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '低压压力'}]
                }
            ]
        };

        lowChart.setOption(lowOption);

        // 出水压力实时图——仪表盘
        var waterChart = echarts.init(document.getElementById('pressure2Chart'));
        var waterOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '出水压力',
                    type: 'gauge',
                    min: -100,
                    max: 100,
                    detail: {formatter: '{value}Kpa'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '出水压力'}]
                }
            ]
        };

        waterChart.setOption(waterOption);

        // 出水温度实时图——仪表盘
        var outWaterChart = echarts.init(document.getElementById('compressorTemperChart'));
        var outWaterOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '出水温度',
                    type: 'gauge',
                    min: -30,
                    max: 30,
                    detail: {formatter: '{value}℃'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '出水温度'}]
                }
            ]
        };

        outWaterChart.setOption(outWaterOption);

        // 吸气温度实时图——仪表盘
        var inAirChart = echarts.init(document.getElementById('compressor1TemperChart'));
        var inAirOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '吸气温度',
                    type: 'gauge',
                    min: -30,
                    max: 30,
                    detail: {formatter: '{value}℃'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '吸气温度'}]
                }
            ]
        };

        inAirChart.setOption(inAirOption);

        // 排气温度实时图——仪表盘
        var outAirChart = echarts.init(document.getElementById('compressor2TemperChart'));
        var outAirOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '排气温度',
                    type: 'gauge',
                    min: -30,
                    max: 30,
                    detail: {formatter: '{value}℃'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '排气温度'}]
                }
            ]
        };

        outAirChart.setOption(outAirOption);

        // 油分内部实时图——仪表盘
        var oilInChart = echarts.init(document.getElementById('compressor3TemperChart'));
        var oilInOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '油分内部',
                    type: 'gauge',
                    min: -30,
                    max: 30,
                    detail: {formatter: '{value}℃'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '油分内部'}]
                }
            ]
        };

        oilInChart.setOption(oilInOption);

        // 油冷出口温度实时图——仪表盘
        var OilColdChart = echarts.init(document.getElementById('compressor4TemperChart'));
        var OilColdOption = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '油冷出口温度',
                    type: 'gauge',
                    min: -30,
                    max: 30,
                    detail: {formatter: '{value}℃'},
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    },
                    data: [{value: 0, name: '油冷出口温度'}]
                }
            ]
        };

        OilColdChart.setOption(OilColdOption);

        clearInterval(timeTicket);
        var timeTicket = setInterval(function () {
            highOption.series[0].data[0].value = (Math.random() * (100)).toFixed(2) - 0;
            lowOption.series[0].data[0].value = (Math.random() * (100)).toFixed(2) - 0;
            waterOption.series[0].data[0].value = (Math.random() * (100)).toFixed(2) - 0;
            outWaterOption.series[0].data[0].value = (Math.random() * (30)).toFixed(2) - 0;
            inAirOption.series[0].data[0].value = (Math.random() * (30)).toFixed(2) - 0;
            outAirOption.series[0].data[0].value = (Math.random() * (30)).toFixed(2) - 0;
            oilInOption.series[0].data[0].value = (Math.random() * (30)).toFixed(2) - 0;
            OilColdOption.series[0].data[0].value = (Math.random() * (30)).toFixed(2) - 0;
            highChart.setOption(highOption, true);
            lowChart.setOption(lowOption, true);
            waterChart.setOption(waterOption, true);
            outWaterChart.setOption(outWaterOption, true);
            inAirChart.setOption(inAirOption, true);
            outAirChart.setOption(outAirOption, true);
            oilInChart.setOption(oilInOption, true);
            OilColdChart.setOption(OilColdOption, true);
        }, 2000);

    }
    $scope.load();
});
