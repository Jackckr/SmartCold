/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageTemper', function ($scope, $location, $stateParams, $http,$rootScope, baseTools) {
    $scope.isErr=false;
    $scope.storageID= $stateParams.storageID;
    Highcharts.setOptions({  global: {useUTC: false  } , colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'] });
    $scope.oids=[],$scope.names=[];
    $scope.getTempset = function () {
	    $http.get('/i/temp/getTempsetByStorageID', { params: {"oid": $scope.storageID}}).success(function (data) {
	    	if(data){
	    	 	angular.forEach(data,function(obj,i){
	    	 		$scope.oids.push(obj.id);
	    	 		$scope.names.push(obj.name);
	    	 	});
	    	 	 $scope.load();
	    	}else{
	    		$("#mgs_div2").removeClass("hidden");
	    	}
	    });
    };
    
    $scope.load = function () {
    	if($scope.oids.length==0){return;};
    	$scope.curtemper = [];
        var endTime =  new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000), maxTime=endTime.getTime();
        $http.get('/i/temp/getTempByTime', { params: {"oid": $stateParams.storageID, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)}}).success(function (result) {
            $scope.isErr=false;$scope.name = result.name;
        	var yData = [], tempMap = result.tempMap,systime=result.systime;
            var datumTemp =  parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
        	var i= 0,tempList=newdata = [],vo=cuttime=lasttime=null; 
            for(var key in tempMap) { 
             	 vo=cuttime=null, tempList=tempMap[key], newdata = [],lasttime=startTime.getTime();
                 if( tempList.length>0){
	                 for ( i = 0; i < tempList.length; i++) {
						 vo=tempList[i];
						 if(i>0){ lasttime=newdata[newdata.length-1].x;}
						 cuttime=new Date(vo.addtime).getTime();
	                	 if(cuttime-lasttime>120000){ newdata.push({ x: lasttime+60000,y: null });} //修正中间数据短传问题1
	                	 newdata.push({ x: cuttime,y: vo.value });
					}
	                if( systime-cuttime>1800000&&systime-maxTime<600000){//大于半个小时。。提醒
	                	newdata.push({ x: maxTime,y:null }); 
	                	if(!$scope.isErr){ $scope.isErr=true;}
	                }   //修正尾部数据短传问题2
	               if(newdata[newdata.length-1].y!=null){ $scope.curtemper.push([key ,newdata[newdata.length-1].y.toFixed(2)]);}
                 }else{
                	 if(!$scope.isErr){ $scope.isErr=true;}
                	 newdata.push({ x: startTime.getTime(),y:null });
                	 newdata.push({ x: maxTime,y:null });
                 }
                yData.push({"name": key, "data": newdata });
            } 
            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data: [{x: startTime.getTime(),y: datumTemp},{x: endTime.getTime(),y: datumTemp}]});//处理基准温度
            $scope.initHighchart(datumTemp,yData);
            if( $scope.isErr){ $("#mgs_div1").removeClass("hidden");}else{ $("#mgs_div1").addClass("hidden");}
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
    $scope.getTempset(); 
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () { $scope.load(); }, 30000);
    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });
});
