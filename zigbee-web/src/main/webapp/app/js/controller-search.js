coldWeb.controller('search', function ($rootScope, $scope, $cookies, $http ,$location,$window, $state) {
	
	$scope.search = function(){
		$location.path("/multi-query/" + $scope.key);
	}
	
});
coldWeb.controller('multi-query', function ($rootScope, $scope, $cookies, $http ,$location,$window, $stateParams) {
	$scope.key = $stateParams.key;
	
	$scope.load = function(){
		url = "/i/singleInfo/findByKey?key=" + $scope.key;
		$http.get(url).success(function(data,status,config,header){
			if(data.infos.length == 0){
				alert("没有查询到相应商品");
				$location.path('/search')
			}else{
				$scope.singleInfo = data;
				$scope.singleChart($scope.singleInfo);
			}
		})
	}
	
	$scope.dateToStr = function(datetime){ 
		 var year = datetime.getFullYear();
		 var month = datetime.getMonth()+1;//js从0开始取 
		 var date = datetime.getDate(); 
		 var hour = datetime.getHours(); 
		 var minutes = datetime.getMinutes(); 
		 var second = datetime.getSeconds();
		 
		 if(month<10){
		  month = "0" + month;
		 }
		 if(date<10){
		  date = "0" + date;
		 }
		 if(hour <10){
		  hour = "0" + hour;
		 }
		 if(minutes <10){
		  minutes = "0" + minutes;
		 }
		 if(second <10){
		  second = "0" + second ;
		 }
		 
		 var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second;
		 return time;
	}
	
	$scope.singleChart = function(data){
		var lineChartCanvas = $("#areaChart").get(0).getContext("2d");
	    // This will get the first returned node in the jQuery collection.
	    var lineChart = new Chart(lineChartCanvas);
	    	$scope.time = [];
	    	$scope.temperature = [];
	    	$scope.warning = [];
	    	angular.forEach(data.ananysis,function(item){
	    		item.startTime = $scope.dateToStr(new Date(Date.parse(item.startTime)));
	    		item.endTime = $scope.dateToStr(new Date(Date.parse(item.endTime)));
	    	})
	    	angular.forEach(data.infos,function(item){
	    		item.time = $scope.dateToStr(new Date(Date.parse(item.time)))
	    		$scope.time.push(item.time);
	    		$scope.temperature.push(item.temperature);
	    		$scope.warning.push(-9);
	    	});
	    	var lineChartOptions = {
	    		      labels: $scope.time,//["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
	    		      datasets: [
					    { 
						  label: "warning",
						  fillColor: "rgba(255,255,255,1)",
						  strokeColor: "rgba(255,0,0,1)",
						  pointColor: "#fff",
						  pointStrokeColor: "rgba(255,255,255,1)",
						  pointHighlightFill: "#fff",
						  pointHighlightStroke: "rgba(255,255,255,1)",
						  data: $scope.warning
					    },
	    		        {
	    		          label: "Digital Goods",
	    		          fillColor: "rgba(60,141,188,0.9)",
	    		          strokeColor: "rgba(60,141,188,0.8)",
	    		          pointColor: "#3b8bba",
	    		          pointStrokeColor: "rgba(60,141,188,1)",
	    		          pointHighlightFill: "#fff",
	    		          pointHighlightStroke: "rgba(60,141,188,1)",
	    		          data: $scope.temperature//[28, 48, 40, 19, 86, 27, 90]
	    		        }
	    		      ]
	    		    };
	    		    var areaChartOptions = {
    		            //Boolean - If we should show the scale at all
    		            showScale: true,
    		            //Boolean - Whether grid lines are shown across the chart
    		            scaleShowGridLines: false,
    		            //String - Colour of the grid lines
    		            scaleGridLineColor: "rgba(0,0,0,.05)",
    		            //Number - Width of the grid lines
    		            scaleGridLineWidth: 1,
    		            //Boolean - Whether to show horizontal lines (except X axis)
    		            scaleShowHorizontalLines: true,
    		            //Boolean - Whether to show vertical lines (except Y axis)
    		            scaleShowVerticalLines: true,
    		            //Boolean - Whether the line is curved between points
    		            bezierCurve: true,
    		            //Number - Tension of the bezier curve between points
    		            bezierCurveTension: 0.3,
    		            //Boolean - Whether to show a dot for each point
    		            pointDot: false,
    		            //Number - Radius of each point dot in pixels
    		            pointDotRadius: 1,
    		            //Number - Pixel width of point dot stroke
    		            pointDotStrokeWidth: 1,
    		            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    		            pointHitDetectionRadius: 20,
    		            //Boolean - Whether to show a stroke for datasets
    		            datasetStroke: true,
    		            //Number - Pixel width of dataset stroke
    		            datasetStrokeWidth: 2,
    		            //Boolean - Whether to fill the dataset with a color
    		            datasetFill: true,
    		            //String - A legend template
    		            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    		            //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    		            maintainAspectRatio: true,
    		            //Boolean - whether to make the chart responsive to window resizing
    		            responsive: true
    		          };
	    		    lineChartOptions.datasetFill = false;
	    	        lineChart.Line(lineChartOptions, lineChartOptions);
	  };
	  
	$scope.batchInfo = function(){
		url = "/i/singleInfo/findBatchByKey?key=" + $scope.key;
		$scope.warnings = 0;
		$http.get(url).success(function(data,status,config,headers){
			$scope.batchData = data;
			angular.forEach($scope.batchData,function(item){
				$scope.warnings += item.overTemperatureTimes >=1?1:0;
			})
		});
	}
	
	$scope.load();
});

coldWeb.controller('goods-list', function ($rootScope, $scope, $cookies, $http ,$location,$window, $stateParams) {
    $scope.key = $stateParams.key;
	
	$scope.load = function(){
		url = "/i/singleInfo/findBatchByKey?key=" + $scope.key;
		$scope.warnings = 0;
		$http.get(url).success(function(data,status,config,headers){
			$scope.batchData = data;
		});
	}
	
	$scope.load();
});
