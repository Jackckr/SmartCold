/**
 * 分析报告-2.4-制冷系统分析
 * 
 */
coldWeb.controller('coolingAnalysis', function ($scope, $location, $stateParams, $http,$rootScope) {
	$scope.rdcid= window.sessionStorage.getItem("360rdcId");//缓存rdcid
	$scope.initdata=function(){
		Highcharts.setOptions({  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'] }); 
		$http.get('/i/AnalysisController/getCoolingAnalysis',{params: {rdcId:$scope.rdcid}} ).success(function(data,status,headers,config){
			if(data.success){$scope.createhech("#temperatureChart",data.entity);}else{alert(data.message);}
		});
	};
    $scope.createhech=function(id,chardata){
    	
    	$(id).highcharts({
    		
            title: { text: '', x: -20 }, credits: {enabled: false },
            chart:{
            	zoomType: 'x',
                panning: true,
                panKey: 'shift'
//            	borderColor: '#EBBA95',
//                borderWidth: 2,
//                animation: Highcharts.svg, // don't animate in old IE
//                marginRight: 10,
//                backgroundColor: {
//                    linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
//                    stops: [
//                        [0, 'rgb(210, 214, 222)'],
//                        [1, 'rgb(210, 214, 222)']
//                    ]
//                },
//                borderColor: '#d2d6de',
//                borderWidth: 2,
//                className: 'dark-container',
//                plotBackgroundColor: 'rgba(210, 214, 222, .1)',
//                plotBorderColor: '#d2d6de',
//                plotBorderWidth: 1
            },
            xAxis: { categories: chardata.xdata },
            yAxis: {title: { text: ''},plotLines: [{ value: 0, width: 1, color: '#808080' }]},
            tooltip: { valueSuffix: '°C' },
            legend: { layout: 'vertical', align: 'right',verticalAlign: 'middle',  borderWidth: 0},
            series: chardata.chdata });
      };
      $scope.initdata();
});
