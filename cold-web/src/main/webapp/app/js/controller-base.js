coldWeb.controller('base', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	$rootScope.load = function () {
    }
	
	$scope.load = function(){		
		var lineChart = echarts.init($('#temperature-chart')[0]);
		$http.get("/i/findLastNDataByApid?key=Temp&n=10").success(function(data,status,config,headers){
			$scope.data = data;
			xData = [];
			temperature = [];
			angular.forEach(data,function(item){
				xData.push(item.addtime);
				temperature.push(item.value);
			})
			option = {
					tooltip : {
						trigger: 'axis'
					},
					legend: {
						data:['温度']
					},
					calculable : true,
					xAxis : [
					         {
					        	 type : 'category',
					        	 data : xData
					         }
					         ],
					         yAxis : [
					                  {
					                	  type : 'value',
					                	  name : '温度',
					                	  axisLabel : {
					                		  formatter: '{value} °C'
					                	  }
					                  }
					                  ],
					                  series : [
					                            {
					                            	name:'温度',
					                            	type:'line',
					                            	data:temperature,
					                            }
					                            ]
			};
			lineChart.setOption(option);
		})
	}
    
	$rootScope.logout = function () {
    	$http.get('/i/user/logout');
    	$rootScope.user = null;
		window.location.pathname="";
		window.location.href = "/login.html";
		window.event.returnValue=false;
    }
    
    $scope.load();

    
});

coldWeb.controller('error', function ($scope, $location,rejection) {
	$scope.status = rejection.status;
	
	if(rejection.status == 401){
		$scope.message = rejection.data.errorMsg;
	}else{
		$scope.message = rejection.statusText;
	}
});

coldWeb.controller('about', function ($scope, $location,$http) {
});

coldWeb.controller('login', function ($scope, $location,$window) {
	
});