/**
 * 　　报警信息
 */
coldWeb.controller('alarmLog', function( $scope, $http) {
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