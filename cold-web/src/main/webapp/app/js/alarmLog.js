
/**
 * Created by maqiang34 on 16/10/18.
 * 计算压缩机剩余时间
 */
coldWeb.controller('baoyangReminder', function( $scope, $rootScope,$http ,$timeout) {
	$scope.smgroid=null,$scope.warid=[],$scope.infoids=[];
	$scope.sytime=undefined;$scope.exqfn=false;
	//$(".mainHeight").height( $(".content-wrapper").height());
	$scope.inintData=function(newValue,oldValue){//初始化冷库门
		   if($rootScope.compressorGroups!=undefined){
			   $scope.exqfn=true;
			   watch(); //销毁监听
			   var oid=[]; angular.forEach($rootScope.compressorGroups,function(item){ oid.push( item.id);  }); 
			   $scope.smgroid=oid.join(',');
			   $http.get('i/physicalController/getCompressorinfo', {params: {oids: $scope.smgroid}} ).success(function(data, status, headers, config) {   
				   $scope.sytime=data.entity;
				   angular.forEach($rootScope.compressorGroups,function(item){ 
					   angular.forEach(item.compressors,function(obj){ 
						   obj.sytm= $scope.aredayTime(obj);
					 }); 
				   }); 
				   $scope.addStyl();
			   });
		   }
	 };
	 $scope.aredayTime = function(obj) {
		 if(obj.maintenancetime&&obj.lastMaintainTime){
			   var sytime= $scope.sytime[obj.id];  
			   if(sytime<50){
				   if(sytime<0){$scope.warid.push(obj.id);}else{ $scope.infoids.push(obj.id);}
			   }
			   if(sytime<=0){   return '已超保养期'+sytime;} 
			   return "还剩  "+ parseInt(sytime)+"小时";
		 }else{
			 return "未设置保养时间"; 
		 }
      };
      /*红灯闪烁报警 1s 闪一次*/
      
      
      $scope.addStyl=function(){
    	  setInterval(function(){
    		  angular.forEach($scope.warid,function(item){ 
    			  $("#st_tm_"+item).toggleClass("dangerIcon");
    		  });
    		  angular.forEach($scope.infoids,function(item){ 
    			  $("#st_tm_"+item).toggleClass("warnIcon");
    		  });
    	 }, 1000); 
      };
      /*红灯闪烁报警 1s 闪一次*/
      $scope.chanvl=function(){
    	  $scope.inintData(null,null);
      };
      $scope.changerdc=function(){
    	  if($scope.exqfn){
    		  $scope.exqfn=false;
    		  $timeout($scope.chanvl,500);
    	  }
      };
      var watch =$scope.$watch('compressorGroups', $scope.inintData,true);//监听冷库变化
      $scope.$watch('rdcId', $scope.changerdc,true);//监听冷库变化
      
      
});
/**
 * 
 * 　　报警信息
 */
coldWeb.controller('alarmLog', function($rootScope, $scope, $http,$timeout) {
	 //根据rdcid查询该rdc的报警信息
	$(".mainHeight").height( $(".content-wrapper").height());
	$scope.initData=function(){
		$http.get('/i/warlog/getWarningInfoByRdcID', {  params: { "rdcId": $rootScope.rdcId  } }).success(function (data) {
            $scope.warLog = data.warLog;
            $scope.warInfo = data.warInfo;
        });
	};
	$scope.inittable=function(){
		$("#alarmLog").DataTable();
	};
    $scope.changerdc=function(){
    	$scope.initData();
    	$timeout($scope.initData,60000);
    };
    $scope.$watch('rdcId', $scope.changerdc,true);//监听冷库变化
});
//温度告警
coldWeb.controller('alarmTem', function($rootScope, $scope, $http,$timeout) {
	 //根据rdcid查询该rdc的报警信息
	$(".mainHeight").height( $(".content-wrapper").height());
	 $scope.tempwarLog=[];
	 var myChart = echarts.init(document.getElementById('tem_div'));
	$scope.initData=function(){
		var oids=""; angular.forEach($rootScope.mystorages,function(storage){ oids+=storage.id+",";  });
		oids=oids.substr(0,oids.length-1);
		$http.get('i/AlarmController/getOverTempAnalysis', {  params: { "oids": oids  } }).success(function (data) {
			 $scope.tempwarLog=[];
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
        			 $scope.tempwarLog.push(msg);
        		 }
        	 });
        	 if( $scope.tempwarLog.length==0){
    			 var msg=new Object();
    			 msg.time=time[7];
    			 msg.msg="暂无告警信息";
    			 msg.count=0;
    			 $scope.tempwarLog.push(msg);
    		 }
        	 $scope.dwechar(xAxis, count, time); 
           }
		});
	}; 
	  
	
	  $scope.dwechar=function(xAxis,count,time){
		  
		  // 指定图表的配置项和数据
		    var option = {
		    		legend: { data:['告警次数','告警时长'] },
		    	    tooltip: {  trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999'  }}  },
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
		    	            min: 0,max: 250,interval: 50,
		    	            axisLabel: { formatter: '{value}' }
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

		    // 使用刚指定的配置项和数据显示图表。
		    myChart.setOption(option);
		  
		  
	  }
	  
	
	  $scope.changeStorages=function(){
		   if($rootScope.mystorages!=undefined){
			   $scope.initData();
		   }
	    };
	
	  $scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
  
    window.onresize = myChart.resize;
   // $(".show-more").click(function(){	$(this).parents(".timeline-title").next(".timeline-content-more").toggle(); })
});

