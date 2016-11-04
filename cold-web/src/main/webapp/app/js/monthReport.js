
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('monthReport', function( $scope, $rootScope,$stateParams,$http ,$timeout,baseTools) {
	$scope.isnotprint=true;//当前是否是打印状态
	$scope.rdcId = $stateParams.rdcId;
	$("#loding").show(); $scope.loadindex=0;//已完成加载数据
	$scope.charArray={},$scope.charrestmsg={};//图表信息,分析信息
	var firstDate = new Date(); firstDate.setMonth(firstDate.getMonth()-1); firstDate.setDate(1);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(firstDate); endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate);
	//数据模型
	var mode={url:["/i/coldStorage/findAnalysisByRdcidKeysDate","/i/coldStorage/findDoorSisByRdcidKeyDate"],
			  val:[[75,120],[2,5],[0.1,0.15],[30,50],[3,5], [25,50], [],[],[5,10,20]],
			  tmg:[",温控",",温控",",温控",",库门操作",",库门操作",",货物流通情况",",温控",",温控",",温控",],
			  msg:[["优良","一般","不理想"],["优良","一般","不理想"], ["优良","一般","不理想"],["优良","一般","不理想"],["规范","一般","频繁"],["优良","一般","不理想"],[],[], [0,1,2,3]]};
	//===================================================================================工具类start==================================================================================
	var util = {
			getMsg:function(index,avgval){var vls=mode.val[index];for (var i = 0; i < vls.length; i++) {if(avgval<=vls[i]){ return mode.msg[index][i]; }}return mode.msg[index][mode.msg[index].length-1];},
			getpieoption:function(title,ldata,sData){return {title :{ text: title,  x:'center', y : 20 },tooltip:{trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)" },legend: {y: 'bottom',data:ldata}, series : [ {type:'pie',radius : '55%',center: ['50%', '60%'],data:sData}]};},
			getlineoption:function(title,ldata,xData,seriesdata){return {series : seriesdata, tooltip : { trigger : 'axis' }, grid : { y2 : 110, width : '80%' },legend : { data : ldata, y : 'bottom' },title : { text : title, x : 'center', y : 20 },yAxis : [ { type : 'value', axisLabel : { formatter : '{value}' } } ],xAxis : [ { type : 'category',splitLine:{show:false}, axisLabel : {rotate : '60',interval : 0},data :xData}]};}
	};
	$scope.toolchart = function(index,url,emid,title,keys,nuit,msge ){
		$http.get(url,{params: {  "rdcid": $scope.rdcId,'keys':keys,"startTime": $scope.startTime,"endTime": $scope.endTime}}).success(function(data,status,config,header){
			++$scope.loadindex;if(data!=null){
				var ldata=[],seriesdata=[],maxxdata=0,xydata=null,xData =[],restmsg=[];
				angular.forEach(data,function(storage,name){
					var yData =[],sumval=0; ldata.push(name);
					if(storage[keys].length>maxxdata){ maxxdata=storage[keys].length; xydata=storage[keys];  };
					angular.forEach(storage[keys],function(item){  var val=item['value']/nuit ;  yData.unshift(val); sumval+=val;  });
//					if(sumval){
						var avg=(sumval/storage[keys].length).toFixed(2);
					    restmsg.push({name :name,avgval:avg,msg:name+msge+avg+",温控"+util.getMsg(index,avg)}); 
//					}
					seriesdata.push({name : name,type : 'line',data : yData, markLine: { data: [  {type: 'average', name: '平均值'}]}});
				});
				angular.forEach(xydata,function(item){  xData.unshift(baseTools.formatTime(item['date']).split(" ")[0]); });
				var myChart= echarts.init(document.getElementById(emid));
				myChart.setOption(util.getlineoption(title, ldata, xData, seriesdata));
				$scope.charArray[index]=myChart;
				$scope.charrestmsg[index]=restmsg;
			}
		});
	};
	//===================================================================================工具类end==================================================================================
	//1.系统评分
	$scope.pysical=function(){
		$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime} }).success(function(data,status,config,header){ if(data.success){ 
			++$scope.loadindex;$scope.pysicaldata=data.entity;
		}});
	};
	//
	$scope.initlineChar = function(){//初始化折现图
		 $scope.toolchart(0,mode.url[0], 'tempertureId', '超温时长(min/day)', 'ChaoWenShiJian', 60, " 平均日超温时长");//超温时长0
    	 $scope.toolchart(1,mode.url[0], 'cwyzId', '超温因子(ε)', 'ChaoWenYinZi', 1, " 平均日超温因子");//超温因子1
	     $scope.toolchart(2,mode.url[0], 'bwyzId', '保温因子(τ)', 'BaoWenYinZi', 1, " 平均日保温因子");//保温因子2
	     $scope.toolchart(3,mode.url[0], 'openDoorTimesId', '日开门次数', 'DoorOpenTimes', 1, " 平均日开门次数");//开门次数3
	     $scope.toolchart(4,mode.url[1], 'singleOpenDoorId', '单次开门时长', 'AvgTime', 60, " 平均日单次开门时长");//4
	     $scope.toolchart(5,mode.url[0], 'goodsId', '货物因子', 'GoodsLiuTongYinZi', 1, " 的月平均货物因子为");//4
//	     $scope.toolchart(6,mode.url[0], 'ysjRunningTimeId', '压缩机运行时间', 'GoodsLiuTongYinZi', 1, " 压缩机运行时间");//-----没做
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
				myChart.setOption(util.getpieoption('月平均热量分布', ldata, sdata));
				$scope.charArray[8]=myChart;
            }
		});
    };
    //获得电表
    $scope.initPowersis=function(){//9
    	$http.get('/i/AnalysisController/getSumkeySisByKey',{params: {rdcId: $scope.rdcId,type:10,key:'TotalPWC',stTime: $scope.startTime,edTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;if(data){
    			var ldata=[];
    			$scope.charrestmsg[9]=data;
    			$.each(data, function(i, vo){  ldata.push(vo.name); });
    			var myChart = echarts.init(document.getElementById('electricId'));
				myChart.setOption(util.getpieoption('月累计耗电比', ldata, data));
				$scope.charArray[9]=myChart;
    		}
    	});
    };
    //获得水耗
    $scope.initWaterCostsis=function(){//10
    	$http.get('/i/AnalysisController/getSumkeySisByKey',{params: {rdcId: $scope.rdcId,type:3,key:'WaterCost',stTime: $scope.startTime,edTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;if(data){
    			var ldata=[];
    			$scope.charrestmsg[10]=data;
    			$.each(data, function(i, vo){  ldata.push(vo.name); });
    			var myChart = echarts.init(document.getElementById('waterId'));
    			myChart.setOption(util.getpieoption('月累计水耗比', ldata, data));
    			$scope.charArray[10]=myChart;
    		}
    	});
    };
    //系統效率
    $scope.initQEsis=function(){//11    Integer rdcId,String startTime, String endTime
    	$http.get('/i/AnalysisController/getQEAnalysis',{params: {rdcId: $scope.rdcId,startTime: $scope.startTime,endTime: $scope.endTime}}).success(function(data,status,config,header){
    		++$scope.loadindex;if(data.success){
    			var ldata=[],sdata=[];
    			var qesis=data.entity.tbdata;
    			$.each(qesis, function(i, vo){  ldata.push(i);  sdata.push(qesis[i][0]); });
    		    var myChart = echarts.init(document.getElementById('energyEfficiencyId'));
    			var option = {
    				tooltip : { trigger : 'axis' },grid : {y2 : 110,width : '80%'},
	    			title : { text : '制冷系统运行效率趋势', x : 'center', y : 20 },
	    			series : [ {name : '系统效率',type : 'line',data : sdata} ],
	    			yAxis : [ {type : 'value',axisLabel : {formatter : '{value}'}}],
	    			xAxis : [ {type : 'category',splitLine:{ show:false }, axisLabel : {rotate : '60',interval : 0},data :ldata}]
	    		};
    			myChart.setOption(option);//title,ldata,xData,seriesdata
    			$scope.charArray[11]=myChart;
    		}
    		
    	});
    };
    
    //============================================================================看不懂==============================================================================
	var option7 = {
			title : { text : '压缩机运行时间', x : 'center', y : 20 },
			tooltip : { trigger : 'axis' },
			xAxis : [ { type : 'category', name:'min',  splitLine:{    show:false   },  axisLabel : { interval : 0 }, data : [ '<5', '5-9', '10-19', '20-29','30-59', '60-119', '120-300', '>300']} ],
			grid : { x:40, y2 : 110, width : '80%' },
			yAxis : [ { name:'%', type : 'value', axisLabel : { formatter : '{value}' } } ],
			series : [ { name : '运行时间', type : 'bar', data : [ 68,40,10,15,9,2,1,1 ], } ]
		};
	var option8 = {
			title : { text : '设备的开关周期',x : 'center', y : 20},
			tooltip : {trigger : 'axis'},
			legend : {data : [ '每天或现行小时的次数', '每小时最高次数' ],y : 'bottom'},
			xAxis : [ {type : 'category', splitLine:{ show:false}, axisLabel : {interval : 0},data : [ '已55分钟','已08小时55分钟','-1天','-2天','-3天','-4天','-5天','-6天' ] } ],
			grid : {x:'40',y2 : 110,width : '80%'},
			yAxis : [ {type : 'value',name:'次数',axisLabel : {formatter : '{value}'}
			} ],
			series : [ {name : '每天或现行小时的次数',type : 'bar',data : [ 0,0,255,125,110,130,110,90 ],}, {name : '每小时最高次数',type : 'bar',data : [ 0,0,10,15,10,8,7,12 ]} ]
		};
    var	myChart7 = echarts.init(document.getElementById('ysjRunningTimeId'));
    var	myChart8 = echarts.init(document.getElementById('onOffCycleId'));
	myChart7.setOption(option7);
	myChart8.setOption(option8);
	$scope.charArray[7]=myChart7;
	$scope.charArray[8]=myChart8;
	//==========================================================================================================================================================
	$scope.pysical();
    $scope.initlineChar();
    $scope.initQsis();
    $scope.initPowersis();
    $scope.initWaterCostsis();
    $scope.initQEsis();

    function printpage(){$.print('#print');}
    function chanpangstatus(){$scope.isnotprint=true;}
	$scope.Preview=function(){ //打印预览
		  $scope.isnotprint=false;
		  angular.forEach($scope.charArray,function(item){ $("#"+item.dom.id+"_img").html(item.getImage('jpeg').outerHTML); });
		  $timeout(printpage,0); $timeout(chanpangstatus,0);//加入js队列
	 };
    
});
