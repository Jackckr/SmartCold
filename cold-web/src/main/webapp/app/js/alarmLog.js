
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
	$scope.initData=function(){
		$http.get('', {  params: { "rdcId": null  } }).success(function (data) {

		});
	};
	var myChart = echarts.init(document.getElementById('tem_div'));

    // 指定图表的配置项和数据
    var option = {
//		    backgroundColor:'#f2f2e6',
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
    	            type:'bar',
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
    myChart.setOption(option);
    window.onresize = myChart.resize;
    $(".show-more").click(function(){
    	$(this).parents(".timeline-title").next(".timeline-content-more").toggle()
    })
});

