
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('monthReport2', function( $scope, $rootScope,$stateParams,$http ,$timeout,baseTools) {
	  $scope.colors= ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];  Highcharts.setOptions({  global: {useUTC: false } ,colors:$scope.colors });
	
	$scope.rdcId = $stateParams.rdcId;$scope.isnotprint=true;
	$("#date04").jeDate({isinitVal:true,festival:false, ishmsVal:false,isToday:false, initAddVal:[-30],minDate: '2016-05-01 23:59:59', maxDate: $.nowDate(-30),  format:"YYYY-MM",zIndex:100});
	var firstDate = new Date(); firstDate.setMonth(firstDate.getMonth()-1); firstDate.setDate(1);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(firstDate); endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate);
	$scope.startTime= baseTools.formatTime(firstDate);
	$scope.timeuRange=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);

	$scope.oids=[],$scope.names=[];//当前登陆tempid;
	
	$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime} }).success(function(data,status,config,header){ if(data.success){ 
		$scope.pysicaldata=data.entity;
	}});
	
	$scope.changestorage=function(index,storageid){
		$scope.cuttstorage=$rootScope.mystorages[index];
		$scope.initTemp();
		$scope.dwrtemplin();
		$scope.initTempWarningmsg();
	};
	
	$scope.initTemp=function(){
			if($rootScope.Tempset&&$rootScope.Tempset[$scope.storageID]){
		   		 $scope.oids=$rootScope.Tempset[$scope.storageID].oids;$scope.names=$rootScope.Tempset[$scope.storageID].names;$scope.loadTemp();
		   	}else{
		   		 $http.get('/i/temp/getTempsetByStorageID', { params: {"oid": $scope.cuttstorage.id}}).success(function (data) {if(data){
		   		    	 	angular.forEach(data,function(obj,i){$scope.oids.push(obj.id);$scope.names.push(obj.name);});
		   		    	 	 $rootScope.Tempset[$scope.cuttstorage.id]={oids:$scope.oids,names:$scope.names};
		   		    	   	 $scope.loadTemp();
		   		 };});	
		   	};
	};
	
	 $scope.loadTemp = function () {
	    	if($scope.oids.length==0){return;};
	    	var maxTime=endDate.getTime();
	        $http.get('/i/temp/getTempByTime', { params: {"oid":$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":$scope.startTime, "endTime":$scope.endTime}}).success(function (result) {
	        	var yData = [], tempMap = result.tempMap,systime=result.systime;
	            var datumTemp =  parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
	            $scope.cuttstorage.datumTemp=datumTemp;
	        	var i= 0,tempList=newdata = [],vo=cuttime=null; 
	            for(var key in tempMap) { 
	             	 vo=cuttime=null, tempList=tempMap[key], newdata = [];
	                 if( tempList.length>0){
		                 for ( i = 0; i < tempList.length; i++) {
							 vo=tempList[i];
							 cuttime=new Date(vo.addtime).getTime();
		                	 newdata.push({ x: cuttime,y: vo.value});
						}
		                if( systime-cuttime>1800000&&systime-maxTime<1200000){//大于半个小时。。提醒
		                	newdata.push({ x: maxTime,y:null}); 
		                }   
	                 }else{
	                	 newdata.push({ x: firstDate.getTime(),y:null});
	                	 newdata.push({ x: maxTime,y:null});
	                 }
	                yData.push({"name": key, "data": newdata});
	            } 
	            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data: [{x: firstDate.getTime(),y: datumTemp},{x: endDate.getTime(),y: datumTemp}]});//处理基准温度
	            $scope.initHighchart(datumTemp,yData);
	          });
	         
	    };
	    $scope.initHighchart=function(datumTemp,yData ){
	           new Highcharts.Chart({
	        	  series: yData,
	              legend: { enabled: false },
	              exporting: {enabled: false},
	              credits: { enabled: false },
	              plotOptions: { series: { marker: { enabled: false } }},
	              title: { text: '' },
	              xAxis: {  type: 'datetime', tickPixelInterval: 150,  },
	              yAxis: {title: {text: '温度(℃)' }, plotLines: [{value: 0,width: 1, color: '#808080' },  { color: 'red',   dashStyle: 'solid',   value: datumTemp, width: 2, label: {  text: '基准温度(' + datumTemp + '℃)',align: 'right',   x: 0   }  }] },
	              tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2); } },
	              chart: {
	                  type: 'spline',
	                  renderTo: 'temperatureChart',
	                  animation: Highcharts.svg, // don't animate in old IE
	                  marginRight: 10,
	                  backgroundColor: {  linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},stops: [ [0, 'rgb(210, 214, 222)'],[1, 'rgb(210, 214, 222)'] ]  }, borderColor: '#d2d6de', borderWidth: 2, className: 'dark-container', plotBackgroundColor: 'rgba(210, 214, 222, .1)',  plotBorderColor: '#d2d6de', plotBorderWidth: 1
	              }
	          });
	    };
	    
	$scope.dwrtemplin=function(){
		$http.get('/i/AnalysisController/getAnalysisDataByKey', { params: {type:1, oid:$scope.cuttstorage.id, keys:'OverTempL1Time,OverTempL2Time,OverTempL3Time,OverTempL1Count,OverTempL2Count,OverTempL3Count', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			if(data&&data.OverTempL1Time){
				var xdata=[],l1time=[],l1tailtime=0, l1tailcount=0,l2tailcount=0,l3tailcount=0, l1count=[],l2time=[],l2count=[],l3time=[],l3count=[];
				angular.forEach(data.OverTempL2Time, function(obj,i){ l2time.unshift(obj.value);});
				angular.forEach(data.OverTempL3Time, function(obj,i){ l3time.unshift(obj.value);});
				angular.forEach(data.OverTempL2Count,function(obj,i){l2count.unshift(obj.value);l2tailcount+=obj.value;});
				angular.forEach(data.OverTempL3Count,function(obj,i){l3count.unshift(obj.value);l3tailcount+=obj.value;});
				angular.forEach(data.OverTempL1Count,function(obj,i){l1count.unshift(obj.value); l1tailcount+=obj.value;});
				angular.forEach(data.OverTempL1Time,function(obj,i){xdata.unshift(baseTools.formatTime(obj.date).split(" ")[0]);l1time.unshift(obj.value);l1tailtime+=obj.value;});
		    	var score=100-l1tailcount*10-l2tailcount/4*5-l3tailcount/8*2;
				$scope.cuttstorage.l1tailtime=l1tailtime;
				$scope.cuttstorage.l1tailcount=l1tailcount;
				$scope.cuttstorage.score=score<35?35:score;
				$('#tempwarning').highcharts({
			        title: { text: null},
			        xAxis: [{  categories: xdata, crosshair: true }],
			        yAxis: [ { title: { text: '危险告警时长(min)', } },  { title: { text: '危险告次数 (次)' }, opposite: true }],
			        tooltip: { shared: true },
			        legend: { verticalAlign: 'top' },
			        series: [
			                 { name: '危险告警时长', type: 'column', yAxis: 1, data: l1time,tooltip: {  valueSuffix: ' min' } },
			                 { name: '严重告警时长', type: 'column', yAxis: 1, data: l2time,tooltip: {  valueSuffix: ' min' } },
			                 { name: '正常告警时长', type: 'column', yAxis: 1, data: l3time,tooltip: {  valueSuffix: ' min' } },
			                 { name: '危险告警次数', type: 'spline', data: l1count, tooltip: { valueSuffix: '次' }},
			                 { name: '严重告警次数', type: 'spline', data: l2count, tooltip: { valueSuffix: '次' }},
			                 { name: '正常告警次数', type: 'spline', data: l3count, tooltip: { valueSuffix: '次' }}
			                ]
			    });
			}
		});
	};
		
	$scope.initTempWarningmsg=function(){
		$http.get('/i/AlarmController/getOverTempByTime', { params: {rdcId:$scope.rdcId,  oid:$scope.cuttstorage.id,level:1, startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			$scope.warninglist=data;
		});
	};
	
	 $scope.initdata=function(){
			$scope.cuttstorage=$rootScope.mystorages[0];
			$scope.initTemp();	
			$scope.dwrtemplin();
			$scope.initTempWarningmsg();
	 };
	 
	if($rootScope.mystorages==undefined){
		  $scope.changeStorages=function(){
			   if($rootScope.mystorages!=undefined){
				   initdatawatch();
				   $scope.initdata();
			   }
		    };
		  initdatawatch= $scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
	}else{
		$scope.initdata();
	}
	  

});
