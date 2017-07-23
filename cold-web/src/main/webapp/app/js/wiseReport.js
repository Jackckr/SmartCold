
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('wiseReport', function( $scope, $rootScope,$stateParams,$http,$state ,$timeout,baseTools) {
	if($rootScope.aclmap&&!$rootScope.aclmap[20]){return;}
	$scope.isnotprint=true;$scope.isloaderr=false;//当前是否是打印状态和加载状态
	$scope.rdcId = $stateParams.rdcId;
	$scope.isreportMoth=false; 
	$scope.titmode=["月度","七天"], $scope.fontcol=['red' ,'#ED561B' ,'#058DC7' ];

	$("#loding").show(); $scope.loadindex=0;//已完成加载数据
	$scope.charArray={},//图表对象
	$scope.charressum={},//图表数据
	$scope.charrestmsg={};
	$("#date04").jeDate({isinitVal:true,festival:false, ishmsVal:false,isToday:false, initAddVal:[-30],minDate: '2016-05-01 23:59:59', maxDate: $.nowDate(-30),  format:"YYYY-MM",zIndex:100});
	$("#date05").jeDate({  isinitVal:true, initAddVal:[-7], festival: true, format: 'YYYY-MM-DD',maxDate: $.nowDate(-7),});
	
	var firstDate = new Date(); firstDate.setDate(firstDate.getDate()-7);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(); endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); $scope.timeuRange=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	//数据模型
	var mode={url:["/i/coldStorage/findAnalysisByRdcidKeysDate","/i/coldStorage/findDoorSisByRdcidKeyDate"],
			  val:[[75,120],[2,5],[0.1,0.15],[30,50],[3,5], [25,50], [],[],[5,10,20]],
			  tmg:[",温控",",温控",",温控",",开门操作",",开门操作",",货物流通情况",",温控",",温控",",温控",],
			  msg:[["优良","一般","不理想"],["优良","一般","不理想"], ["优良","一般","不理想"],["优良","一般","不理想"],["规范","一般","频繁"],["优良","一般","不理想"],[],[], [0,1,2,3]]};
	//===================================================================================工具类start==================================================================================
	var util = {
			getMsg:function(index,avgval){var vls=mode.val[index];for (var i = 0; i < vls.length; i++) {if(avgval<=vls[i]){ return mode.msg[index][i]; }}return mode.msg[index][mode.msg[index].length-1];},
			getpieoption:function(title,unit,ldata,sData){return {title :{ text: title,  x:'center', y : 10 },tooltip:{trigger: 'item',formatter: function (obj) {return obj.name +":"+obj.value.toFixed(2)+ unit+' 占比：' + obj.percent + '%';} },legend: {x:'right',orient:'vertical',y: 30,data:ldata}, series : [ {type:'pie',radius : '55%',center: ['50%', '60%'],data:sData, precision: 2, itemStyle: {normal: {label: {show: true, position: 'top',formatter: function (obj) {return obj.name +":"+obj.value.toFixed(2)+ unit+' 占比：' + obj.percent + '%';}}} },}]};},
			getlineoption:function(title,ldata,xData,seriesdata){return {series : seriesdata, tooltip : { trigger : 'axis' }, grid : { x:40,y2 : 30, width : '88%' ,height:'67%'},legend : { data : ldata, y : 35 },title : { text : title, x : 'center', y : 5 },yAxis : [ { type : 'value', axisLabel : { formatter : '{value}' } } ],xAxis : [ { type : 'category',splitLine:{show:false}, axisLabel : {rotate : '60',interval : 0},data :xData}]};}
	};
	$scope.toolchart = function(index,url,emid,title,keys,nuit,msge,sunit ){
		$http.get(url,{params: {  "rdcid": $scope.rdcId,'keys':keys,"startTime": $scope.startTime,"endTime": $scope.endTime}}).success(function(data,status,config,header){
			++$scope.loadindex;
			if(data!=null){
				var ldata=[],seriesdata=[],maxxdata=0,xydata=null,xData =[],restmsg=[];
				angular.forEach(data,function(storage,name){
					var yData =[],sumval=0; ldata.push(name);
					if(storage[keys].length>maxxdata){ maxxdata=storage[keys].length; xydata=storage[keys];  };
					angular.forEach(storage[keys],function(item){  var val=item['value']/nuit ;  yData.unshift(val); sumval+=val;  });
					var avg=(sumval/storage[keys].length).toFixed(2);
					if(!isNaN(avg)){
						  restmsg.push({name :name,avgval:avg,msg:name+msge+avg+sunit+" "+mode.tmg[index]+util.getMsg(index,avg)}); 
						  seriesdata.push({name : name,type : 'line',data : yData, markLine: { data: [  {type: 'average', name: '平均值'}]}});
					}
				});
				if(xydata!=null){
					angular.forEach(xydata,function(item){  xData.unshift(baseTools.formatTime(item['date']).split(" ")[0]); });
					var myChart= echarts.init(document.getElementById(emid));
					myChart.setOption(util.getlineoption(title, ldata, xData, seriesdata));
					$scope.charArray[index]=myChart;
					$scope.charrestmsg[index]=restmsg;
				}else{
					$scope.loadindex=11; //$scope.isloaderr=true;
				}
			}
		});
	};
	//===================================================================================工具类end==================================================================================
	//1.系统评分
	$scope.pysical=function(){
		//获得分析结果
		
		$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime} }).success(function(data,status,config,header){ if(data.success){ 
			++$scope.loadindex;$scope.pysicaldata=data.entity;
		}});
	};
	$scope.initRdcreportsis=function(){
		//获得分析结果
		$http({method:'POST',url:'/i/AnalysisController/getRdcreportsis',params:{"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime}}).success(function (data) {
			if(data!=null&&data.length>0){ $scope.rdcsis=data[0];}else{$scope.rdcsis=null;}
	    });
	};
	//
	$scope.initlineChar = function(){//初始化折现图
		 $scope.toolchart(0,mode.url[0], 'tempertureId', '超温时长(min/day)', 'ChaoWenShiJian', 60, " 平均日超温时长","分钟");//超温时长0
    	 $scope.toolchart(1,mode.url[0], 'cwyzId', '超温比例(ε)', 'ChaoWenYinZi', 1, " 平均日超温因子",'');//超温因子1
//	     $scope.toolchart(2,mode.url[0], 'bwyzId', '保温因子(τ)', 'BaoWenYinZi', 1, " 平均日保温因子");//保温因子2
	     $scope.toolchart(3,mode.url[0], 'openDoorTimesId', '日开门次数', 'DoorOpenTimes', 1, " 平均日开门次数",'次');//开门次数3
	     $scope.toolchart(4,mode.url[1], 'singleOpenDoorId', '单次开门时长', 'AvgTime', 60, " 平均日单次开门时长",'分钟');//4
	     $scope.toolchart(5,mode.url[0], 'goodsId', '货物因子', 'GoodsLiuTongYinZi', 1, " 月平均货物因子为",'');//4
//	     $scope.toolchart(6,mode.url[0], 'ysjRunningTimeId', '压缩机运行时间', 'GoodsLiuTongYinZi', 1, " 压缩机运行时间");//-----没做
//	     $scope.toolchart(7,mode.url[0], 'onOffCycleId', '设备开关周期', 'GoodsLiuTongYinZi', 1, " 设备开关周期");//4-----没做
//	     $scope.toolchart(7,mode.url[0], 'onOffCycleId', '设备开关周期', 'GoodsLiuTongYinZi', 1, " 设备开关周期");//4-----没做
	};       
	
	$scope.initQsis=function(){//8
		$http.get('/i/AnalysisController/getQAnalysisByMonth',{params: {rdcId:$scope.rdcId,"stTime": $scope.startTime,"edTime": $scope.endTime}} ).success(function(data,status,headers,config){
			++$scope.loadindex;if(data!=null){
				var sumaq=0,sdata=[],mi=0;
				var zbmsg=['偏小','良好','偏大','严重偏大'],yhmsg=['有增加空间','无需优化','需优化','需优化'];
				var ldata=['Q货','Q霜','Q叉','Q保','Q风','Q门','Q照'], keys=['GoodsHeat','QFrost','QForklift','WallHeat','Qblower','Qctdoor','Qlighting'];
			    for ( var i in data) {  data[i].key= ldata[keys.indexOf(data[i].key)]; sumaq+=data[i].sumq; }//转换名称
				 $.each(data, function(i, vo){ 
					  vo.zb=(vo.sumq/sumaq*100).toFixed(2);   mi= util.getMsg(8, vo.zb); vo.zbm=zbmsg[mi];vo.yhm=yhmsg[mi]; sdata.push({name:vo.key,value:vo.sumq});
				});
				$scope.charrestmsg[8]=data;
				var myChart = echarts.init(document.getElementById('hotId'));
				myChart.setOption(util.getpieoption(	$scope.titmode[$scope.isreportMoth?0:1]+'平均热量分布', 'kj',ldata, sdata));
				$scope.charArray[8]=myChart;
            }
		});
    };
    //获得电表
    $scope.initPowersis=function(){//9
    	$http.get('/i/AnalysisController/getSumkeySisByKey',{params: {rdcId: $scope.rdcId,type:10,key:'TotalPWC',stTime: $scope.startTime,edTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;
    		if(data){
    			var ldata=[],totalpwc=0;
    			$scope.charrestmsg[9]=data;
    			$.each(data, function(i, vo){
    				totalpwc+=vo.value;
    				ldata.push(vo.name); 
    			});
    			var myChart = echarts.init(document.getElementById('electricId'));
				myChart.setOption(util.getpieoption(	$scope.titmode[$scope.isreportMoth?0:1]+'累计耗电比','kW', ldata, data));
				$scope.charArray[9]=myChart;
				$scope.charressum[9]=totalpwc;
    		}
    	});
    };
    //获得水耗
    $scope.initWaterCostsis=function(){//10
    	$http.get('/i/AnalysisController/getSumkeySisByKey',{params: {rdcId: $scope.rdcId,type:3,key:'WaterCost',stTime: $scope.startTime,edTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;if(data){
    			var ldata=[],totalwater=0;
    			$scope.charrestmsg[10]=data;
    			$.each(data, function(i, vo){totalwater+=vo.value;  ldata.push(vo.name); });
    			var myChart = echarts.init(document.getElementById('waterId'));
    			myChart.setOption(util.getpieoption('月累计水耗比','T', ldata, data));
    			$scope.charArray[10]=myChart;
    			$scope.charressum[10]=totalwater;
    		}
    	});
    };
    //系統效率
    $scope.initQEsis=function(){//11    Integer rdcId,String startTime, String endTime
    	$http.get('/i/AnalysisController/getQEAnalysis',{params: {rdcId: $scope.rdcId,startTime: $scope.startTime,endTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;
    		if(data.success){
    			var ldata=[],sdata=[];
    			var qesis=data.entity.tbdata;
    			$.each(qesis, function(i, vo){  ldata.push(i);  sdata.push(qesis[i][0]); });
    		    var myChart = echarts.init(document.getElementById('energyEfficiencyId'));
    			var option = {
    				tooltip : { trigger : 'axis' },grid : { x:40,y2 : 30, width : '88%' ,height:'67%'},
	    			title : { text : '制冷系统运行效率趋势', x : 'center', y : 20 },
	    			series : [ {name : '系统效率',type : 'line',data : sdata} ],
	    			yAxis : [ {type : 'value',axisLabel : {formatter : '{value}'}}],
	    			xAxis : [ {type : 'category',splitLine:{ show:false }, axisLabel : {rotate : '60',interval : 0},data :ldata}]
	    		};
    			myChart.setOption(option);//title,ldata,xData,seriesdata
    			$scope.charArray[11]=myChart;
    		}else{
    			$scope.loadindex=11; //$scope.isloaderr=true;
    		}
    		
    	});
    };
    
    	
    	
    	
    //============================================================================压缩机运行分析==============================================================================
    $scope.initcompruntime=function(){
			var option6 = {
					title : { text : '压缩机运行时间', x : 'center', y : 20 },
					tooltip : { trigger : 'axis' },
					xAxis : [ { type : 'category', name:'min',  splitLine:{    show:false   },  axisLabel : { interval : 0 }, data : [ '<5', '5-9', '10-19', '20-29','30-59', '60-119', '120-300', '>300']} ],
					grid : { x:40, y2 : 110, width : '80%' },
					yAxis : [ { name:'%', type : 'value', axisLabel : { formatter : '{value}' } } ],
					series : [ { name : '运行时间', type : 'bar', data : [ 68,40,10,15,9,2,1,1 ], } ]
				};
			
		    var	myChart6 = echarts.init(document.getElementById('ysjRunningTimeId'));
			myChart6.setOption(option6);
			$scope.charArray[6]=myChart6;
    };
	//==========================================================================================================================================================
    $scope.initwar=function(){
    	
    	
    };
    
    
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
    	    $scope.initRdcreportsis();
    	    $scope.initlineChar();
    	    $scope.initQsis();
    	    $scope.initPowersis();
    	    $scope.initWaterCostsis();
    	    $scope.initQEsis();
    	    $scope.initcompruntime();
    	    $timeout($("#loding").hide(),0);
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
    	$("#loding").show();
		if($scope.isreportMoth){
			var data=$("#date04").val(),newDate=data.split("-");
	    	if(newDate.length!=2){ return; }
	    	 firstDate = new Date();firstDate.setFullYear(newDate[0], newDate[1]-1, 1);firstDate.setHours(0); firstDate.setMinutes(0); firstDate.setSeconds(0);//设置上月的第一天
	    	 endDate = new Date(firstDate);  endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23); endDate.setMinutes(59); endDate.setSeconds(59);//设置上月的最后一天
	    	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); 
	    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	    	if(newtime==$scope.timeuRange){$("#loding").hide();return;} $scope.timeuRange=newtime;
	    	$scope.datemod=[[$scope.startTime,data+'-05 23:59:59'],[data+'-06 00:00:00',data+'-10 23:59:59'],[data+'-11 00:00:00',data+'-15 23:59:59'],[data+'-16 00:00:00',data+'-20 23:59:59'],[data+'-21 00:00:00',data+'-25 23:59:59'],[data+'-25 00:00:00',$scope.endTime]];
		}else{
			var newDate=$("#date05").val();
	    	 firstDate = new Date(newDate+' 00:00:00'), endDate =  new Date(newDate+' 23:59:59');  
	    	endDate.setDate(firstDate.getDate()+7);
	    	$scope.endTime= baseTools.formatTime(endDate); 
	    	$scope.startTime= baseTools.formatTime(firstDate); 
	    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	    	if(newtime==$scope.timeuRange){$("#loding").hide();return;}
	    	$scope.timeuRange=newtime;
		}
		 $scope.initdata();
    };
    $scope.changeversions=function(index,url,$event){
		var em=$($event.target); em.addClass('select').siblings().removeClass('select');
		$state.go(url, {'rdcId':$scope.rdcId });
	};
	$scope.Preview=function(){ //打印预览
		  $scope.isnotprint=false;
		  angular.forEach($scope.charArray,function(item){ $("#"+item.dom.id+"_img").html(item.getImage('jpeg').outerHTML); });
		  $timeout(printpage,0); $timeout(chanpangstatus,0);//加入js队列
	};
	$('.goTop').click(function(event){$('html,body').stop().animate({'scrollTop':0}, 200);});
	$(window).scroll(function(event) {if ($(window).scrollTop() >= $(window).height()) {$('.goTop').show();} else {$('.goTop').hide();}});//一键回到顶部
   
});
