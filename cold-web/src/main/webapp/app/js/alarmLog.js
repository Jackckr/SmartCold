coldWeb.controller('alarmLog', function($rootScope, $scope, $http,baseTools,$timeout) {
	$scope.alarmMsgs = [ {
		Msg : '电流不平衡度报警值1',
		addTime : '2016-10-11 13:29:36'
	}, {
		Msg : '电流不平衡度报警值2',
		addTime : '2016-10-11 23:30:13'
	}, {
		Msg : '电流不平衡度报警值3',
		addTime : '2016-10-12 9:45:29'
	}, {
		Msg : '电流不平衡度报警值4',
		addTime : '2016-10-12 18:20:05'
	} ];
});