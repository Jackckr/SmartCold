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
            xAxis: { categories: chardata.xdata },
            yAxis: {title: { text: ''},plotLines: [{ value: 0, width: 1, color: '#808080' }]},
//            tooltip: { valueSuffix: '' },
            legend: { layout: 'vertical', align: 'right',verticalAlign: 'middle',  borderWidth: 0},
            series: chardata.chdata });
      };
      $scope.initdata();
});
