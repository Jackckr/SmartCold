
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('monthReport2', function( $scope, $rootScope,$stateParams,$http ,$timeout,baseTools) {
	$scope.colors= ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];  Highcharts.setOptions({  global: {useUTC: false } ,colors:$scope.colors });
	$scope.isreportMoth=false;  $scope.isnotprint=false; $scope.charArray=[];
	$scope.titmode=["月度","七天"], $scope.fontcol=['red' ,'#ED561B' ,'#058DC7' ];
	$scope.rdcId = $stateParams.rdcId;$scope.isnotprint=true;$scope.index=0;
	$("#date04").jeDate({isinitVal:true,festival:false, ishmsVal:false,isToday:false, initAddVal:[-30],minDate: '2016-05-01 23:59:59', maxDate: $.nowDate(-30),  format:"YYYY-MM",zIndex:100});
	$("#date05").jeDate({  isinitVal:true, initAddVal:[-7], festival: true, format: 'YYYY-MM-DD',maxDate: $.nowDate(-7),});
	$scope.note=false;
	
	var firstDate = new Date(); firstDate.setDate(firstDate.getDate()-7);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(); endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate);
	$scope.startTime= baseTools.formatTime(firstDate);
	$scope.timeuRange=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	$scope.sumDatavalue=[[0,0],[0,0]];
	$scope.oids=[],$scope.names=[];//当前登陆tempid;
	$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId ,"stTime": $scope.startTime,"edTime": $scope.endTime} }).success(function(data,status,config,header){ if(data.success){ 
		$scope.pysicaldata=data.entity;
	}});
	function printpage(){
    	$(".chartPart").css('border',0);
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").addClass('font10');
    	$.print('#print');}
    function chanpangstatus(){
    	$scope.isnotprint=true;
    	$(".chartPart").css('border','1px solid #eee');
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").removeClass('font10');
    }
	$scope.Preview=function(){ //打印预览
		  $scope.isnotprint=false;
		  angular.forEach($scope.charArray,function(item){ 
			  $("#"+item.dom.id+"_img").html(item.getImage('jpeg').outerHTML);
			 });
		  $timeout(printpage,0); $timeout(chanpangstatus,0);//加入js队列
	 };
	
	 $scope.exppdf=function(){
		  html2canvas($('#print'), {onrendered: function(canvas) {var doc = new jsPDF('p','mm',[1600,canvas.height]); doc.addImage(canvas.toDataURL('img/notice/png'), 'JPEG', 0, 0,1600,canvas.height); doc.save($scope.cuttstorage.name+$scope.titmode[$scope.isreportMoth?0:1]+'分析报告.pdf');  } });   
	 };
