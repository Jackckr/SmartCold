/**
 * preview:系统总预览
 * Created by maqiang34 on 17/8/7.
 * 
 * 
 * 
 *  angular.forEach($rootScope.mystorages,function(item){	
		        	    	 if($rootScope.Tempset[item.id]==undefined){
		        	    		 $http.get('/i/temp/getTempsetByStorageID?oid=' + item.id).success(function(req,status,headers,config){
		        	    			 var oids=new Array(),names=new Array();
				        	    	 angular.forEach(req,function(obj,i){
				    		    	 		oids.push(obj.id);names.push(obj.name);
				    		    	 });
				        	    	 $rootScope.Tempset[item.id]={oids:oids,names:names };
		        	             });
		        	    	 }
		        	     });
 */
coldWeb.controller('preview', function($scope, $location, $stateParams, $http,$rootScope, baseTools) {
	
       $scope.endTime= new Date(),  $scope.startTime = new Date($scope.endTime.getTime() - 30 * 60 * 1000);
       $scope.cuttTemp={};
       $scope.cuttrestime={};
       $scope.isNumber=function(obj) {  return typeof obj === 'number' && isFinite(obj) ;}  ;
       $scope.initTempset=function(startTime,endTime){
    	   angular.forEach($rootScope.mystorages,function(item){	
  	    	   if($rootScope.Tempset[item.id]==undefined){
  	    		 $http.get('/i/temp/getTempsetByStorageID?oid=' + item.id).success(function(req,status,headers,config){
  	    			 var oids=new Array(),names=new Array();
	        	    	 angular.forEach(req,function(obj,i){oids.push(obj.id);names.push(obj.name);});
	        	    	 $rootScope.Tempset[item.id]={oids:oids,names:names };
	        	    	 $scope.getTemp(item.id,$rootScope.Tempset[item.id].oids,$rootScope.Tempset[item.id].names,  startTime,endTime);
  	             });
  	    	   }else{
  	    		 $scope.getTemp(item.id,$rootScope.Tempset[item.id].oids,$rootScope.Tempset[item.id].names,  startTime,endTime);
  	    	   }
  	      });
       };
       $scope.getTemp=function(oid,oids,names,startTime,endTime){
    	   $http.get('/i/baseInfo/getKeyValuesByTime', { params: {type:18,"oid": oid, oids:oids,names:names, 'key':'Temp', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (data) {
    		   var temp=0;
    		   angular.forEach(oids,function(obj,i){
    			  if(data[obj]){ 
    				  temp+=data[obj][0]['value'];
    			  }
    		   });
    		   if(!$scope.cuttTemp[oid]||($scope.isNumber($scope.cuttTemp[oid])&&temp!=0)){
    			   $scope.cuttTemp[oid]=temp==0?"--":temp/oids.length;
    		   }
    		   $scope.cuttrestime[0]=new Date();
    	   });
       };  
	   
	    
	    
	     /**
	     * 初始化数据
	     */
	     $scope.initdata=function(){
	    	$scope.initTempset( $scope.startTime , $scope.endTime);
		 };
	     /**
	     *刷新数据
	     */
	    $scope.refdata=function(){
	    	$scope.initTempset(  $scope.cuttrestime[0] , new Date());
	    };
		 if($rootScope.mystorages==undefined){
			  $scope.changeStorages=function(){
				   if($rootScope.mystorages!=undefined){
					   initdatawatch();//销毁监听
					   $scope.initdata();
				   }
			    };
			  initdatawatch= $scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
		}else{
			$scope.initdata();
		}
		    clearInterval($rootScope.timeTicket);
		    $rootScope.timeTicket = setInterval(function () { $scope.refdata(); }, 30000);
		    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });

});


