checkLogin();
var app = angular.module('app', []);
app.controller('analysisQuery', function ($scope, $location, $http) {
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

    $scope.seletedDatas = '';
    $scope.showobjgroup = false, $scope.coldstoragedoor = null;
    $scope.oids = [], $scope.sltit = "", $scope.sl_index = 0, $scope.oldnames = [], $scope.slgptit = "";
    //开始核心内容
    $scope.typemode = {
        tit: ['温度', '电量', '', '', '高压', '排气温度'],
        unit: ['(°C)', '(kWh)', '', '', '(kPa)', '(°C)'],
        type: [1, 10, 2, 11, 3, 5],
        key: ['Temp', 'PWC', 'Switch', 'Switch', 'highPress', 'exTemp'],
        ismklin: [true, true, false, false, true, true]
    };
    $scope.oids = [], $scope.sltit = "", $scope.sl_index = 0, $scope.oldnames = [], $scope.slgptit = "";

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
                $scope.prove = {};
                $.each($scope.mystorages, function (i, vo) {
                    $scope.prove[vo.id] = vo.name;
                });
                $http.get(ER.coldroot + "/i/AnalysisController/getColdStorageDoor", {params: {'rdcId': rdcId}}).success(function (data) {
                    $scope.coldstoragedoor = data;
                });
            }
        });
        // 初始化电量
        $http.get(ER.coldroot + '/i/power/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.powers = data;
            })
        $http.get(ER.coldroot + '/i/platformDoor/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.platformDoors = data;
            })
        // 初始化压缩机组
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.compressorGroups = data;
                // 初始化压缩机
                angular.forEach($scope.compressorGroups, function (item) {
                    $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(
                        function (data) {
                            item.compressors = data;
                            if ($scope.selectedCompressors == undefined || $scope.selectedCompressors == []) {
                                $scope.selectedCompressorGroupId = item.id;
                                $scope.selectedCompressors = item.compressors;
                            }
                        })
                })
            })
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
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }

    var lineChart = null;
    var getFormatTimeString = function (delta) {
        delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
        return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
    }
    $scope.end = getFormatTimeString(), $scope.begin = $scope.end.substr(0, 10) + " 00:00:00", $scope.picktime = $scope.begin + ' - ' + $scope.end;
    $scope.goSearch = function () {//查询事件
    	//将字符串转换为日期
        var begin=new Date($("#startTime").val().replace(/-/g,"/"));
        var end=new Date($("#endTime").val().replace(/-/g,"/"));
        //js判断日期
        if(begin>end){
           layer.open({
	           content: '开始时间不能小于结束时间哦^_^'
	           ,btn: '确定'
	        });
           return false;
        }
        if (lineChart == null) {
            lineChart = echarts.init($('#historyChart')[0]);
        }
        if ($scope.oids && $scope.oids.length > 0) {
            lineChart.showLoading({text: '数据加载中……'});
            lineChart.clear();

            $.ajax({
                type: "POST",
                url: ER.coldroot + "/i/baseInfo/getKeyValueDataByFilter", traditional: true,
                data: {
                    type: $scope.typemode.type[$scope.sl_index],
                    ismklin: $scope.typemode.ismklin[$scope.sl_index],
                    oids: $scope.oids,
                    onames: $scope.echnames,
                    key: $scope.typemode.key[$scope.sl_index],
                    startTime: $("#startTime").val(),
                    endTime: $("#endTime").val()
                },
                success: function (data) {
                    if (data.success) {
                        $scope.drawDataLine(data.entity);
                    } else {
                        lineChart.hideLoading();
                    }
                }
            });
        } else {
            lineChart.hideLoading();
            layer.open({
	           content: '没有设置查询对象哦^_^'
	           ,btn: '确定'
	        });
        }
    };

    $scope.drawDataLine = function (chardata) {
        var tooltipmd = {trigger: 'axis',textStyle:{fontSize:12}};
        var yAxismode = {type: 'value', name: $scope.sl_unit, axisLabel: {formatter: '{value}'}};
        var s = $scope.oldnames;
        var xData = chardata.xdata, ydata = chardata.ydata;
        xData = xData.length > 0 ? xData : [1, 2, 3, 4];
        ydata = ydata.length > 0 ? ydata : [{name: $scope.slgptit, type: 'line', data: [34, 35, 34, 21]}];
        var option = {
            calculable: true,
            legend: {data: s},
            title: {text: $scope.slgptit + $scope.typemode.unit[$scope.sl_index]},
            tooltip: tooltipmd,
            legend: {data: [$scope.slgptit],show:false},
            xAxis: [{type: 'category', data: xData}],
            yAxis: yAxismode,
            grid: {x: 50,width:'70%'},
            series: ydata,
        };
        lineChart.setOption(option);
        lineChart.hideLoading();
    };


    $scope.chPress = function (vl, vtxt) {//切换高低压
        $scope.typemode.key[$scope.sl_index] = vl;
        $scope.typemode.tit[$scope.sl_index] = vtxt;
    };
    $scope.chexTemp = function ($event) {//切换排气温度
        var em = $($event.target), oid = em.attr("value");
        angular.forEach($scope.compressorGroups, function (item) {
            if (item.id == oid) {
                $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(function (data) {
                    $scope.selectedCompressorGroupId = item.id;
                    $scope.selectedCompressors = data;
                })
            }
        })
    };

    $scope.selectTemper = function ($event) {
        var em = $($event.target);
        if (em.hasClass("selectLi")) {
            em.removeClass("selectLi");
        } else {
            em.addClass("selectLi");
        }
    }

    $scope.getSelected = function () {
        $scope.sltit == "";
        $scope.oids = [];
        $scope.oldnames = [], $scope.echnames = [], keem = $(".defaultSelect"), slemkey = "#Temp_ul_" + $scope.sl_index + " li.selectLi", subtit = "";
        if ($scope.sl_index == 4) {
            subtit = "-" + $('#Temp_ul_4 input[name="cmsbkey"]:checked').parent()[0].innerText;
        } else if ($scope.sl_index == 5) {
            slemkey = "#Temp_ul_5_key_span_" + $('#Temp_ul_5 input[name="cmptkey"]:checked').val() + " li.selectLi";
        }
        var lilist = $(slemkey);
        $.each(lilist, function (index, item) {
            $scope.oids.push($(item).attr("oid"));
            $scope.oldnames.push(item.innerText);
            $scope.echnames.push(item.innerText + $scope.typemode.tit[$scope.sl_index]);
        });
        $scope.slgptit = keem.text().replace(/\s/gi, '');
        $scope.sltit = $scope.slgptit + subtit + "-{" + ($scope.oldnames.join(",")) + "}";
        $scope.seletedDatas = $scope.sltit;
        $scope.$apply(function () {
            $scope.seletedDatas;
        });
    }

    $(function () {
        var $index = '';
        /*选择一级项目*/
        $(".project .default").click(function () {
            $index = $(this).index();
            $(this).addClass('defaultSelect').siblings().removeClass('defaultSelect');
            $scope.sl_index = $(".defaultSelect").attr("kval");
            if ($scope.sl_index == 5) {//处理特殊情况
                var chptkey = $('#Temp_ul_5 input[name="cmptkey"]:checked').val();//获得选择的压缩机组
                if (chptkey == undefined || chptkey == '') {
                    var ptck = $('#Temp_ul_5 input[name="cmptkey"]:first');
                    ptck.attr("checked", true);
                    chptkey = ptck.val();
                }
                $("#Temp_ul_5 span").addClass("hide");
                $("#Temp_ul_5_key_span_" + chptkey).removeClass("hide");
            }
            $(".coverBg").fadeIn();
            $(".coverBg").children('.my_list').eq($index).show().siblings().not('.bottomBtn').not('.closeCover').hide();
        })
        /*选择二级项目*/
        $(".my_list ul li").click(function () {
            $(this).parents('.my_list').siblings().find('li').removeClass('selectLi');
            $(this).toggleClass('selectLi');
        })
        /*点击确定  + X 隐藏遮罩*/
        $('.bottomBtn .mybtn,.closeCover').click(function () {
            $(".coverBg").hide();
            $scope.getSelected();
        })
    })

	jeDate({
		dateCell:"#startTime",
		isinitVal:true,
		isTime:true, 
		minDate:"2008-08-08 08:08:08"
	});
	jeDate({
		dateCell:"#endTime",
		isinitVal:true,
		isTime:true, 
		minDate:"2008-08-08 08:08:08"
	});
    $scope.goHistoryData = function () {
        window.location.href = 'analysisQuery.html?storageID=' + $scope.rdcId;
    }

    $scope.goReport = function () {
        window.location.href = 'analysisReport.html?storageID=' + $scope.rdcId;
    }
});
