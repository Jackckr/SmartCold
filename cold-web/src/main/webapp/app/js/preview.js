/**
 * preview:系统总预览
 * Created by maqiang34 on 17/8/7.
 * 
 * 
 */
coldWeb.controller('preview', function($scope, $location, $stateParams,$timeout, $interval,$http,$rootScope, baseTools) {
       $scope.endTime= new Date(),  
       $scope.priveseting={isOverTemp:true,isRoll:true,islocke:false};//$scope.priveseting.islocke priveseting.isOverTemp
       $scope.statusmode=[["stop","run"],['danger','runnings','warnings']];
       $scope.startTime = new Date($scope.endTime.getTime() - 1800000),
       $scope.ansisTime = new Date($scope.endTime.getTime() - 2592000000),
       $scope.cuttTemp={},$scope.isovTemp={}, $scope.cuttrepwc={},$scope.cuttrestime={};
       $scope.isNumber=function(obj) {  return typeof obj === 'number' && isFinite(obj) ;}  ;
       $scope.index=0; //
       $scope.rdcnam=[];
       $scope.fullpage=undefined;
       $scope.allrdc=undefined;//当前索引,当前用户所有rdc
       
       //全屏
       $scope.fullScreen=function(){
    	   var docElm=document.getElementById("dowebok");if(docElm.requestFullscreen){docElm.requestFullscreen();}else{if(docElm.mozRequestFullScreen){docElm.mozRequestFullScreen();}else{if(docElm.webkitRequestFullScreen){docElm.webkitRequestFullScreen();}else{if(elem.msRequestFullscreen){elem.msRequestFullscreen();}}}};
       };
       $scope.pwcoption = {
      	        tooltip:{ backgroundColor:'rgba(0,0,0,0.3)',formatter: "{a} <br/>{b}: {c} kwh"},
      	        grid:{left:40,top:20, bottom:66,right:30},
      	        xAxis: {splitLine:{show: false}, axisLabel:{ textStyle:{ color:'#eee',fontSize:12},interval:1,rotate:45 }, axisLine:{ lineStyle:{ color:'#eee'}},axisTick:{ lineStyle:{ color:'#eee'}} },
      	        yAxis: {splitLine:{show: false}, axisLine:{ lineStyle:{color:'#eee'}},axisTick:{ lineStyle:{color:'#eee'}},axisLabel:{textStyle:{color:'#eee', fontSize:12} }},
      	        series: [{name: '电量',type: 'bar', smooth:true,lineStyle:{ normal:{color:'#188ae2' }},itemStyle:{ normal:{ color:'#188ae2'}} }]
       };
       //告警
       $scope.alarm=function(){ 
    	   $scope.priveseting.isOverTemp=!$scope.priveseting.isOverTemp;
    	   if( !$scope.priveseting.isOverTemp){ angular.forEach($scope.isovTemp,function(item,index){  $scope.isovTemp[index]=false;}); }
       };
       //刷新当前页
       $scope.refdata=function(){
    	   $scope.initRdc($scope.allrdc[$scope.index]);  
       };
       //=================================================================start 初始化所有数据及状态========================================================================================================
       $scope.initalldata=function(rdc){
    	   $scope.initRdc(rdc);
    	   
       };
       
       //=================================================================start 1.温度========================================================================================================
	    //初始化及刷新数据
	    $scope.initRdc = function(rdc){
	    	 if(rdc.mystorages){//已经初始化过数据
	    		 $scope.initTemp(rdc);
	    	 }else{
	    		 $http.get('/i/coldStorageSet/findStorageSetByUserId' ,{params: {rdcId:rdc.id,userId:$rootScope.user.id,type:$rootScope.user.type}} ).success(function(data,status,headers,config){// 初始化冷库
	    			 rdc.mystorages = data;
	    			 rdc.mystorages.tempset=[];
	    			 var coun=0;
	    			 angular.forEach( rdc.mystorages,function(item){
	    				 $http.get('/i/temp/getTempsetByStorageID?oid=' + item.id).success(function(req,status,headers,config){
	    					 coun++;
		  	    			     var oids=new Array(),names=new Array();
			        	    	 angular.forEach(req,function(obj,i){oids.push(obj.id);names.push(obj.name);});
			        	    	 item.tempset={oids:oids,names:names };
			        	    	 if(rdc.mystorages.length==coun){
			        	    		 $scope.initTemp(rdc);
			        	    	 }
		  	             });
	    			 });
	    			
		       	 });
	    	 }
	    };
	    $scope.initTemp=function(rdc){
	    	 var endTime= new Date(), startTime = new Date(endTime.getTime() - 600000);
	    	 angular.forEach(rdc.mystorages,function(item){
	    		  $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:18,"oid": item.id, oids:item.tempset.oids,names:item.tempset.names, 'key':'Temp', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)  }}).success(function (data) {
	    			  var temp=0,sccount=0;
	       		      angular.forEach(item.tempset.oids,function(obj,i){
			       			  if(data[obj].length>0){ 
			       				  temp+=data[obj][0]['value']; sccount++;
			       			  }
	       		      });
	       		      if(temp!=0){temp=temp/sccount;}else{temp='--'; }
	       		      item.temp=temp;
	       	     });
				if($scope.priveseting.isOverTemp){//加载告警
		    		   $http.get('http://139.224.16.238/i/util/getColdAlarmStatus', { params: {oid: item.id}}).success(function (result) {
		    			   rdc.mystorages.isovTemp=result.isAlarm||result.isBlack;
		        	   });
		    	 }
			});
	    };
	    //=================================================================end======================================================================================================
	    $scope.full=function(){  
	        angular.forEach($scope.allrdc,function(obj,i){   $scope.rdcnam.push(obj.name);});
	        $('#dowebok').fullpage({ 
		    	'navigation': true, 
		    	continuousVertical: true,
		    	navigationTooltips: $scope.rdcnam,
				onLeave: function(index,nextIndex,direction){
					 $scope.index=nextIndex;
					 $scope.refdata($scope.allrdc[nextIndex-1]);
				},
				afterRender:function(){
					 $scope.fullpage=true;
				}
		   });
	        if($scope.index!=0){
	        	  $timeout(function(){ $.fn.fullpage.moveTo($scope.index+1) ; } ,300);
	        	  
	        }
	      $('#dowebok').removeClass("hide");
	     
	    };//避免闪动
	   //系统切换事件，优先级1 ==========================================================================================================================================
	   $scope.getRdc=function(){
		   angular.forEach($scope.allrdc,function(obj,i){ 
				  if(obj.id==$rootScope.rdcId){
					  $scope.index=i;
					  return  $scope.index;
				  }
			  });
	   };
	   $scope.watchrdc=function(){
		   if( $scope.fullpage){
			   $scope.getRdc();
			   $.fn.fullpage.moveTo($scope.index+1) ;
		   }else{
			   if($scope.allrdc==undefined){ 
				   $scope.allrdc= $rootScope.vm.allUserRdcs;
			   } 
			   $scope.getRdc();
			   $scope.refdata($scope.allrdc[$scope.index]);  
			   $timeout($scope.full ,100);
		   }
	   };
       $scope.$watch('rdcId', $scope.watchrdc,true);//监听冷库变化  根据主机面初始化
       //系统轮巡事件，优先级2 ========================================================================================================================================== 
       $scope.gonex=function(){
	    	if($scope.allrdc.length==1||!$scope.priveseting.isRoll){
	    		$scope.refdata($scope.allrdc[$scope.index]);
	    	}else if($scope.priveseting.isRoll){//
		    	$.fn.fullpage.moveSectionDown();//
	    	};
	    };
	    //初始化冷库配置
		//定时滚动任务30
	    clearInterval($rootScope.timeTicket);
	    $rootScope.timeTicket = setInterval( $scope.gonex, 30000);
	    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });
});


