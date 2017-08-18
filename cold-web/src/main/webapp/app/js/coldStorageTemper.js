/**
 * Created by sunqiunian on 16/3/3.
 */
/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageTemper', function ($scope, $location, $stateParams, $http,$rootScope, baseTools) {
    $scope.isErr=false;$scope.fstartTime=undefined; $scope.oids=[],$scope.names=[];$scope.storageID= $stateParams.storageID;  console.log("storageID:"+$scope.storageID);   
    $scope.colors= ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];  Highcharts.setOptions({  global: {useUTC: false } ,colors:$scope.colors });
    $scope.getTempset = function () {
    	if($rootScope.Tempset&&$rootScope.Tempset[$scope.storageID]){
    		 $scope.oids=$rootScope.Tempset[$scope.storageID].oids;$scope.names=$rootScope.Tempset[$scope.storageID].names;$scope.load();
    	}else{
    		 $http.get('/i/temp/getTempsetByStorageID', { params: {"oid": $scope.storageID}}).success(function (data) {
    		    	if(data){
    		    	 	angular.forEach(data,function(obj,i){
    		    	 		$scope.oids.push(obj.id);$scope.names.push(obj.name);
    		    	 	});
    		    	 	 $rootScope.Tempset[$scope.storageID]={oids:$scope.oids,names:$scope.names };
    		    	 	 $scope.load();
    		    	}else{
    		    		$("#mgs_div2").removeClass("hidden");
    		    	}
    		    });	
    	}
    };
    $("#oview").height($(".content-wrapper")[0].clientHeight);
    
    
    $scope.load = function () {
    	if($scope.oids.length==0){return;};
    	$scope.curtemper = [];
    	$scope.fstartTime= new Date().getTime(), endTime =  new Date(), startTime = new Date(endTime.getTime() - 1.5* 60 * 60 * 1000), maxTime=endTime.getTime();
        $http.get('/i/temp/getTempByTime', { params: {"oid": $stateParams.storageID, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (result) {
            $scope.isErr=false;$scope.name = result.name;
            $scope.startTime=endTime;
            $scope.tempdiff=result.tempdiff;
            $scope.startTemperature=result.startTemperature;
        	var yData = [], tempMap = result.tempMap,systime=result.systime,lasttime=0;
        	 $scope.datumTemp =  parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
        	var i= 0,tempList=newdata = [],vo=cuttime=null; 
            for(var key in tempMap) { 
             	 vo=cuttime=null, tempList=tempMap[key], newdata = [],lasttime=$scope.fstartTime;
                 if( tempList.length>0){
	                 for ( i = 0; i < tempList.length; i++) {
						 vo=tempList[i];
						 cuttime=new Date(vo.addtime).getTime();
	                	 newdata.push({ x: cuttime,y: vo.value });
					}
	                if(cuttime-lasttime>120000){ //修正中间数据短传问题1
	                	newdata.push({ x: lasttime+60000,y: null });
	                } 
	                if( systime-cuttime>1800000&&systime-maxTime<1200000){//大于半个小时。。提醒
	                	newdata.push({ x: maxTime,y:null }); 
	                	if(!$scope.isErr){ $scope.isErr=true;}
	                }   //修正尾部数据短传问题2
	               if(newdata[newdata.length-1].y!=null){ 
	            	   $scope.curtemper.push([key ,newdata[newdata.length-1].y.toFixed(2)]); 
	            	}
                 }else{
                	 if(!$scope.isErr){ $scope.isErr=true;}
                	 newdata.push({ x: startTime.getTime(),y:null });
                	 newdata.push({ x: maxTime,y:null });
                	 $scope.curtemper.push([key,null]);
                 }
                yData.push({"name": key, "data": newdata,turboThreshold:0 });
            } 
            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data:  [ {x:startTime.getTime(),y: $scope.datumTemp },{x:endTime.getTime(),y: $scope.datumTemp } ]});//处理基准温度
            yData.push({ name: '启动温度', color: '#00BFFF',dashStyle: 'dash', marker: { symbol: 'circle' },data: [ {x:startTime.getTime(),y:(  $scope.tempdiff+ $scope.startTemperature)},{x:endTime.getTime(),y:$scope.tempdiff+ $scope.startTemperature} ]});//处理基准温度
            yData.push({ name: '停机温度', color: '#00BFFF',dashStyle: 'dash', marker: { symbol: 'circle' },data: [{x:startTime.getTime(),y:$scope.startTemperature},{x:endTime.getTime(),y:$scope.startTemperature} ]});//处理基准温度
            $scope.initHighchart( $scope.datumTemp,yData);
            if( $scope.isErr){ $("#mgs_div1").removeClass("hidden");}else{ $("#mgs_div1").addClass("hidden");}
          });
        $http.get('http://139.224.16.238/i/util/getColdAlarmStatus', { params: {oid: $stateParams.storageID}}).success(function (result) {$scope.isOverTemp=result; });
    };

    $scope.activeLastPointToolip= function(chart) {
        var points = chart.series[0].points;
        chart.tooltip.refresh(points[points.length -1]);
    };
    
    $scope.refdata=function(){
        $http.get('http://139.224.16.238/i/util/getColdAlarmStatus', { params: {oid: $stateParams.storageID}}).success(function (result) {$scope.isOverTemp=result; });
        $http.get('/i/temp/getTempref', { params: {"oid": $stateParams.storageID, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime": baseTools.formatTime($scope.startTime), "endTime": baseTools.formatTime(new Date())}}).success(function (result) {
         var series =  $scope.chart.series ,endTime =  new Date(), tempMap = result.tempMap,index=0;
       	 for(var key in tempMap) { 
         	 tempList=tempMap[key],newdata=[];
             if( tempList.length>0){
            	 $scope.startTime=endTime;
                 for ( var i = 0; i < tempList.length; i++) {
					 vo=tempList[i];series[index].addPoint([new Date(vo.addtime).getTime(),  vo.value], false, false);
					 series[index].hide();
					 series[index].show();
				 }
                  $scope.curtemper[index][1]=vo.value;
                  $scope.isErr=false;
             }
             index++;
         }
       	 if(series.length>3){
       		endTime =  new Date().getTime();
        	 var bastempLine=series[series.length-3]; bastempLine.addPoint([endTime,  $scope.datumTemp], false, false);
        	 bastempLine=series[series.length-2];bastempLine.addPoint([endTime,   $scope.tempdiff+ $scope.startTemperature], false, false);
        	 bastempLine=series[series.length-1];bastempLine.addPoint([endTime,  $scope.startTemperature], true, false,true);
         }
    	});
    };
    $scope.initHighchart=function(datumTemp,yData ){
  	  $('#temperatureChart').highcharts({
    		 legend: { enabled: false },
           exporting: {enabled: false},
           credits: { enabled: false },
           plotOptions: { series: { marker: { enabled: false } }},
           title: { text: '' },
    	    chart: {
    	    	type: 'spline',
    	        animation: Highcharts.svg,
    	        marginRight: 10,
    	        events: { load: function () { $scope.chart =this;} },
    	        backgroundColor: { linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1}, stops: [ [0, 'rgba(0,0,0,0)'],[1, 'rgba(0,0,0,0)'] ]   },
    	        borderColor: '#d2d6de', borderWidth: 2, className: 'dark-container', plotBackgroundColor: 'rgba(210, 214, 222, .1)',  plotBorderColor: '#d2d6de', plotBorderWidth: 1,
    	        events: {
    	            load: function () { $scope.chart=this;
    	            }
    	        }
    	    },
    	    xAxis: { type: 'datetime',  tickPixelInterval: 150  },
    	    yAxis: { title: { text: '温度(℃)' },plotLines: [{ value: 0,  width: 1, color: '#808080' }]},
    	    yAxis: {title: {text: '温度(℃)' }  },
    	    tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2)+" ℃"; } },
    	    legend: {enabled: false },
    	    exporting: { enabled: false  },
    	    series: yData
    	});
//  	  $('.chart-container').on('mousedown', function () {
//          $(this).toggleClass('modal');
//          $scope.chart.reflow();
//      });
    };
    $scope.getTempset(); 
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () { $scope.refdata(); }, 30000);
    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });
});