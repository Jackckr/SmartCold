/**
 * preview:系统总预览
 * Created by maqiang34 on 17/8/7.
 * 
 * 
 */
coldWeb.controller('preview', function($scope, $location, $stateParams,$timeout, $interval,$http,$rootScope, baseTools) {
       $scope.statusmode=[["stop","run"],['danger','runnings','warnings']];
       $scope.endTime= new Date(),  
       $scope.startTime = new Date($scope.endTime.getTime() - 1800000),
       $scope.ansisTime = new Date($scope.endTime.getTime() - 2592000000),
       $scope.cuttTemp={},$scope.isovTemp={}, $scope.cuttrepwc={},$scope.cuttrestime={};
       $scope.isNumber=function(obj) {  return typeof obj === 'number' && isFinite(obj) ;}  ;
       $scope.index=0,$scope.rdcnam=[];
       $scope.fullpage=undefined,$scope.allrdc=undefined;//当前索引,当前用户所有rdc
       $scope.priveseting=window.localStorage["priveseting_"+$rootScope.user.id]?JSON.parse(window.localStorage["priveseting_"+$rootScope.user.id]):{isOverTemp:true,isRoll:true,shTemp:true,shpwc:true,shysj:true,shfolw:true};
       $scope.pwcoption = {
      	        tooltip:{ backgroundColor:'rgba(0,0,0,0.3)',formatter: "{a} <br/>{b}: {c} kwh"},
      	        grid:{left:40,top:20, bottom:66,right:30},
      	        xAxis: {splitLine:{show: false}, axisLabel:{ textStyle:{ color:'#eee',fontSize:12},interval:1,rotate:45 }, axisLine:{ lineStyle:{ color:'#eee'}},axisTick:{ lineStyle:{ color:'#eee'}} },
      	        yAxis: {splitLine:{show: false}, axisLine:{ lineStyle:{color:'#eee'}},axisTick:{ lineStyle:{color:'#eee'}},axisLabel:{textStyle:{color:'#eee', fontSize:12} }},
      	        series: [{name: '电量',type: 'bar', smooth:true,lineStyle:{ normal:{color:'#188ae2' }},itemStyle:{ normal:{ color:'#188ae2'}} }]
       };
       //全屏
       $scope.fullScreen=function(){
    	   var docElm=document.getElementById("dowebok");if(docElm.requestFullscreen){docElm.requestFullscreen();}else{if(docElm.mozRequestFullScreen){docElm.mozRequestFullScreen();}else{if(docElm.webkitRequestFullScreen){docElm.webkitRequestFullScreen();}else{if(elem.msRequestFullscreen){elem.msRequestFullscreen();}}}};
       };
       //告警
       $scope.alarm=function(){ 
    	   $scope.priveseting.isOverTemp=!$scope.priveseting.isOverTemp;
    	   if( !$scope.priveseting.isOverTemp){ angular.forEach($scope.isovTemp,function(item,index){  $scope.isovTemp[index]=false;}); }
       };
       $scope.changemode=function(){
    	   window.localStorage["priveseting_"+$rootScope.user.id]=JSON.stringify($scope.priveseting);
    	   $scope.refdata();
       };
       //刷新当前页
       $scope.refdata=function(){
    	   $scope.initalldata($scope.allrdc[$scope.index]);  
       };
       //=================================================================start 初始化所有数据及状态========================================================================================================
       $scope.initalldata=function(rdc){
    	   if($scope.priveseting.shTemp){
    		   $scope.ininTempSet(rdc);
    	   }
    	   if($scope.priveseting.shpwc){
    		   $scope.initPWCset(rdc);
    	   }
    	   if($scope.priveseting.shysj){
    		   $scope.initCompressorset(rdc);
    	   }
    	   if($scope.priveseting.shfolw){
    		   $scope.initBlowerset(rdc);
    	   }
       };
       //=================================================================start 1.温度========================================================================================================
	    //初始化及刷新数据
	    $scope.ininTempSet = function(rdc){
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

	    //=================================================================2.电量===================================================================================
	    //2.1获得各个电表总配置
	       $scope.initPWCset=function(rdc){
	    	   if(rdc.powers){//已经初始化过数据
		    		 $scope.pwcdat(rdc);
		       }else{
		    		 $http.get('/i/power/findByRdcId?' ,{params: {rdcId:rdc.id}} ).success(function(data,status,headers,config){// 初始化冷库
		    			 rdc.powers = data;
		    			 $scope.pwcdat(rdc);
		    			 $scope.initPWCchar(rdc);
			       	 });
		        }
	      };
	      //获得电量数据
	      $scope.pwcdat=function(rdc){
	  	    	 var endTime= new Date(), startTime = new Date(endTime.getTime() - 600000);
	  	    	 angular.forEach(rdc.powers,function(item){
	  	    		  $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:10, oids:item.id, 'key':'PWC', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
	  	    			item.pwc=data[item.id].length>0?data[item.id][0]['value'].toFixed(2):'--';
	  		    	   });
	  			 });
	  	 };
	     //初始化电量图标
	      $scope.initPWCchar= function(rdc){
	    	   angular.forEach(rdc.powers,function(item){	
	    		   $http.get('/i/AnalysisController/getAnalysisDataByDate', { params: {type:10, oid:item.id, keys:'TotalPWC', startTime:baseTools.formatTime(  $scope.ansisTime ), endTime:baseTools.formatTime($scope.endTime)}}).success(function (data) {
	    	   			var datalist=data['TotalPWC'],xAxis=[],ydate=[];
	    	   		    if(datalist.length>0){
	    	   		    	 angular.forEach(datalist,function(item,index){ 
	    	   		    		   ydate.push(item['value']);
	    	   		    		   xAxis.push(baseTools.formatTime(item['date']).split(" ")[0]);
	    	   				 });
	    	   		    }
	    	   		   $scope.dwoverChar(rdc.id,item.id,xAxis,ydate);
		  	   });
	   		});
	      };
		    $scope.dwoverChar=function(rdcid,oid,xdata,ydata){
		        	   var myChart = echarts.init(document.getElementById("powerchar_"+ rdcid+"_"+oid));
			    	   var option=$scope.pwcoption;
			    	   option.xAxis.data=xdata;
			    	   option.series[0].data=ydata;
			       	    myChart.setOption(option);
		    };
	       //=================================================================3.机组===================================================================================
	       $scope.initCompressorset= function(rdc){//
	    	   if(rdc.compressorGroups){//已经初始化过数据
		    		 $scope.initCompressorstatus(rdc);
		       }else{
		    		 $http.get('/i/compressorGroup/findByRdcId' ,{params: {rdcId:rdc.id}} ).success(function(data,status,headers,config){// 初始化冷库
		    			 rdc.compressorGroups = data;
		    			 var count=0;
		    			 angular.forEach( rdc.compressorGroups,function(item){
		    				 $http.get('/i/compressor/findBygroupId?groupId=' + item.id).success(function(data,status,headers,config){
		    					 item.compressors = data;
		    					 count++;
			    				 if(count==rdc.compressorGroups.length){
			    					   $scope.initCompressorstatus(rdc);
			    				  }	 
		    				 }); }); });
		    }};
	        $scope.initCompressorstatus=function(rdc){
	    	   var endTime= new Date(), startTime = new Date(endTime.getTime() - 600000);
	    	   angular.forEach(rdc.compressorGroups,function(item){	
	    		   angular.forEach(item.compressors,function(obj){	
	    			   $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:5, oids:obj.id, 'key':'run', "startTime": baseTools.formatTime(startTime ), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
	    				 if(data[obj.id].length>0){
	    					 obj.status=$scope.statusmode[0][data[obj.id][0]['value']];//
	    				 }
	    	    	   });
	    		   });
	    		   
	    	   });
	       };
	       
	       //=================================================================4.风机===================================================================================
	       //4.1获得风机配置
	       $scope.initBlowerset  = function (rdc) {
	    	   if(rdc.blowers){
	    		   $scope.refBlowers(rdc);
	    	   }else{
	    		   $http.get('i/compressorBlower/findByRdcId', {  params: {  "rdcId":rdc.id } }).success(function (result) {
	    			   rdc.blowers = result;
	    			   var count=0;
		               	angular.forEach( rdc.blowers ,function(item){ 
		               		        count++;
		                            item.runTime = parseFloat(item.runTime / 3600).toFixed(2);
		                            item.defrostTime = parseFloat(item.defrostTime / 3600).toFixed(2);
		                            if( item.isRunning==1){item.st=1;}else if( item.isDefrosting==1){item.st=2;}else{item.st=0;}
		                            item.cls= $scope.statusmode[1][item.st] ;
		                            if(count==rdc.blowers){
		                            	 $scope.refBlowers(rdc);
		                            }
		                  }); 
		           });
	    	   }
	          
	       };
	       //4.2刷新
	       $scope.refBlowers  = function (rdc) {
	              	angular.forEach(rdc.blowers,function(item){ 
	              		 $http.get('/i/compressorBlower/findByBlowerId', { params: {blowerId:item.blowerId}}).success(function (data) {
	              			 item.runTime = parseFloat(data.runTime / 3600).toFixed(2);
	              			 item.defrostTime = parseFloat(data.defrostTime / 3600).toFixed(2);
	              			 item.isRunning= data['isRunning'];
	              			 item.isDefrosting= data['isDefrosting'];
	              			  if( item.isRunning==1){item.st=1;}else if( item.isDefrosting==1){item.st=2;}else{item.st=0;}
	                          item.cls= $scope.statusmode[1][item.st] ;
	              	   });
	                 });
	       };
	    
	    
	    
	    
	    //=================================================================end======================================================================================================
	    $scope.full=function(){  
	        angular.forEach($scope.allrdc,function(obj,i){ 
	        	if(obj!=null){
	        		$scope.rdcnam.push(obj.name+"");
	        	}else{
	        		$scope.rdcnam.push("");
	        	}
	        });
	        $('#dowebok').fullpage({ 
		    	'navigation': true, 
		    	continuousVertical: true,
		    	loopBottom: true,
		    	navigationTooltips: $scope.rdcnam,
				onLeave: function(index,nextIndex,direction){
					 $scope.index=nextIndex;
					 $scope.initalldata($scope.allrdc[nextIndex-1]);
				},
				afterRender:function(){
					 $scope.fullpage=true;
				}
		    });
	        if($scope.index!=0){
	        	  $timeout(function(){ $.fn.fullpage.moveTo($scope.index+1) ; } ,300);//滚动到指定的位置
	        }
	        $('#dowebok').removeClass("hide");
	     
	    };//避免闪动
	   //系统切换事件，优先级1 ==========================================================================================================================================
	   $scope.getRdc=function(){
		   angular.forEach($scope.allrdc,function(obj,i){ 
				  if(obj!=null&&obj.id==$rootScope.rdcId){
					  $scope.index=i;
					  return  $scope.index;
				  }
			  });
	   };
	   //系统入口
	   $scope.watchrdc=function(){
		   if($rootScope.user.roleid==2){
			   if( !$scope.allrdc){   
				   $scope.allrdc= $rootScope.vm.allUserRdcs; 
				   }
			   $scope.getRdc();
			   if( $scope.fullpage){
				   $.fn.fullpage.moveTo($scope.index+1) ;
			   }else{
				   $scope.initalldata($scope.allrdc[$scope.index]);  
				   $timeout($scope.full ,100);
			   }
		   }else{
			   $scope.allrdc=[$rootScope.vm.choserdc];
			   $scope.initalldata($scope.allrdc[$scope.index]);  
			   $('#dowebok').removeClass("hide");
		   }   
		   
		 
	   };
       $scope.$watch('rdcId', $scope.watchrdc,true);//监听冷库变化  根据主机面初始化
       //系统轮巡事件，优先级2 ========================================================================================================================================== 
       $scope.gonex=function(){
	    	if($scope.allrdc.length==1||!$scope.priveseting.isRoll){
	    		$scope.initalldata($scope.allrdc[$scope.index]);
	    	}else if($scope.priveseting.isRoll){//
		    	$.fn.fullpage.moveSectionDown();//
	    	};
	    };
	    //初始化冷库配置
		//定时滚动任务30
	    clearInterval($rootScope.timeTicket);
	    $rootScope.timeTicket = setInterval( $scope.gonex, 30000);
	    $scope.$on('$destroy',function(){ $("#fp-nav").remove(); $('body,html').attr('style','');
  clearInterval($rootScope.timeTicket);  });
});


