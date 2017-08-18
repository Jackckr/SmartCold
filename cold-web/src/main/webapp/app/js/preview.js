/**
 * preview:系统总预览
 * Created by maqiang34 on 17/8/7.
 * 
 * 
 */
coldWeb.controller('preview', function($scope, $location, $stateParams,$timeout, $interval,$http,$rootScope, baseTools) {
	   $scope.blowers = null;
       $scope.endTime= new Date(),  
       $scope.priveseting={isOverTemp:true};
       $scope.statusmode=[["stop","run"],['danger','runnings','warnings']];
       $scope.startTime = new Date($scope.endTime.getTime() - 1800000),
       $scope.ansisTime = new Date($scope.endTime.getTime() - 432000000),
       $scope.cuttTemp={},$scope.isovTemp={}, $scope.cuttrepwc={},$scope.cuttrestime={};
       $scope.isNumber=function(obj) {  return typeof obj === 'number' && isFinite(obj) ;}  ;
       $scope.pwcoption = {
      	        tooltip:{ backgroundColor:'rgba(0,0,0,0.3)'},
      	        grid:{left:40,top:20, bottom:30,right:30},
      	        xAxis: {splitLine:{show: false}, axisLabel:{ textStyle:{ color:'#eee',fontSize:12} }, axisLine:{ lineStyle:{ color:'#eee'}},axisTick:{ lineStyle:{ color:'#eee'}} },
      	        yAxis: {splitLine:{show: false}, axisLine:{ lineStyle:{color:'#eee'}},axisTick:{ lineStyle:{color:'#eee'}},axisLabel:{textStyle:{color:'#eee', fontSize:12} }},
      	        series: [{name: '电量',type: 'line', smooth:true,lineStyle:{ normal:{color:'#188ae2' }},itemStyle:{ normal:{ color:'#188ae2'}} }]
       };
       //全屏
       $scope.fullScreen=function(){
    	   var docElm=document.getElementById("oview");if(docElm.requestFullscreen){docElm.requestFullscreen();}else{if(docElm.mozRequestFullScreen){docElm.mozRequestFullScreen();}else{if(docElm.webkitRequestFullScreen){docElm.webkitRequestFullScreen();}else{if(elem.msRequestFullscreen){elem.msRequestFullscreen();}}}};
       };
       //告警
       $scope.alarm=function(){  $scope.priveseting.isOverTemp=!$scope.priveseting.isOverTemp;};
       $scope.rdclist=$rootScope.vm.allUserRdcs;//拿到所有冷库
       console.log("当前冷库长度"+$scope.rdclist.length);
       //视图切换
   
       
   
       
    
       //=================================================================1.温度===================================================================================
       $scope.initTempset=function(startTime,endTime){
    	   angular.forEach($rootScope.mystorages,function(item){	
  	    	   if($rootScope.Tempset[item.id]){
  	    		 $scope.getTemp(item.id,$rootScope.Tempset[item.id].oids,$rootScope.Tempset[item.id].names,  startTime,endTime);
  	    	   }else{
  	    		 $http.get('/i/temp/getTempsetByStorageID?oid=' + item.id).success(function(req,status,headers,config){
  	    			 var oids=new Array(),names=new Array();
	        	    	 angular.forEach(req,function(obj,i){oids.push(obj.id);names.push(obj.name);});
	        	    	 $rootScope.Tempset[item.id]={oids:oids,names:names };
	        	    	 $scope.getTemp(item.id,$rootScope.Tempset[item.id].oids,$rootScope.Tempset[item.id].names,  startTime,endTime);
  	             });
  	    	   }
  	      });
       };
       $scope.getTemp=function(oid,oids,names,startTime,endTime){
    	   $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:18,"oid": oid, oids:oids,names:names, 'key':'Temp', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
    		   var temp=0;
    		   angular.forEach(oids,function(obj,i){
    			  if(data[obj].length>0){ 
    				  temp+=data[obj][0]['value'];
    			  }
    		   });
    		   if(temp!=0){temp=temp/oids.length;}
    		   if($scope.isNumber($scope.cuttTemp[oid])&&temp==0){ temp=$scope.cuttTemp[oid]; }
    		   $scope.cuttTemp[oid]=temp==0?"--": parseFloat((temp/oids.length).toFixed(2));
    		   $scope.cuttrestime[0]=new Date();
    	   });
    	   if($scope.priveseting.isOverTemp){//加载告警
    		   $http.get('http://139.224.16.238/i/util/getColdAlarmStatus', { params: {oid: oid}}).success(function (result) {
        		   $scope.isovTemp[oid]=result.isAlarm||result.isBlack;
        	   });
    	   }
       };  
       
       //=================================================================2.电量===================================================================================
       //2.1获得各个电表总配置
       $scope.initPWCset=function(startTime,endTime,isinit){
    		   angular.forEach($rootScope.powers,function(item){	
    			   $scope.getPWC(item.id,startTime,endTime);
    	  	   });
       };
       //2.2获得各个电表总电量
       $scope.getPWC=function(oid,startTime,endTime){
    	   $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:10, oids:oid, 'key':'PWC', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
    		   var pwc=data[oid].length>0?data[oid][0]['value']:0;
    		   if($scope.isNumber($scope.cuttrepwc[oid])&&pwc==0){ pwc=$scope.cuttrepwc[oid]; }
    			$scope.cuttrepwc[oid]=pwc==0?"--":pwc;
    		    $scope.cuttrestime[1]=new Date();
    	   });
    	   
       };
       
       $scope.initPWCchar= function(){
    	   angular.forEach($rootScope.powers,function(item){	
    		   $http.get('/i/AnalysisController/getAnalysisDataByDate', { params: {type:10, oid:item.id, keys:'TotalPWC', startTime:baseTools.formatTime(  $scope.ansisTime ), endTime:baseTools.formatTime($scope.endTime)}}).success(function (data) {
    	   			var datalist=data['TotalPWC'],xAxis=[],ydate=[];
    	   		    if(datalist.length>0){
    	   		    	 angular.forEach(datalist,function(item,index){ 
    	   		    		   ydate.push(item['value']);
    	   		    		   xAxis.push(baseTools.formatTime(item['date']).split(" ")[0]);
    	   				 });
    	   		    }
    	   		   $scope.dwoverChar(item.id,xAxis,ydate);
	  	   });
   		});
	     $scope.dwoverChar=function(oid,xdata,ydata){
//	        var div_char=	 $("div [mid='powerchar_"+oid+"']");
//	        angular.forEach(div_char,function(item,index){
	        	   var myChart = echarts.init(document.getElementById("powerchar_"+oid));
		    	   var option=$scope.pwcoption;
		    	   option.xAxis.data=xdata;
		    	   option.series[0].data=ydata;
		       	    myChart.setOption(option);
		       	    var myChart2 = echarts.init(document.getElementById("all_powerchar_"+oid));
		       	   myChart2.setOption(option);
//	         });
	       };
       };
       //=================================================================3.机组===================================================================================
       $scope.initCompressorStatus= function(startTime,endTime){//
    	   angular.forEach($rootScope.compressorGroups,function(item){	
    		   angular.forEach(item.compressors,function(obj){	
    			   $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:5, oids:obj.id, 'key':'run', "startTime": baseTools.formatTime(startTime ), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
    				   obj.status=data[obj.id].length>0?$scope.statusmode[0][data[obj.id][0]['value']]:"stop";
    				   $scope.cuttrestime[2]=new Date();
    	    	   });
    		   });
    		   
    	   });
       } ;
       //=================================================================4.风机===================================================================================
       //4.1获得风机配置
       $scope.initBlowers  = function () {
           $http.get('/i/compressorBlower/findByRdcId', {  params: {  "rdcId": $rootScope.rdcId } }).success(function (result) {
               $scope.blowers = result;
               angular.forEach($rootScope.mystorages,function(obj){ 
	               	var  stblower=[];
	               	angular.forEach( $scope.blowers,function(item){ 
	                            if(obj.id==item.coldStorageId){
	                            	stblower.push(item);
	                            }
	                            item.runTime = parseFloat(item.runTime / 3600).toFixed(2);
	                            item.defrostTime = parseFloat(item.defrostTime / 3600).toFixed(2);
	                            if( item.isRunning==1){item.st=1;}else if( item.isDefrosting==1){item.st=2;}else{item.st=0;}
	                            item.cls= $scope.statusmode[1][item.st] ;
	                  }); 
               	  obj.blowers=stblower;
               }); 
               $scope.cuttrestime[3]=new Date();
           });
       };
       //4.2刷新
       $scope.refBlowers  = function (startTime,endTime) {
    	   angular.forEach($rootScope.mystorages,function(obj){ 
              	angular.forEach( obj.blowers,function(item){ 
              		 $http.get('/i/baseInfo/getKeysValueByTime', { params: {type:4, oid:item.blowerId, keys:['isDefrosting','isRunning'], "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
              			 item.isRunning= data['isRunning'].length>0?data['isRunning'][0]['value']:item.isRunning;
              			 item.isDefrosting= data['isDefrosting'].length>0?data['isDefrosting'][0]['value']:item.isDefrosting;
              			  if( item.isRunning==1){item.st=1;}else if( item.isDefrosting==1){item.st=2;}else{item.st=0;}
                          item.cls= $scope.statusmode[1][item.st] ;
              			  $scope.cuttrestime[3]=new Date();
              	   });
                 });
            }); 
       };
	 
	    
	     //刷新数据
	    $scope.refdata=function(){
	    	var endtime=new Date();
	    	$scope.refBlowers( $scope.cuttrestime[3] , endtime);
	    	$scope.initTempset($scope.cuttrestime[0] ,endtime );
	    	$scope.initCompressorStatus($scope.cuttrestime[2] , endtime);
	    };
	    
	    //============================================================================监听冷库变化====================
	    $scope.init_Temp=function(){
	    	//冷库监听 
		    if($rootScope.mystorages==undefined){
				  $scope.changeStorages=function(){
					   if($rootScope.mystorages!=undefined){
						   initdatawatch();//销毁监听
						   $scope.initBlowers(); 
						   $scope.initTempset($scope.startTime , $scope.endTime);
					   }
				    };
				  initdatawatch= $scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
			}else{
				 $scope.initBlowers();
				$scope.initTempset( $scope.startTime , $scope.endTime);
			}
	    };
	    $scope.init_pwc=function(){
			 //电量监听
			 if($rootScope.powers==undefined){
				  $scope.changepowers=function(){
					   if($rootScope.powers!=undefined){
						   initPWCwatch();
						   $scope.initPWCset( $scope.startTime , $scope.endTime);
					   }
				    };
				  initPWCwatch= $scope.$watch('powers', $scope.changepowers,true);//监听冷库变化
			}else{
				$scope.initPWCset( $scope.startTime , $scope.endTime);
			}
	    };
		 //机组监听
		 
		$scope.initcompressorGroups=function(){
			$scope.initCompressorStatus( $scope.startTime , $scope.endTime);
		};
		 $scope.init_compressorGroups=function(){
				 if($rootScope.compressorGroups==undefined){
					 $scope.changecompressorGroups=function(){
						 if($rootScope.compressorGroups!=undefined&&$rootScope.compressorGroups[0].compressors){
							 initCGwatch();
							 $timeout(	$scope.initcompressorGroups ,500);
						 }
					 };
					 initCGwatch= $scope.$watch('compressorGroups', $scope.changecompressorGroups,true);//监听冷库变化
				 }else{
					 $scope.initCompressorStatus( $scope.startTime , $scope.endTime);
				 }
		 };
		 $scope.changeRdc=function(){
			 $timeout(	 $scope.refData ,1500);
		 };
		 
	    $scope.refData=function(){
	    	 $scope.init_Temp();
	    	 $scope.init_pwc();
	    	 $scope.initPWCchar();
	    	 $scope.init_compressorGroups();
	    };
	    
	   
	    $scope.$watch('rdcId', $scope.changeRdc,true);//监听冷库变化
		 
		//定时刷新任务30s 
	    clearInterval($rootScope.timeTicket);
	    $rootScope.timeTicket = setInterval(function () { $scope.refData; }, 30000);
	    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });

       
       
//       $scope.viewController=function(){
//    	   $scope.view = this, nameArray=[], indexCurrent = 0;
//    	   angular.forEach($scope.rdclist,function(obj){	
//    		   nameArray.push(obj.id);
//    	   });
//    	   $scope.view.next = next;
//    	   $scope.view.current = nameArray[indexCurrent];
//	        function next(){
//	            indexCurrent = (indexCurrent + 1) % nameArray.length;
//	            $scope.view.current = nameArray[indexCurrent];
//	        }
//	    };
//	    $scope.viewController();
});


