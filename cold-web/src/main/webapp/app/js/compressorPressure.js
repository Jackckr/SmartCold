/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('compressorPressure', function ($scope, $location, $stateParams, $http) {
    console.log($stateParams.compressorID);
    $scope.load = function () {
        var data = [];
        $http.get('/i/compressorGroup/findByGroupId', {
            params: {
                "compressorID": $stateParams.compressorID,
                "npoint": 10
            }
        }).success(function (result) {
            console.log("result:" + result);
            for (var i = 0; i < result.length; i++) {
                console.log("result:" + result[i].Compressor1 + ",Compressor1: " + result[i].Compressor1);
                var val = Date.parse(result[i].addTime);
                var newDate = new Date(val).getTime();
                data.push({
                    x: newDate,
                    y: result[i].powerConsume
                });
            }
            console.log("data.length:"+data.length)
            var group = result[0];

            // 环形图表示压力监控
            var pressureChart = echarts.init($("#pressureChart").get(0));

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
                    //subtext: 'From SmartCold',
                    //sublink: 'http://www.baidu.com/',
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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    x: 30,
                    y: 200,
                    itemGap: 12,
                    data: ['高压压力', '低压压力']
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
                        name: '1',
                        type: 'pie',
                        clockWise: false,
                        radius: [70, 90],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.highPress),
                                name: '高压压力'
                            },
                            {
                                value: 100 - parseInt(group.highPress),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },
                    {
                        name: '2',
                        type: 'pie',
                        clockWise: false,
                        radius: [50, 70],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.lowPress),
                                name: '低压压力'
                            },
                            {
                                value: 100 - parseInt(group.lowPress),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            };
            pressureChart.setOption(pressureOption);


            // 环形图表示运行监控
            var runChart = echarts.init($("#runChart").get(0));

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
            var runOption = {
                title: {
                    text: '运行监控',
                    //subtext: 'From SmartCold',
                    //sublink: 'http://www.baidu.com/',
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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    x: 0,
                    y: 200,
                    itemGap: 12,
                    data: ['负载1', '负载2', '负载3']
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
                        name: '1',
                        type: 'pie',
                        clockWise: false,
                        radius: [51, 64],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor1) === -1 ? 0 : parseInt(group.Compressor1),
                                name: '负载1'
                            },
                            {
                                value: parseInt(group.Compressor1) === -1 ? 100 : 100 - parseInt(group.Compressor1),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },
                    {
                        name: '2',
                        type: 'pie',
                        clockWise: false,
                        radius: [64, 77],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor2) === -1 ? 0 : parseInt(group.Compressor2),
                                name: '负载2'
                            },
                            {
                                value: parseInt(group.Compressor2) === -1 ? 100 : 100 - parseInt(group.Compressor2),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },
                    {
                        name: '3',
                        type: 'pie',
                        clockWise: false,
                        radius: [77, 90],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor3) === -1 ? 0 : parseInt(group.Compressor3),
                                name: '负载3'
                            },
                            {
                                value: parseInt(group.Compressor3) === -1 ? 100 : 100 - parseInt(group.Compressor3),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            };
            runChart.setOption(runOption);

            // 环形图表示运行监控2
            var runChart2 = echarts.init($("#runChart2").get(0));

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
            var runOption2 = {
                title: {
                    text: '运行监控',
                    //subtext: 'From SmartCold',
                    //sublink: 'http://www.baidu.com/',
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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    x: 0,
                    y: 200,
                    itemGap: 12,
                    data: ['负载4', '负载5', '负载6']
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
                        name: '1',
                        type: 'pie',
                        clockWise: false,
                        radius: [51, 64],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor4) === -1 ? 0 : parseInt(group.Compressor4),
                                name: '负载4'
                            },
                            {
                                value: parseInt(group.Compressor4) === -1 ? 100 : 100 - parseInt(group.Compressor4),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },
                    {
                        name: '2',
                        type: 'pie',
                        clockWise: false,
                        radius: [64, 77],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor5) === -1 ? 0 : parseInt(group.Compressor5),
                                name: '负载5'
                            },
                            {
                                value: parseInt(group.Compressor5) === -1 ? 100 : 100 - parseInt(group.Compressor5),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },
                    {
                        name: '3',
                        type: 'pie',
                        clockWise: false,
                        radius: [77, 90],
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: parseInt(group.Compressor6) === -1 ? 0 : parseInt(group.Compressor6),
                                name: '负载6'
                            },
                            {
                                value: parseInt(group.Compressor6) === -1 ? 100 : 100 - parseInt(group.Compressor6),
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            };
            runChart2.setOption(runOption2);

            // 液位计
            $(function () {
                $('#floatPressureChart').highcharts({
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
                        style: {
                            color: 'rgba(30,144,255,0.8)',
                            fontFamily: '微软雅黑',
                            fontSize: 25,
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
                            text: 'Level (mL)'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: 'Level is: <b>{point.y:.1f} mL</b>',
                    },
                    credits: {
                        enabled: false // 禁用版权信息
                    },
                    series: [{
                        name: 'Level',
                        data: [parseFloat(group.liquidLevel)],
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


            /*  电量实时图 —— 折线图  */
            $(function () {
                $(document).ready(function () {
                    Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });

                    var chart;
                    $('#powerChart').highcharts({
                        chart: {
                            type: 'spline',
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: 10,
              /*              events: {
                                load: function () {

                                    /!*                                // set up the updating of the chart each second
                                     var series = this.series[0];

                                     setInterval(function () {
                                     $http.get('/i/coldStorage/findColdStorageById', {
                                     params: {
                                     "storageID": $stateParams.storageID,
                                     "npoint": 2
                                     }
                                     }).success(function (data) {
                                     console.log("data:" + data);
                                     for (var i = 0; i < data.length; i++) {
                                     console.log("data:" + data[i].temperature);
                                     }
                                     //TODO 修改为时间和温度根据后台传过来的数据,可能在时间窗内有多个点
                                     var temper2 = data[data.length - 1].temperature;
                                     var x = (new Date()).getTime(), // current time
                                     y = (Math.random() * (40) - temper2).toFixed(2) - 0;
                                     temper = y;
                                     series.addPoint([x, y], true, true);
                                     });
                                     }, 1000);*!/
                                    // set up the updating of the chart each second
                                    var series = this.series[0];

                                    setInterval(function () {
                                        var x = (new Date()).getTime(), // current time
                                            y = (Math.random() * (40) - 20).toFixed(2) - 0;
                                        temper = y;
                                        series.addPoint([x, y], true, true);
                                    }, 5000);
                                }
                            },*/
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
                            text: '电量实时监控'
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 150,
                        },
                        yAxis: {
                            title: {
                                text: 'Power(kw)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }
                                /*               , {
                                 color:'red',           //线的颜色，定义为红色
                                 dashStyle:'solid',     //默认值，这里定义为实线
                                 value:18,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                                 width:2,
                                 label:{
                                 text:'', //标签的内容
                                 align:'right',                //标签的水平位置，水平居左,默认是水平居中center
                                 x:10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                                 }//标示线的宽度，2px
                                 }*/
                            ]
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
                            name: 'Power',
                            markPoint: {
                                data: [
                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                ]
                            },
                            data: (function () {
                                /*// generate an array of random data
                                var data = [],
                                    time = (new Date()).getTime(),
                                    i;

                                for (i = -19; i <= 0; i++) {
                                    data.push({
                                        x: time + i * 5000,
                                        y: Math.random() * (40) - 20
                                    });
                                }*/
                                return data;
                            })()
                        }]
                    });
                });

            });

        })


        /*
         var img;
         function getTemperature() {
         var temperatureControl = document.getElementById('temp'),
         iTemp = 0;
         // Ensure the temperature value is a number
         if (temperatureControl !== null) {
         iTemp = temperatureControl.value * 1.0;
         }
         // Sanity checks
         if (iTemp > 50) {
         iTemp = 50;
         } else if (iTemp < -30) {
         iTemp = -30;
         }
         return iTemp;
         }
         function getRatio(iTemp) {
         /!* The image is not in proportion this the gauge to pixel
         * ratio need slight adjustment
         *!/
         var iRatio;
         if (iTemp > 0) {
         iRatio = 7.1;
         } else if (iTemp <= 0) {
         iRatio = 6.9;
         } else if (iTemp < -20) {
         iRatio = 6.77;
         }
         return iRatio;
         }
         function convertTempToScreenCoord(iRatio, iTemp) {
         /!* Algorithm to convert the temperature to the correct x screen coord.
         * Odd, but works!
         *!/
         var iMAX_TEMP = 50,
         iSTART_Y_POS = 147;
         return iSTART_Y_POS + (iRatio * (iMAX_TEMP - iTemp));
         }
         function drawLiquid(ctx, iTempToYCoord) {
         /!* Draw red rectangle to represent the fluid in the glass tube
         * Coordinates you Y and are fixed!
         * TODO: Calculare Y coord base on image X,Y
         *!/
         var iX_POS = 111,
         iY_POS = 7,
         iY_OFFSET = 686,
         iWIDTH = 35;
         ctx.fillStyle = "rgb(200,0,0)";
         // Draw rectangle from -30 to iTempToYCoord
         ctx.fillRect(iX_POS, iTempToYCoord, iY_POS, iY_OFFSET - iTempToYCoord);
         // Draw rectangle from botton to -30
         ctx.fillRect(iX_POS, iY_OFFSET, iY_POS, iWIDTH);
         ctx.stroke();
         }
         function imgOnLoaded() {
         /!* Simply grabs a handle to the canvas element and
         * check the context (Canvas support).
         *!/
         var canvas = document.getElementById('thermometer'),
         ctx = null,
         iTemp = 0,
         iRatio  = 0,
         iTempToYCoord = 0;
         // Canvas supported?
         if (canvas.getContext) {
         ctx = canvas.getContext('2d');
         iTemp = getTemperature();
         iRatio = getRatio(iTemp);
         iTempToYCoord = convertTempToScreenCoord(iRatio, iTemp);
         // Draw the loaded image onto the canvas
         ctx.drawImage(img, 0, 0);
         // Draw the liquid level
         drawLiquid(ctx, iTempToYCoord);
         } else {
         alert("Canvas not supported!");
         }
         }
         $scope.drawMap = function() {
         /!* Main entry point got the thermometer Canvas example
         * Simply grabs a handle to the canvas element and
         * check the conect (Canvas support).
         *!/
         var canvas = document.getElementById('thermometer');
         // Create the image resource
         img = new Image();
         // Canvas supported?
         if (canvas.getContext) {
         // Setup the onload event
         img.onload = imgOnLoaded;
         // Load the image
         img.src = '../../img/thermometer-template.png';
         } else {
         alert("Canvas not supported!");
         }
         }
         $scope.setTempAndDraw = function() {
         /!* Function called when user clicks the draw button
         *!/
         var temp = document.getElementById('temp'),
         slider = document.getElementById('defaultSlider');
         if (temp !== null && slider !== null) {
         temp.value = slider.value;
         $scope.drawMap();
         }
         }*/

    }
    $scope.load();

    var timeTicket;
    timeTicket = setInterval(function () {
        if (document.getElementById('pressureChart') !='' && document.getElementById('pressureChart') != undefined && document.getElementById('pressureChart') !=null) {
            $scope.load();
        } else {
            clearInterval(timeTicket);
        }
    }, 30000);
});
