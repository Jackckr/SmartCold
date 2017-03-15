coldWeb.controller('webSiteVisits', function ($scope, $state, $cookies, $http, $location) {
	$scope.getWebSummary = function() {
		$http.get('/i/webSiteVisitsController/getMLCount').success(function(data){
			$scope.webMLCount = data;
		});
		
		$http.get('/i/webSiteVisitsController/getModular').success(function(data){
			$scope.webModular = data;
		});
		
		$http.get('/i/webSiteVisitsController/getWEBSV').success(function(data){
			$scope.websv = data;
			$scope.intitecHart(['main1','注册量','最近一周注册量'], data.TIMS,data.ET);
			$scope.intitecHart(['main2','访问量','最近一周访问量'],data.TIMS,data.AU);
			$scope.intitecHart(['main3','点击量','最近一周点击量'],data.TIMS,data.WK);
		});
	};
	$scope.intitecHart=function(dtm,xadata,serdata){
	      var myChart2 = echarts.init(document.getElementById(dtm[0]));
	      var option2 = {
	    		tooltip: {},
//	    		legend: { data:dtm[1] },
	            title: { text: dtm[2]+"" },
	            xAxis: {data: xadata},
	            yAxis: {},
	            series: [{name: dtm[1]+"" , type:'line',itemStyle : { normal: {label : {show: true}}}, smooth:true,  data: serdata }]
	        };
	       myChart2.setOption(option2);
	};
		
	$scope.getWebSummary();
	
});
