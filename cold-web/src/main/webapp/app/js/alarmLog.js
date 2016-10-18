coldWeb.controller('alarmLog', function($rootScope, $scope, $http,baseTools,$timeout) {
	/*$scope.alarmMsgs = [ {
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
	} ];*/
	 //根据rdcid查询该rdc的报警信息
        $http.get('/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": window.sessionStorage.smrdcId
            }
        }).success(function (data) {
            $scope.alarmMsgs = data;
        });
});

/**
 * 计算压缩机剩余时间
 */
coldWeb.controller('baoyangReminder', function( $scope, $rootScope ) {
	 $(".mainHeight").height( $(".content-wrapper").height());
	 $scope.aredayTime = function(time) {
		   if(time==null||time==""){ return "未设置保养信息";}
		    var text="还剩";
		    var date1=new Date();    
		    var date2=new Date(time);
			var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数  
			var days=Math.floor(date3/(86400000)) ; 
			var hours=Math.floor(date3%(86400000)/(3600000)) ; 
			if(days>0){text+=days+"天 ";}
			text+=hours+"小时 ";
			return  text;
      };
});