/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageDoor', function ($scope, $location, $stateParams, $http,$rootScope,baseTools) {
    console.log($stateParams.storageID);
    Highcharts.setOptions({ global: {useUTC: false }});
    $scope.coldStorageDoors=[];
    
    
    $scope.initdata=function(){
    	   $http.get('/i/coldStorageDoor/findByStorageId?storageID=' + $stateParams.storageID).success(
        		function(data,status,config,header){
        			if(data.length > 0){
        				$scope.coldStorageDoors=data;
        				 $scope.load();
        			}
        		});
    	
    };
    
    $scope.load = function () {
	       if($scope.coldStorageDoors){ 
	    	   var endTime =  new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
	    	   angular.forEach($scope.coldStorageDoors,function(obj,i){$scope.drawDoor(obj.id,startTime,endTime);});
	       }
    };
    
    
    
    $scope.drawDoor = function(doorid,startTime,endTime){
    	$http.get('/i/baseInfo/getKeyValueDataByTime', {  params: { "oid": doorid, type:2,key:'Switch' , "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)} }).success(function (result) {
        	var data = [];
            for (var i = 0; i < result.length; i++) {
                var val = Date.parse(result[i].addtime);
                var newDate = new Date(val).getTime();
                data.push({x: newDate, y: result[i].value});
            }
            $('#storageDoorChart'+doorid).highcharts({
                    chart: { type: 'area' },
                    title: {text: '' },
                    xAxis: { type: 'datetime', tickPixelInterval:  200, },
                    yAxis: {
                    	max:1,
                        min:0,
                        allowDecimals: false,
                        title: { text: 'DoorState(0关1开)' },
                        plotLines: [{ value: 0, width: 1, color: '#808080' }],
                        labels: { formatter:function(){ return this.value===0?"关":"开"; }},
                    },
                    tooltip: {
                        formatter: function () {
                            var state =this.y === 1? '冷库处于开门状态': '冷库处于关门状态';return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + state;
                        }
                    },
                    legend: { enabled: false },
                    exporting: { enabled: false},
                    credits: { enabled: false  },
                    plotOptions: {  area: {stacking: 'percent',marker: { enabled: false}} },
                    series: [{name: 'DoorState', data: data, }]
             });
        });
    };
    $scope.initdata();
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {  $scope.load(); }, 30000);
    $scope.$on('$destroy',function(){clearInterval($rootScope.timeTicket);});
});
