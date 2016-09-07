coldWeb.controller('historyData', function ($scope, $http,$rootScope,baseTools) {
	clearInterval($rootScope.timeTicket);
	$scope.getDateTimeStringBefore = function(before){
		return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,'');
	}
	
	$http.get("/i/historySearch/findAllStorageKeys",{
		params:{
			'rdcId':$rootScope.vm.choserdc.id
		}
	}).success(function(response){
		$scope.searchOptions = response;
		$scope.item = {option: $scope.searchOptions[0]};
		$scope.itemArray = [
		                    {id: 1, name: 'first'},
		                    {id: 2, name: 'second'},
		                    {id: 3, name: 'third'},
		                    {id: 4, name: 'fourth'},
		                    {id: 5, name: 'fifth'},
		                ];

		                $scope.selected = {item:$scope.itemArray[0]};
	})

	$scope.begin = $scope.getDateTimeStringBefore(3);
	$scope.end = $scope.getDateTimeStringBefore(0);
	$scope.picktime = $scope.begin + ' - ' + $scope.end;
	$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
	
	
	$scope.search = function(){
		var selected = $scope.item.option;
		if(selected){
			console.log(selected.keyDesc);
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0];
			$scope.end = bothTime[1];
			$http.get("i/baseInfo/getKeyValueDataByTime",{
				params:{
					type:selected.type,
					oid:selected.oid,
					key:selected.key,
					startTime:$scope.begin,
					endTime:$scope.end  
				}
			}).then(function(response){
				var listData = response.data;
				var xData=[],data=[];
				angular.forEach(listData,function(item){
					xData.unshift(baseTools.formatTime(item.addtime));
					data.unshift(item.value);
				});
				$scope.drawDataLine(xData,data);
			})
		}
	}
	
	$scope.drawDataLine = function(xData,data){
		var lineChart = echarts.init($('#data-chart')[0]);
		xData = xData.length > 0? xData : [1,2,3,4];
		data = data.length > 0 ? data : [34,35,34,21];
		var dataView = {show: true, readOnly: true, textareaColor:'#fff'};
		option = {
			    tooltip : {
			        trigger: 'axis'
			    },
			    calculable : true,
			    legend: {
			        data:[$scope.item.option.keyDesc]
			    },
//			    toolbox: {
//			        show : true,
//			        feature : {
//			            dataView : dataView,
//			        }
//			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : xData
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            name : $scope.item.option.unit,
			            axisLabel : {
			                formatter: '{value}'
			            }
			        }
			    ],
			    series : [
			        {
			            name:$scope.item.option.keyDesc,
			            type:'line',
			            data:data
			        }
			    ]
			};
		lineChart.setOption(option);
	}
});