//	 
	$scope.getreport=function(){
		$("#loding").show();
		if($scope.isreportMoth){
			var newDate=$("#date04").val().split("-");
	    	if(newDate.length!=2){ return; }
	    	var firstDate = new Date();firstDate.setFullYear(newDate[0], newDate[1]-1, 1);
	    	firstDate.setHours(0); firstDate.setMinutes(0); firstDate.setSeconds(0);//设置上月的第一天
	    	var endDate = new Date(firstDate);  endDate.setMonth(firstDate.getMonth()+1); 
	    	endDate.setDate(0);endDate.setHours(23); endDate.setMinutes(59); endDate.setSeconds(59);//设置上月的最后一天
	    	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); 
	    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	    	if(newtime==$scope.timeuRange){$("#loding").hide();return;} $scope.timeuRange=newtime;
		}else{
			var newDate=$("#date05").val();
	    	var firstDate = new Date(newDate+' 00:00:00'), endDate =  new Date(newDate+' 23:59:59');  
	    	endDate.setDate(firstDate.getDate()+7);
	    	$scope.endTime= baseTools.formatTime(endDate); 
	    	$scope.startTime= baseTools.formatTime(firstDate); 
	    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
	    	if(newtime==$scope.timeuRange){$("#loding").hide();return;}
	    	$scope.timeuRange=newtime;
		}
		 $scope.initdata();
	};
	
	
	
	
	$scope.changestorage=function(index,storageid,$event){
		$("#loding").show();
		var em=$($event.target);
		em.addClass('select').siblings().removeClass('select');
		$scope.index=index;
		 $scope.initdata();
	};
	
	$scope.initTemp=function(){
			if($rootScope.Tempset&&$rootScope.Tempset[$scope.storageID]){
		   		 $scope.oids=$rootScope.Tempset[$scope.storageID].oids;
		   		 $scope.names=$rootScope.Tempset[$scope.storageID].names;
		   		 $scope.loadTemp();
		   	}else{
		   		 $http.get('/i/temp/getTempsetByStorageID', { params: {"oid": $scope.cuttstorage.id}}).success(function (data) {if(data){
		   		    	var oids=[],names=[];
		   			      angular.forEach(data,function(obj,i){oids.push(obj.id);names.push(obj.name);  });
		   		    	 	 $rootScope.Tempset[$scope.cuttstorage.id]={oids:oids,names:names};
		   		    	      $scope.oids=oids; $scope.names=names;
		   		    	   	 $scope.loadTemp();
		   		 };});	
		   	};
	};
	
	 $scope.loadTemp = function () {
	    	if($scope.oids.length==0){ $("#loding").hide();return;};
	    	if($scope.isreportMoth){
	    		alert($("#date04").val());
		         $http.get('/i/temp/getTempByTime', { params: {"oid":$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":$scope.startTime, "endTime":$scope.endTime}}).success(function (result) {
		        	
		          });
		         
	    	}else{
	    		
		        $http.get('/i/temp/getTempByTime', { params: {"oid":$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":$scope.startTime, "endTime":$scope.endTime}}).success(function (result) {
		        	var xdata=[],yData = [],jxData=[],jxData1=[],jxData2=[], tempMap = result.tempMap;
		            var datumTemp =  parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff), datumTemp1 =  datumTemp+2, datumTemp2 = datumTemp-2;//基准温度
		            $scope.cuttstorage.datumTemp=datumTemp;
		        	var i= 0,tempList=[],newdata = [],vo=cuttime=null; 
		            for(var key in tempMap) { 
		             	 vo=cuttime=null, tempList=tempMap[key], newdata = [];
		                 if( tempList.length>0){
			                 for ( i = 0; i < tempList.length; i++) {
								 vo=tempList[i];
								 cuttime=baseTools.formatTime(vo.addtime);//new Date().getTime();
								 xdata.push(cuttime);
			                	 newdata.push(vo.value);//{ x: cuttime,y: 
			                	 jxData.push(datumTemp); jxData1.push(datumTemp1); jxData2.push(datumTemp2);
							}
		                 }else{
		                	 xdata.push($scope.startTime); xdata.push($scope.endTime);
		                	 newdata.push(null); newdata.push(null);
		                	 jxData.push(datumTemp); jxData.push(datumTemp); jxData1.push(datumTemp1); jxData1.push(datumTemp1); jxData2.push(datumTemp2); jxData2.push(datumTemp2);
		                 }
		                yData.push({"name": key, "data": newdata});
		            } 
		           
		            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data:jxData});//处理基准温度
		            yData.push({ name: '报警基线', color: '#f39c12',dashStyle: 'solid', marker: { symbol: 'circle' },data:jxData1,dashStyle:'dash'});//处理基准温度
		            yData.push({ name: ' ', color: '#f39c12',dashStyle: 'solid', marker: { symbol: 'circle' },data:jxData2,dashStyle:'dash'});//处理基准温度
		            $scope.initHighchart(datumTemp,xdata,yData);
		          });
	    		
	    	}
	    	
	    	
	    
	         
	    };


	    /**
	     * 初始化温度
	     */
	    $scope.initHighchart=function(datumTemp,xdata,yData ){
	    	 $scope.charArray[0]= new Highcharts.Chart('temperatureChart', {
	    	    title: { text: null,  },
	    	    subtitle: {  text: null,  },
	    	    xAxis: {  categories: xdata, tickInterval: 86400000, dateTimeLabelFormats: { week: '%Y-%m-%d'}},
	    	    yAxis: { title: {text: '温度 (°C)' },  plotLines: [{ value: 0, width: 1,   color: '#808080' }] },
	    	    tooltip: {  valueSuffix: '°C' },
	    	    series: yData,
	    	    credits: { enabled: false }
	    	});
	    	$("#loding").hide(); 
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
				$scope.cuttstorage.score=score<0?0:score;
				 $scope.charArray[1]= 	$('#tempwarning').highcharts({
			        title: { text: null},
			        xAxis: [{  categories: xdata, crosshair: true }],
			        yAxis: [{ title: { text: '报警次数 (次)' }, opposite: true },{ title: { text: '报警时长(m)', } } ],
			        tooltip: { shared: true },
			        credits: { enabled: false },
			        series: [
			                 { name: '危险告警时长', type: 'column', yAxis: 1, data: l1time,tooltip: {  valueSuffix: ' min' } ,color:'red' },
			                 { name: '严重告警时长', type: 'column', yAxis: 1, data: l2time,tooltip: {  valueSuffix: ' min' } ,color:'#ED561B'  },
			                 { name: '正常告警时长', type: 'column', yAxis: 1, data: l3time,tooltip: {  valueSuffix: ' min' } ,color:'#058DC7'  },
			                 { name: '危险告警次数', type: 'spline', data: l1count, tooltip: { valueSuffix: '次' } ,color:'red'},
			                 { name: '严重告警次数', type: 'spline', data: l2count, tooltip: { valueSuffix: '次' } ,color:'#ED561B'},
			                 { name: '正常告警次数', type: 'spline', data: l3count, tooltip: { valueSuffix: '次' } ,color:'#058DC7'}
			                ]
			    });
			}
		});
	};
	
    
	$scope.overTempAndCount=function(){
		$http.get('/i/AnalysisController/getAnalysisDataByKey', { params: {type:1, oid:$scope.cuttstorage.id, keys:'ChaoWenShiJian,ChaoWenCiShu,', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
		   var  val=0, ccount=0,ctime=0;
			var otlist=	data['ChaoWenShiJian'],oclist=	data['ChaoWenCiShu'];
		     var xAxis=[],count=[],time=[];
			 angular.forEach(otlist,function(item){ 
				    val=parseFloat((item['value'] / 60).toFixed());
				   ctime+=val;
				    xAxis.unshift(baseTools.formatTime(item['date']).split(" ")[0]);
					time.unshift(val);
			 });
			 angular.forEach(oclist,function(item){ccount+=item['value']; count.unshift(item['value'] ); });
			 $scope.sumDatavalue[0]=[ccount,ctime];// $scope.sumDatavalue[0]=[ccount,ctime];
			 $scope.dwoverTempAndCount(xAxis, count, time);
		});
	};
	
	 $scope.dwoverTempAndCount=function(xAxis,count,time){
		 $scope.charArray[3]= $('#tempovertime').highcharts({
		        chart: { zoomType: 'xy' },
		        title: { text: '' },
		        subtitle: { text: '' },
		        credits: { enabled: false},
		        xAxis: [{ categories: xAxis, crosshair: true }],
		        yAxis: [{
		            labels: {  format: '{value}次' },
		            title: { text: '超温次数(次）'  },
		            opposite: true
		        }, {
		            gridLineWidth: 0,
		            title: { text: '超温时长(m)' },
		            labels: { format: '{value}分钟' }
		        }],
		        tooltip: {  shared: true },
		        series: 
		         [{ name: '超温时长',type: 'column',yAxis: 1, data: time, tooltip: {  valueSuffix: 'm' } },
		          { name: '超温次数', type: 'spline', data: count,tooltip: {  valueSuffix: ' 次'} }]
		    });
	  };
		
	$scope.initTempWarningmsg=function(){
		$http.get('/i/AlarmController/getOverTempByTime', { params: {rdcId:$scope.rdcId,  oid:$scope.cuttstorage.id,level:1, startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			$scope.warninglist=data;
		});
	};
	
	 $scope.initdata=function(){
            $("#loding").show();
			$scope.cuttstorage=$rootScope.mystorages[$scope.index];
			$scope.initTemp();	
			$scope.dwrtemplin();
			$scope.initTempWarningmsg();
			$scope.overTempAndCount();
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
