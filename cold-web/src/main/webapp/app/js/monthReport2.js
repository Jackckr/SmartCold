
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('monthReport2', function( $scope, $rootScope,$stateParams,$http ,$timeout,baseTools) {
	$scope.isnotprint=true;$scope.isloaderr=false;//当前是否是打印状态和加载状态
	$scope.rdcId = $stateParams.rdcId;
	$("#loding").show(); $scope.loadindex=0;//已完成加载数据
	$scope.charArray={},$scope.charrestmsg={};//图表信息,分析信息
	$("#date04").jeDate({isinitVal:true,festival:false, ishmsVal:false,isToday:false, initAddVal:[-30],minDate: '2016-05-01 23:59:59', maxDate: $.nowDate(-30),  format:"YYYY-MM",zIndex:100});
	
	var firstDate = new Date(); firstDate.setMonth(firstDate.getMonth()-1); firstDate.setDate(1);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(firstDate); endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); $scope.timeuRange=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	//数据模型
	var mode={url:["/i/coldStorage/findAnalysisByRdcidKeysDate","/i/coldStorage/findDoorSisByRdcidKeyDate"],
			  val:[[75,120],[2,5],[0.1,0.15],[30,50],[3,5], [25,50], [],[],[5,10,20]],
			  tmg:[",温控",",温控",",温控",",开门操作",",开门操作",",货物流通情况",",温控",",温控",",温控",],
			  msg:[["优良","一般","不理想"],["优良","一般","不理想"], ["优良","一般","不理想"],["优良","一般","不理想"],["规范","一般","频繁"],["优良","一般","不理想"],[],[], [0,1,2,3]]};
	//===================================================================================工具类start==================================================================================
	var util = {
			getMsg:function(index,avgval){var vls=mode.val[index];for (var i = 0; i < vls.length; i++) {if(avgval<=vls[i]){ return mode.msg[index][i]; }}return mode.msg[index][mode.msg[index].length-1];},
			getpieoption:function(title,ldata,sData){return {title :{ text: title,  x:'center', y : 10 },tooltip:{trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)" },legend: {x:'right',orient:'vertical',y: 30,data:ldata}, series : [ {type:'pie',radius : '55%',center: ['50%', '60%'],data:sData}]};},
			getlineoption:function(title,ldata,xData,seriesdata){return {series : seriesdata, tooltip : { trigger : 'axis' }, grid : { x:40,y2 : 30, width : '88%' ,height:'67%'},legend : { data : ldata, y : 35 },title : { text : title, x : 'center', y : 5 },yAxis : [ { type : 'value', axisLabel : { formatter : '{value}' } } ],xAxis : [ { type : 'category',splitLine:{show:false}, axisLabel : {rotate : '60',interval : 0},data :xData}]};}
	};
	//===================================================================================工具类end==================================================================================
	//1.系统评分
	$scope.pysical=function(){
		//获得分析结果

		$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime} }).success(function(data,status,config,header){ if(data.success){
			++$scope.loadindex;$scope.pysicaldata=data.entity;
		}});
	};

	//==========================================================================================================================================================
    $scope.disposeChart=function(){
    	if($scope.charArray!=null){
    		angular.forEach($scope.charArray,function(item){
        		item.clear();//销毁对象并设为null
        		 $("#"+item.dom.id).empty();
        	});
    	}
    	$scope.loadindex=0;$scope.isloaderr=false;
        window.CollectGarbage && CollectGarbage();//清理内存
    };

    $scope.initdata=function(){
		$scope.disposeChart();
		$scope.pysical();
		$scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
        $("#loding").hide();
    };
    $scope.initdata();
    function printpage(){
    	$(".chartPart").css('border',0);
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").addClass('font10');
    	$.print('#print');}
    function chanpangstatus(){
    	$scope.isnotprint=true;
    	$(".chartPart").css('border','1px solid #eee');
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").removeClass('font10');
    }
    $scope.getreport=function(){
    	var newDate=$("#date04").val().split("-");
    	if(newDate.length!=2){ return; }
    	var firstDate = new Date();firstDate.setFullYear(newDate[0], newDate[1]-1, 1);
    	firstDate.setHours(0); firstDate.setMinutes(0); firstDate.setSeconds(0);//设置上月的第一天
    	var endDate = new Date(firstDate);  endDate.setMonth(firstDate.getMonth()+1); 
    	endDate.setDate(0);endDate.setHours(23); endDate.setMinutes(59); endDate.setSeconds(59);//设置上月的最后一天
    	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); 
    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
    	if(newtime==$scope.timeuRange){return;} $scope.timeuRange=newtime;
    	 $scope.initdata();
    };
	$scope.Preview=function(){ //打印预览
		  $scope.isnotprint=false;
		  angular.forEach($scope.charArray,function(item){ $("#"+item.dom.id+"_img").html(item.getImage('jpeg').outerHTML); });
		  $timeout(printpage,0); $timeout(chanpangstatus,0);//加入js队列
	 };
	 $('.goTop').click(function(event) {
			$('html,body').stop().animate({'scrollTop':0}, 200);
	});
	$(window).scroll(function(event) {
		if ($(window).scrollTop() >= $(window).height()) {
			$('.goTop').show();
		} else {
			$('.goTop').hide();
		}
	});//一键回到顶部
	
	
	/*月度曲线图*/
	var myCharts = echarts.init(document.getElementById('monthlyChart'));
    // 指定图表的配置项和数据
    var option = {
    	    tooltip: {
    	        trigger: 'axis',
    	        axisPointer: {
    	            type: 'cross',
    	            crossStyle: {
    	                color: '#999'
    	            }
    	        }
    	    },
    	    legend: {
    	        data:['次数']
    	    },
    	    xAxis: [
    	        {
    	            type: 'category',
    	            data: ['1','4','7','10','13','16','19','22','25','28','31'],
    	            axisPointer: {
    	                type: 'shadow'
    	            }
    	        }
    	    ],
    	    yAxis: [
    	        {
    	            type: 'value',
    	            name: '次数/次',
    	            min: 0,
    	            max: 250,
    	            interval: 50,
    	            axisLabel: {
    	                formatter: '{value}'
    	            }
    	        }
    	    ],
    	    series: [
    	        {
    	            name:'次数',
    	            type:'line',
    	            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0]
    	        }
    	    ]
    	};

    // 超温时间及次数统计表
    var myCharts1 = echarts.init(document.getElementById('doublechart'));
    var option1 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data:['次数','时长']
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '次数/次',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '时长/min',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'次数',
                type:'line',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
                name:'时长',
                type:'line',
                yAxisIndex: 1,
                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myCharts.setOption(option);
    myCharts1.setOption(option1);
    window.onresize = myCharts.resize;
});
