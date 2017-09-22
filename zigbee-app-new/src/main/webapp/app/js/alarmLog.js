checkLogin();
app.controller('alarmLog', function ($scope, $location, $http, $rootScope, userService) {
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?type=1&filter=";
    $scope.alarmTotalCnt = 0;
    $scope.alarmMsgs = [];

    $scope.initData=function(){
        $scope.tempwarLog={};
        angular.forEach($rootScope.mystorages, function (storage) {
            $http.get(ER.coldroot +'/i/AlarmController/getOverTempAnalysis', {  params: { "oids": storage.id ,"rdcId": $rootScope.rdcId } }).success(function (data) {
                $scope.tempwaning=[];
                if(data.success){
                    var datalist=  data.entity,xAxis=[],count=[],time=[];
                    angular.forEach(datalist,function(item,i){
                        xAxis.push(i);
                        time.push(item[0]);
                        count.push(item[1]);
                        if(item[1]>0){
                            var msg=new Object();
                            msg.time=i;
                            msg.style="background:#ED3F1D";
                            msg.count=item[1];
                            msg.msg="当前所有冷库累计"+item[1]+"次告警,累计时长："+item[0]+"分钟";
                            $scope.tempwaning.push(msg);
                        }
                    });
                    if( $scope.tempwaning.length==0){
                        var msg=new Object();
                        msg.time=time[7];
                        msg.msg="暂无告警信息";
                        msg.count=0;
                        $scope.tempwaning.push(msg);
                    }
                    $scope.tempwarLog[storage.id]=$scope.tempwaning.reverse();
                    $scope.dwechar("tem_div_"+storage.id, xAxis, count, time);
                }
            });
        });
        $scope.model=["详细","关闭"];
    };

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var rootRdcId = $.getUrlParam('storageID');


    $(".mylog").click(function (event) {
        var _index = $(this).index();
        $('.warn_sec>div').eq(_index).show().siblings().hide();
        $(this).addClass('current').siblings().removeClass('current');
    })
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
        console.log($scope.changeTempEcharts());
    });
    $scope.changeTempEcharts=function () {
        $http.get(ER.coldroot+'/i/coldStorageSet/findStorageSetByUserId' ,{params: {rdcId:$rootScope.rdcId,userId:user.id,type:user.type}} ).success(function(data,status,headers,config){// 初始化冷库
            $rootScope.Tempset=[];
            $rootScope.mystorages = data;
            $rootScope.storageModal = data[0];
            console.log($scope.initData());
        });
    }
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
        $http.get(ER.coldroot + '/i/warlog/getWarningInfoByRdcID', {
            params: {
                "rdcId": rdcId
            }
        }).success(function (data) {
            if (data) {
            	$scope.warLog = data.warLog;
	            $scope.warInfo = data.warInfo;
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
    };
    //展示详细信息
    $scope.showdatil=function(obj,storageId){
        if(obj.datilList==undefined){
            $http.get(ER.coldroot + '/i/AlarmController/getOverTempDetail', {  params: { "rdcId":  $rootScope.rdcId ,time:obj.time,oids:storageId  } }).success(function (data) {
                obj.datilList=data;
            });
        }
        obj.isshow=obj.isshow==1?0:1;
    };
    $scope.dwechar=function(emid,xAxis,count,time){

        // 指定图表的配置项和数据
        var option = {
            legend: { data:['告警次数','告警时长'] },
            tooltip: {  trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999'  }} ,textStyle: {  fontSize: 13} },
            grid:{
                x:"40",
                x2:'40'
            },
            xAxis: [
                {
                    type: 'category',
                    axisPointer: {  type: 'shadow' },
                    data: xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '次数/次',
                    interval: 1,
                    axisLabel: { formatter: '{value}' }
                },
                {
                    type: 'value',
                    name: '时长/min',
                    interval: 30,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name:'告警次数',
                    type:'bar',
                    data:count
                },
                {
                    name:'告警时长',
                    type:'line',
                    yAxisIndex: 1,
                    data:time
                }
            ]
        };
        var myChart = echarts.init(document.getElementById(emid));
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


    }
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
        console.log($scope.changeTempEcharts());
    }

});
