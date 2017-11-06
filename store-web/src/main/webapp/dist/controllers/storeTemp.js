/**
 * 
 * 
 */
app.controller('storeTemp', function($scope,$http, $rootScope) {
	$scope.format= { millisecond: '%H:%M:%S.%L',second: '%H:%M:%S',minute: '%H:%M',hour: '%H:%M', day: '%Y-%m-%d',week: '%m-%d',month: '%Y-%m',year: '%Y' };

	$scope.initdata=function(){
		  $http.get('/i/storeController/getdata').success(function (result) {
			var data=  result.results[0].series[0].values,serve=[];
			angular.forEach(data,function(obj,i){
				serve.push([obj[1],obj[2]]);
			});
			  $scope.initcharts(serve);    
	    });
	};
	
	
	$scope.initcharts=function(data){
		$('#container').highcharts({ chart: {  zoomType: 'x' },
            title: { text: 'ces' },
            subtitle: {
                text: document.ontouchstart === undefined ? '鼠标拖动可以进行缩放' : '手势操作进行缩放'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: $scope.format
            },
            tooltip: {
                dateTimeLabelFormats: $scope.format
            },
            yAxis: { title: { text: '汇率' }},
            legend: {  enabled: false },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '美元兑欧元',
                data: data
            }]
        });
		
	};
	
	
	
	
	$scope.initdata();
	
	
});
