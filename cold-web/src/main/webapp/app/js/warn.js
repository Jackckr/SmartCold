/**
 * Created by xuyanan on 16/5/19.
 */
coldWeb.controller('warn', function($scope, $location, $stateParams, $http) {
	console.log($stateParams.rdcId);
	
	$scope.load = function() {
		$http.get('/i/warn/findLastNWarningsInfoByRdcId?rdcId='
				+ $stateParams.rdcId + '&point=100').success(function(result){
			$scope.data = [];
			 angular.forEach(result,function(index){
				 $scope.data.push({
					 id: index.id,
				     level: index.level,
				     time: index.addtime
				 });
			 });

			 $scope.bsTableControl = {
			            options: {
			                data: $scope.data,
			                rowStyle: function rowStyle(row,index){
			                	return {
			                		css: {
			                			"border-color":"white white white",
			                			"color": "black",
				                        "background-color": "#DDDDDD",
				                    }
			                	}
			                	return {};
			                },
			                cellStyle: function cellStyle(value, row, index){
			                	if(row == 1)
			                	      return { "background-color": "#DDDDDD"};
			                },
			                cache: false,
			                height: 400,
			                undefinedText: "NULL",
			                pagination: true,
			                search: true,
			                showColumns: false,
			                showRefresh: false,
			                minimumCountColumns: 2,
			                clickToSelect: true,
			                escape: true,
			                maintainSelected: true,
			                toolbar: '#copyArea',
						    showToggle: true,
			                columns: [{
			    		        field: 'id',
			    		        title: '告警id',
			    		        sortable: true
			    		    }, {
			    		        field: 'level',
			    		        title: '告警级别',
			    		        sortable: true,
			    		    }, {
			    		        field: 'time',
			    		        title: '告警时间',
			    		        sortable: true,
			    		    }]
			            }
			        };
		});
	}
	$scope.load();	
	$rootScope.timeTicket = setInterval(function () {
        $scope.load();
    }, 60000);
    $scope.$on('$destroy',function(){
    	clearInterval($rootScope.timeTicket);
    })
});
