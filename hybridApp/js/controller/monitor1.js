var rdc = null, pagedata = {index: 0}, mySwiper = null;
if (localStorage.rdc) {
    rdc = JSON.parse(localStorage.rdc);
    if (localStorage.currentRdc) {
        rdc.id = JSON.parse(localStorage.currentRdc).id;
    }
}
mui.init();
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
$('.rlTab a').eq(0).on("tap", function () {
    $('.rlTab').find("b").css('color', '#555');
    $(this).addClass('activeTab').siblings().removeClass('activeTab');
    $(this).children('b').css('color', '#EB5A4A');
    pagedata.index = 0;
    page.initpage();
});
mui('.mui-popover').on('tap', 'ul>li>a', function (e) {
    var tap_html = this.innerHTML, tab_id = this.parentNode.parentNode.parentNode.id;
    var index = parseInt(this.getAttribute("data-index"));
    if (pagedata.index == index) {return;}
    pagedata.index = index;
    page.initpage();
    //下面的循环  纯粹是操作样式代码
    for (var i = 0; i < $('.rlTab a').length; i++) {
        var a_href = $('.rlTab').children('a').eq(i).attr('href');
        var b_color = $('.rlTab').find("b").css('color', '#555');
        if ('#' + tab_id == a_href) {
            var i_color = $('.rlTab').children('a').eq(i).children('span').css('color');
            $('.rlTab').children('a').eq(i).children('b').html(tap_html).css('color', i_color);
            $('.rlTab').children('a').eq(i).addClass('activeTab').siblings().removeClass('activeTab');
            mui('.mui-popover').popover('hide');
            return
        }
    }
});

