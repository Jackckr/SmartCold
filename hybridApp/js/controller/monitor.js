mui.init();
/*特殊tab处理---温度*/
localStorage.showIndex = 0;
$('.rlTab a').eq(0).on("tap", function () {
    $('.rlTab').find("b").css('color', '#555');
    $(this).addClass('activeTab').siblings().removeClass('activeTab');
    $(this).children('b').css('color', '#EB5A4A');
    $('#box li').eq(0).show().siblings().hide();
    localStorage.showIndex = 0;
});
mui('.mui-popover').on('tap', 'ul>li>a', function (e) {
    var tap_html = this.innerHTML;
    var tab_id = this.parentNode.parentNode.parentNode.id;
    var index = parseInt(this.getAttribute("data-index"));
    localStorage.showIndex = index;
    $('#box li').eq(index).show().siblings().hide();
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
/*公共图表封装js*/
var getOption = function (title, xData, yData, yName, yUnit, chartType, tipName, legend, yMin, yMax) {
    var option = {
        title: {text: title},
        tooltip: {trigger: 'axis', textStyle: {fontSize: 13, fontWeight: '400'}},
        legend: {data: legend},
        grid: {x: 35, x2: 10, y: 30, y2: 25},
        xAxis: [{type: 'category', data: xData}],
        yAxis: [{type: 'value', splitArea: {show: true}, name: yName}],
        series: [{name: tipName, type: chartType, data: yData}]
    };
    return option;
};
var mask=mui.createMask();
var rdc=null,mystorages = null;
if(localStorage.rdc){
	rdc=JSON.parse(localStorage.rdc)
}else{
	 mask.show();
	 mui.alert('当前账号没有冷库')
	 mui.openWindow({
	    url: 'login.html',
	    id: 'login.html',
	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    waiting:{
	      autoShow:true,//自动显示等待框，默认为true
	      title:'正在加载...',//等待对话框上显示的提示内容
	    }
	});
}
var tempsets = [];
var setInit = {
    //初始化rdc列表+默认展示温度监控图表
    initTemp: function (rdc) {
    	if(localStorage.currentRdc){
    		rdc.id=JSON.parse(localStorage.currentRdc).id
    	}
        mui.ajax(smartCold + 'i/coldStorageSet/findStorageSetByRdcId', {
            data: {rdcID: rdc.id},
            dataType: 'json', //服务器返回json格式数据
            type: 'get', //HTTP请求类型
            crossDomain: true,
            success: function (data) {
                if (data && data.length > 0) {
                    mystorages = data;
                    mui.ajax(smartCold + 'i/temp/getTempsetByRdcId', {
                        data: {rdcId: rdc.id},
                        dataType: 'json', //服务器返回json格式数据
                        type: 'get', //HTTP请求类型
                        crossDomain: true,
                        success: function (data) {
                            tempsets = data;
                            for (var i = 0; i < mystorages.length; i++) {
                                firstLoad(mystorages[i], tempsets, false);
                            }
                        }
                    });
                    var mySwiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        spaceBetween: 30,
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true//修改swiper的父元素时，自动初始化swiper
                    });
                }
            }
        });
    },
    initElectric:function(){
    	
    }
}
setInit.initTemp(rdc)
/**
 * 温度模块js
 **/

var getOids = [], getNames = [];
//初次加载温度模块
var firstLoad = function (storage, tempsets, isreload) {
    var storageID = storage.id;
    var oids = [], names = [];
    var endTime = new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);

    if (getOids[storageID]) {
        oids = getOids[storageID];
        names = getNames[storageID];
    } else {
        mui.each(tempsets, function (i, obj) {
            if (obj.coldStorageId == storageID) {
                oids.push(obj.id);
                names.push(obj.name);
            }
        });
        getOids[storageID] = oids;
        getNames[storageID] = names;
    }
    tempChart(storage, oids, names, startTime, endTime);
}
var tempChart = function (storage, oids, names, startTime, endTime) {
    if (oids.length == 0) {
        return
    }
    ;
    mui.ajax(smartCold + 'i/temp/getTempByTime', {
        data: {
            'oid': storage.id,
            'oids': oids,
            'names': names,
            'key': 'Temp',
            "startTime": formatTime(startTime),
            "endTime": formatTime(endTime)
        },
        dataType: 'json',//服务器返回json格式数据
        type: 'post',//HTTP请求类型
        timeout: 10000,//超时时间设置为10秒；
        traditional: true,
        success: function (result) {
            var name = result.name;
            var curtemper = [], xData = [], series = [], yData = [], tempData = [], maxTime = endTime.getTime(),
                tempMap = result.tempMap, isadd = true,
                systime = result.systime;
            var datumTemp = parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
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
                    }
                    curtemper.push(tempData[tempData.length - 1].toFixed(2));
                   
                    var temp = {
                        name: key,
                        type: 'line',
                        data: tempData,
                        smooth: true,
                        symbol: "none"
                    }
                    series.push(temp);
                    isadd = false;
                }
            }
            if (series.length > 0) {
                series[series.length - 1].markLine = {
                    symbol: 'circle',
                    data: [
                        [
                            {name: '基准温度', value: datumTemp, xAxis: 0, yAxis: datumTemp},
                            {name: '', xAxis: 10e99, yAxis: datumTemp}
                        ],
                    ]
                };
            }else{
            	series= {data:[]}//为了无数据能够显示气泡
            }
            var mainId = 'main' + storage.id;
            if ($("#" + mainId).length > 0) {//已经创建
                $("#tm" + mainId).html(curtemper + "℃");
            } else {
                var divStr = '<div class="swiper-slide"><div class="curTxt"><p class="blue">' + storage.name + '</p><p class="red" id="tm' + mainId + '">' + curtemper + '℃</p></div><div class="chart" id=' + mainId + '></div></div>';
                $("#tem").last().append(divStr);
            }

            var myChart = echarts.init(document.getElementById(mainId));            
            // 指定图表的配置项和数据
            var option = {
            	noDataLoadingOption: {
				    text: '暂无数据,请排查原因\n1、设备通讯异常，请检查设备',
				    textStyle:{fontSize:16},
				    effect: 'bubble',
				    effectOption: {
				      effect: {
				        n:30
				      }
				    }
				},
                backgroundColor: '#d2d6de',
                tooltip: {trigger: 'axis', textStyle: {fontSize: 13, fontWeight: '400'}},
                grid: {x: 40, x2: 40, y: 20, y2: 50},
                xAxis: {
                    type: 'category',
                    data: xData
                },
		        yAxis: {
                    name: '温度(℃)',
                    nameLocation: 'end'
                },
                series: series
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    });

}

/*定时刷新功能*/
function clearSwiper() {
    $(".swiper-wrapper,.swiper-pagination").empty();
}
clearInterval(DiDa);
var DiDa = setInterval(function () {
    var didaIndex = Number(localStorage.showIndex);
    clearSwiper();
    switch (didaIndex) {
        case 0:
            setInit.initTemp(rdc);
            console.log(didaIndex)
            break;
        case 1:
            console.log(didaIndex)
            break;
        case 2:
            console.log(didaIndex)
            break;
        case 3:
            console.log(didaIndex)
            break;
        case 4:
            console.log(didaIndex)
            break;
        case 5:
            console.log(didaIndex)
            break;
        case 6:
            console.log(didaIndex)
            break;
    }
}, 30000);

