/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('tempReport', function( $scope, $rootScope,$stateParams,$http ,$timeout,$state,baseTools) {
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

	//1.初始化温度图表====================================================================================================================================================================================
	/**
	 * 1.1初始化冷库温度对象集合（基础数据）
	 */
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
	/**
	 * 1.2加载数据
	 */
	 $scope.loadTemp = function () {
	    	if($scope.oids.length==0){ $("#loding").hide();return;};
	    	if($scope.isreportMoth){
	    		var longmotdata=[];
	    		  angular.forEach($scope.datemod,function(item,i){
	    			  $http.get('/i/temp/getTempByTime', { params: {index:i,oid:$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":item[0], "endTime":item[1]}}).success(function (result) {
	    					 longmotdata[result.index]=result;
	    					 if( longmotdata.length==6){
	    					 var fristdata= longmotdata[0]; longmotdata.shift(); //  	
	    					  angular.forEach(longmotdata,function(obj,i){
	    						  angular.forEach(obj.tempMap,function(obj1,i){
	    							  if(obj1.length>0){
	    								  fristdata.tempMap[i]=fristdata.tempMap[i].concat(obj1);
	    							  }
	    						  });
	    					  });
	    					 $scope.initTempAxis(fristdata);
	    					 }
			          });
	    		  });
	    	}else{
		        $http.get('/i/temp/getTempByTime', { params: {"oid":$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":$scope.startTime, "endTime":$scope.endTime}}).success(function (result) {
		        	$scope.initTempAxis(result);
		          });
	    	}
	 };
	/**
	 *1.3 数据封装
	 */
	$scope.initTempAxis=function(data){
	        var datumTemp =  parseFloat(data.startTemperature) + 0.5 * parseFloat(data.tempdiff), datumTemp1 =  datumTemp+2, datumTemp2 = datumTemp-2;//基准温度
	        $scope.cuttstorage.datumTemp=datumTemp;
	        var yData = [], tempMap = data.tempMap;
	    	var i= 0,tempList=[],newdata = [],vo=cuttime=lasttime=null;
	        for(var key in tempMap) { 
	         	 vo=cuttime=null, tempList=tempMap[key], newdata = [];
	             if( tempList.length>0){
	            	 lasttime=new Date(tempList[0].addtime).getTime();;
	                 for ( i = 0; i < tempList.length; i++) {
						 vo=tempList[i];
						 cuttime= new Date(vo.addtime).getTime();
						 if( cuttime-lasttime>1800000){
							 newdata.push({x:cuttime+3000,y:null});
			              }  
						 newdata.push({x:cuttime,y:vo.value});
						 lasttime=cuttime;
					}
	             }
	             yData.push({"name": key, "data": newdata,turboThreshold:0});
	        } 
	        yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp},{ x:endDate.getTime(),y:datumTemp}]});//处理基准温度
	        yData.push({ name: '报警基线', color: '#f39c12',dashStyle: 'solid', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp1},{ x:endDate.getTime(),y:datumTemp1}],dashStyle:'dash'});//处理基准温度
	        yData.push({ name: ' ', color: '#f39c12',dashStyle: 'solid', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp2},{ x:endDate.getTime(),y:datumTemp2}],dashStyle:'dash'});//处理基准温度
	        $scope.initHighchart(yData);
	};
	/**
	 * 1.4绘制图表
	 */
	$scope.initHighchart=function(yData ){
		$scope.charArray[0]=  $('#temperatureChart').highcharts({
			 chart: {  zoomType: 'x'},
            title: { text: ''  },
            series:yData,
            yAxis: {  title: {  text: '温度'  }},
            xAxis: { type: 'datetime',  	minRange:  86400000,labels: {  formatter: function() {   return  Highcharts.dateFormat('%Y-%m-%d', this.value);  }  }  },//minRange:  86400000--间隔为每天显示, tickPixelInterval: 400 , 
            xDateFormat: '%Y-%m-%d',
            tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2)+" ℃"; } },
    	    legend: {enabled: false },
    	    credits: { enabled: false},
        });
		$("#loding").hide(); 
	};
	//2.超温时间和次数图表====================================================================================================================================================================================
	$scope.overTempAndCount=function(){
		$http.get('/i/AnalysisController/getAnalysisDataByDate', { params: {type:1, oid:$scope.cuttstorage.id, keys:'ChaoWenShiJian,ChaoWenCiShu,', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
		   var  val=0, ccount=0,ctime=0, date=0;
			var otlist=	data['ChaoWenShiJian'],oclist=	data['ChaoWenCiShu'];
		     var xAxis=[],countmode={}, count=[],time=[];
		     angular.forEach(oclist,function(item){
		    	 ccount+=item['value']; 
		    	 countmode[baseTools.formatTime(item['date']).split(" ")[0]]=item['value'] ;
		     });
			 angular.forEach(otlist,function(item){ 
				    val=parseFloat((item['value'] / 60).toFixed()), ctime+=val, date = baseTools.formatTime(item['date']).split(" ")[0];
				    xAxis.push(date);
				    time.push(val);
				    count.push(countmode[date]?countmode[date]:val>0?1:0);
			 });
			 $scope.sumDatavalue[0]=[ccount,ctime];// $scope.sumDatavalue[0]=[ccount,ctime];
			 $scope.dwoverTempAndCount(xAxis, count, time);
		});
	};
	
	 $scope.dwoverTempAndCount=function(xAxis,count,time){
		 $scope.charArray[3]= $('#tempovertime').highcharts({
		        chart: { zoomType: 'x' },
		        title: { text: '' },
		        subtitle: { text: '' },
		        credits: { enabled: false},
		        xAxis: [{ categories: xAxis, crosshair: true }],
		        yAxis: [{
		            labels: {  format: '{value}次' },
		            title: { text: '超温次数(次）'  },
		            opposite: true,min:0
		        }, {
		            gridLineWidth: 0,
		            title: { text: '超温时长(分钟)' },
		            labels: { format: '{value}分钟' }
		        }],
		        tooltip: {  shared: true },
		        series: 
		         [{ name: '超温时长',type: 'column',yAxis: 1, data: time, tooltip: {  valueSuffix: '分钟' } ,min:0},
		          { name: '超温次数', type: 'spline', data: count,tooltip: {  valueSuffix: ' 次'} }]
		    });
	  };
		
	$scope.initTempWarningmsg=function(){
		$http.get('/i/AlarmController/getOverTempByTime', { params: {rdcId:$scope.rdcId,  oid:$scope.cuttstorage.id,level:1, startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			$scope.warninglist=data;
		});
	};
//3.告警时长和次数图表====================================================================================================================================================================================
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
		    	var score=100-l1tailcount*10- parseInt(l2tailcount/4)*5- parseInt(l3tailcount/8)*2;
				$scope.cuttstorage.l1tailtime=l1tailtime;
				$scope.cuttstorage.l1tailcount=l1tailcount;
				$scope.cuttstorage.score=score<0?0:score;
				 $scope.charArray[1]= 	$('#tempwarning').highcharts({
			        title: { text: null},
			        chart: {
			            type: 'column'
			        },
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

	//初始化系统入口====================================================================================================================================================================================
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
	//初始化事件====================================================================================================================================================================================
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
   
	 /**
	  * 查询事件
	  */
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
	/**
	 * 切换冷库事件
	 */
	$scope.changestorage=function(index,storageid,$event){
		$("#loding").show();
		var em=$($event.target);
		em.addClass('select').siblings().removeClass('select');
		$scope.index=index;
		 $scope.initdata();
	};
	$scope.changeversions=function(index,url,$event){
		var em=$($event.target); em.addClass('select').siblings().removeClass('select');
		$state.go(url, {'rdcId':$scope.rdcId });
		
	};
	
	
});