//=======================================================================================温度模块start=======================================================================================
var temp = {
        init: function () {
            if (rdc.mystorages) {//刷新数据
                temp.refdata();
            } else {
                temp.initStorageset();//初始化数据
            }
        },
        refdata: function () {
            if (mySwiper && mySwiper.pageindex != pagedata.index) {
                page.initSwiper(rdc.mystorages)
            }
            var mystorage = rdc.mystorages[mySwiper.activeIndex]
            temp.inidata(mystorage);
        },
        initStorageset: function () {
            mui.ajax(smartCold + 'i/coldStorageSet/findStorageSetByRdcId', {
                data: {rdcID: rdc.id}, dataType: 'json', type: 'get', crossDomain: true, success: function (data) {
                    if (data && data.length > 0) {
                        rdc.mystorages = data;
                        temp.initTempSet();
                    }
                    ;
                }
            });
        },
        initTempSet: function () {
            var count = 0;
            $.each(rdc.mystorages, function (i, mystorage) {
                mui.ajax(smartCold + '/i/temp/getTempsetByStorageID', {
                    data: {oid: mystorage.id},
                    dataType: 'json', //服务器返回json格式数据
                    type: 'get', //HTTP请求类型
                    crossDomain: true,
                    success: function (data) {
                        count++;
                        var oids = [], names = [];
                        mui.each(data, function (i, temp) {
                            oids.push(temp.id);
                            names.push(temp.name);
                        });
                        mystorage.oids = oids;
                        mystorage.names = names;
                        if (count == rdc.mystorages.length) {
                            page.initSwiper(rdc.mystorages);
                            temp.refdata();
                        }
                    }
                });
            });

        },
        inidata: function (mystorage) {
            if (mystorage.lasttime && new Date().getTime() - mystorage.lasttime < 30000 && $("#chart_" + mystorage.id + " canvas").length > 0) {
                return;
            }
            mui.get(smartCold + 'i/util/getColdAlarmStatus', {oid: mystorage.id}, function (data) {
                $("#errmsg_" + mystorage.id).html(data.isBlack ? "<h4 class='red overTemp'>由于该冷库长时超温,系统自动静默！</h4>" : "");
            }, 'json');
            $("#cuttval_" + mystorage.id).empty();
            var endTime = new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
            mui.ajax(smartCold + 'i/temp/getTempByTime', {
                data: {
                    'oid': mystorage.id,
                    'oids': mystorage.oids,
                    'names': mystorage.names,
                    'key': 'Temp',
                    "startTime": formatTime(startTime),
                    "endTime": formatTime(endTime)
                }, dataType: 'json', type: 'post', timeout: 10000, traditional: true, success: function (result) {
                    var name = result.name;
                    var datumTemp = parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
                    var xData = [], series = [], tempData = [], tempMap = result.tempMap, isadd = true, ymax = datumTemp,
                        ymin = datumTemp, systime = result.systime;
                    var i = 0, tempList = newdata = [], vo = cuttime = lasttime = null;
                    for (var key in tempMap) {
                        vo = cuttime = null, tempList = tempMap[key], tempData = [], newdata = [], lasttime = startTime.getTime();
                        if (tempList.length > 0) {
                            for (i = 0; i < tempList.length; i++) {
                                vo = tempList[i];
                                cuttime = new Date(vo.addtime).getTime();
                                if (isadd) {
                                    xData.push(formatTimeToMinute(vo.addtime).split(' ')[1])
                                }
                                tempData.push(vo.value)
                                if (vo.value > ymax) {
                                    ymax = vo.value
                                }
                                if (vo.value < ymin) {
                                    ymin = vo.value
                                }
                            }
                            $("#cuttval_" + mystorage.id).append([key, tempData[tempData.length - 1].toFixed(2)].join(":") + "℃  ");
                            series.push({name: key, type: 'line', data: tempData, smooth: true, symbol: "none"});
                            isadd = false;
                        }
                    }
                    if (series.length > 0) {
                        series[series.length - 1].markLine = {
                            symbol: 'circle',
                            data: [
                                [{
                                    name: '基准温度',
                                    value: datumTemp,
                                    xAxis: 0,
                                    yAxis: datumTemp,
                                    itemStyle: {normal: {color: '#dc143c'}}
                                },
                                    {name: '', xAxis: 10e99, yAxis: datumTemp, itemStyle: {normal: {color: '#dc143c'}}}
                                ],
                            ]
                        };
                        ymax = ymax + 0.3, ymin = ymin - 0.3;//最大值，最小值
                    } else {
                        ymin = -20, ymax = 20;
                        series = {data: []};//为了无数据能够显示气泡

                    }
                    mystorage.lasttime = endTime.getTime();
                    temp.initchart(mystorage.id, ymax, ymin, xData, series)
                }
            });
        },
        initchart: function (storageid, ymax, ymin, xData, series) {
            var myChart = echarts.init(document.getElementById("chart_" + storageid));
            // 指定图表的配置项和数据
            var option = {
                noDataLoadingOption: {
                    text: '暂无数据,请排查原因\n1、设备通讯异常，请检查设备',
                    textStyle: {fontSize: 16},
                    effect: 'bubble',
                    effectOption: {effect: {n: 30}}
                },
                backgroundColor: '#d2d6de',
                tooltip: {trigger: 'axis', textStyle: {fontSize: 13, fontWeight: '400'}, formatter: '{a0}:{c0}℃'},
                grid: {x: 50, x2: 40, y: 20, y2: 50},
                xAxis: {type: 'category', data: xData},
                yAxis: {
                    name: '温度(℃)',
                    nameLocation: 'end',
                    max: ymax,
                    min: ymin,
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value) {
                                return parseFloat(value).toFixed(1);
                            }
                            return 0;
                        }
                    }
                },
                series: series
            };
            myChart.setOption(option);  // 使用刚指定的配置项和数据显示图表。
        }
    },
