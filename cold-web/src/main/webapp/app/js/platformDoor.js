/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('platformDoor', function ($scope, $location, $stateParams, $http,$rootScope,baseTools) {
	Highcharts.setOptions({ global: { useUTC: false}});
	
    $scope.load = function () {
    	$scope.doorId = $stateParams.doorid;
        var data = [];
        var endTime =  new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
//        $http.get('/i/baseInfo/getKeyValueData', { params: {"oid": $scope.doorId,type:11,  key:'Switch'} }).success(function (result) {
        	$http.get('/i/baseInfo/getKeyValueDataByTime', {  params: { "oid": $scope.doorId, type:11,key:'Switch' , "startTime": baseTools.formatTime(startTime), "endTime": baseTools.formatTime(endTime)} }).success(function (result) {
        	var ovl=undefined,cvl=undefined,ln=result.length;
        	if(ln==0){
        		
        		
        	}else{
        		 data.push({ x: new Date(Date.parse(result[0].addtime)).getTime(), y:  result[0].value});
                 for (var i = 1; i <ln ; i++) {
                     var val = Date.parse(result[i].addtime);
                     var newDate = new Date(val).getTime();
                     ovl= result[i-1].value;
                     cvl= result[i].value;
                     if(ovl&&ovl!=cvl){
                     	  data.push({ x: new Date(val).getTime()-1000, y: cvl==0?1:0});
                     }
                     data.push({ x: newDate, y: cvl});
                 }
                 $scope.dowercharts(data);
        	}
            
            
            
        });
    };
    $scope.dowercharts=function(data){
    	$('#storageDoorChart').highcharts({
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
                    var state =this.y === 1? '月台门处于开门状态': '月台门处于关门状态';return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + state;
                }
            },
            legend: { enabled: false },
            exporting: { enabled: false},
            credits: { enabled: false  },
            plotOptions: {  area: {stacking: 'percent', marker: { enabled: false}} },
            series: [{name: 'DoorState', data: data, }]
       });
    };
    
    $scope.load();

    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () { $scope.load(); }, 30000);
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
});