//=======================================================================================温度模块 end=======================================================================================
//=======================================================================================能耗 start=======================================================================================
    pwc = {//初始化电量模块
        init: function () {
            if (rdc.powers) {
                pwc.refdata();
            } else {
                pwc.initpwcset();
            }
        },

        initpwcset: function () {
            mui.ajax(smartCold + 'i/power/findByRdcId', {
                data: {rdcId: rdc.id},
                dataType: 'json',//服务器返回json格式数据
                type: 'get',//HTTP请求类型
                timeout: 10000,//超时时间设置为10秒；
                success: function (data) {
                    if (data && data.length > 0) {
                        rdc.powers = data;
                        page.initSwiper(rdc.powers);
                        pwc.refdata();
                    } else {//
                        mui.alert("没有配置电量模块！")
                    }
                }
            });

        },
        initdata: function (powerSet) {
            if (powerSet.lasttime && new Date().getTime() - powerSet.lasttime < 30000 && $("#chart_" + powerSet.id + " canvas").length > 0) {
                return;
            }
            var powerid = powerSet.id;
            var endTime = getFormatTimeString();
            var startTime = getFormatTimeString(-1 * 60 * 60 * 1000);
            mui.get(smartCold + "i/baseInfo/getKeyValueDataByTime", {
                    type: 10,
                    oid: powerid,
                    key: 'PWC',
                    startTime: startTime,
                    endTime: endTime
                }, function (data) {
                    var powerData = data;
                    var xData = [];
                    var yData = [];
                    mui.each(powerData, function (i, item) {
                        xData.unshift(formatTimeToMinute(item.addtime).split(' ')[1]);
                        yData.unshift(item.value * powerSet.radio.toFixed(1))
                    });
                    var currentPower = '';
                    if (data.length > 0) {
                        currentPower = data[data.length - 1] ? parseFloat(data[data.length - 1].value * powerSet.radio).toFixed(1) : '';
                    }
                    ;
                    /*  var divStr = '<div class="swiper-slide"><div class="curTxt"><p class="blue">' + powerSet.name + '</p><p class="red">' + currentPower + ' kW.h</p></div><div class="chart" id=' + mainId + '></div></div>';
                      $("#elec").last().append(divStr);*/

                    $("#cuttval_" + powerSet.id).empty().append(currentPower + " kW.h");
                    var lineChart = echarts.init(document.getElementById('chart_' + powerid));
                    var grid = {x: 70, y: 40, x2: 40};
                    var option = pwc.getOption('累积电量实时监控', xData, yData, '电量', 'kW.h', '电量', 'line', grid);
                    lineChart.setOption(option);
                    powerSet.lasttime = new Date().getTime();
                }, 'json'
            );
        }
        , getOption: function (title, xData, yData, yName, yUnit, lineName, type, grid, yMin, yMax) {
            yMin = yMax = yData.length > 0 ? yData[0] : 0;
            mui.each(yData, function (index, item) {
                yMin = Math.min(yMin, item);
                yMax = Math.max(yMax, item);
            });
            if (yMin == yMax && yMin > 0) {
                yMin = yMin - 5
            }
            var option = {
                noDataLoadingOption: {
                    text: '暂无数据',
                    textStyle: {fontSize: 16},
                    effect: 'bubble',
                    effectOption: {effect: {n: 30}}
                },
                backgroundColor: '#D2D6DE',
                tooltip: {
                    trigger: 'axis',
                    textStyle: {fontSize: 13, fontWeight: '400'},
                    formatter: '{a0}:{c0} ' + yUnit
                },
                title: {text: title, x: 'left', textStyle: {fontSize: 13, fontWeight: '400'}},
                grid: grid,
                xAxis: [{type: 'category', data: xData}],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            return value.toFixed(1);
                        }
                    },
                    name: yName + "(" + yUnit + ")",
                    min: yMin ? yMin : 'auto',
                    max: yMax ? yMax : 'auto',
                    minInterval: 1
                }],
                series: [{name: lineName, type: type, data: yData, smooth: true, symbol: "none"}]
            };
            return option
        },

        refdata: function () {
            if (mySwiper && mySwiper.pageindex != pagedata.index) {
                page.initSwiper(rdc.powers)
            }
            var power = rdc.powers[mySwiper.activeIndex]
            pwc.initdata(power);
        },
    },
    water = {
        init: function () {
            if (rdc.compressorGroups) {
                water.refdata();
            } else {
                water.initwaterset();
            }
        },
        initwaterset: function () {
            mui.ajax(smartCold + 'i/compressorGroup/findByRdcId', {
                data: {rdcId: rdc.id},
                dataType: 'json',//服务器返回json格式数据
                type: 'get',//HTTP请求类型
                timeout: 10000,//超时时间设置为10秒；
                success: function (data) {
                    if (data && data.length > 0) {
                        rdc.compressorGroups = data;
                        page.initSwiper(rdc.compressorGroups);
                        water.refdata();
                    } else {//
                        mui.alert("没有配置压缩机数据采集模块！")
                    }
                }
            });
        },
        initdata: function (compressorGroup) {
            if (compressorGroup.lasttime && new Date().getTime() - compressorGroup.lasttime < 30000 && $("#chart_" + compressorGroup.id + " canvas").length > 0) {
                return;
            }
            var compressorGroupid = compressorGroup.id;
            var endTime = getFormatTimeString();
            var startTime = getFormatTimeString(-4 * 60 * 60 * 1000);
            mui.get(smartCold + "i/baseInfo/getKeyValueDataByTime", {
                    type: 3,
                    oid: compressorGroupid,
                    key: 'WaterCost',
                    startTime: startTime,
                    endTime: endTime
                }, function (data) {
                    var waterData = data;
                    var xData = [];
                    var yData = [];
                    mui.each(waterData, function (i, item) {
                        xData.unshift(formatTimeToMinute(item.addtime).split(' ')[1]);
                        yData.unshift(item.value)
                    });
                    var currentWater = '';
                    if (data.length > 0) {
                        currentWater = data[0] ? parseFloat(data[0].value).toFixed(1) : '';
                    }
                    ;
                    $("#cuttval_" + compressorGroup.id).empty().append(currentWater + " t");
                    var lineChart = echarts.init(document.getElementById('chart_' + compressorGroupid));
                    var grid = {x: 40, y: 40, x2: 30};
                    var option = pwc.getOption('日实时累积耗水量', xData, yData, '耗水量', 't', '耗水量', 'line', grid, parseInt(yData[0]));
                    lineChart.setOption(option);
                    compressorGroup.lasttime = new Date().getTime();
                }, 'json'
            );
        },
        refdata: function () {
            if (mySwiper && mySwiper.pageindex != pagedata.index) {
                page.initSwiper(rdc.compressorGroups)
            }
            var compressorGroup = rdc.compressorGroups[mySwiper.activeIndex];
            water.initdata(compressorGroup);
        },

    },
    //=======================================================================================能耗 end=======================================================================================
    page = {
        nodatamsg: function (msg) {
            //.......
            mui.alert(msg)
        },
        initSwiper: function (data) {
            var pagemode = [];
            $("#box li").empty().append('<div  class="swiper-container"> <div class="swiper-wrapper" id="dev_obj"></div><div class="swiper-pagination"></div></div>');
            $.each(data, function (i, item) {
                pagemode.push(['<div class="swiper-slide"><div class="curTxt"><p class="blue">' + item.name + '</p>' + '<p class="red" id="cuttval_', item.id, '"></p></div><div class="chart" id="chart_', item.id, '"></div>  <div id="errmsg_', item.id, '" "></div></div>'].join(""));
            });
            $("#dev_obj").html(pagemode.join(""));
            mySwiper = new Swiper('.swiper-container', {
                initialSlide: 0,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                onSlideChangeStart: function (swiper) {
                    page.initpage();
                }
            });
            mySwiper.pageindex = pagedata.index;
        },
        initpage: function () {
            switch (pagedata.index) {
                case 0:
                    temp.init();
                    break;
                case 1:
                    pwc.init();
                    break;
                case 2:
                    water.init();
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
            }
        }
    };

page.initpage();
clearInterval(DiDa);
var DiDa = setInterval(function () {
    page.initpage();
}, 10000);

