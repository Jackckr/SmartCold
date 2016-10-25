
/**
 * Created by maqiang34 on 16/10/18.
 * 360体检
 */
coldWeb.controller('base', function( $scope, $rootScope,$http,$timeout,baseTools ) {
	//初始化页面
	$scope.pageindex=1;
	$scope.rdcid=window.sessionStorage.smrdcId;
	$scope.cwheight=$(".content-wrapper").height();
	$(".mainHeight").height($scope.cwheight); 
	$scope.physicalday= window.localStorage.physicalday;
	var msg={errmsg:{'0':"非法请求","-1":"你还没有冷库信息！","-2":"没有设备","-3":"没有配置！"}};
	if($scope.physicalday){
		var date1=new Date($scope.physicalday); var date2=new Date(); var date3=date2.getTime()-date1.getTime();  var days=Math.floor(date3/(86400000)) ; 
		if(days==0){$scope.msg='上次体检时间：'+baseTools.formatTime( $scope.physicalday);}else if(days<2){$scope.msg='系统已经'+days+"未体检了,建议体检";}else {$scope.msg='系统已经很久未体检了,建议体检';}
	}else{
		$scope.msg='您的冷库还没有体检哦，建议立即体检！';
	}
	//体检
	$scope.physical=function(){ $("#loding").show(); $timeout($scope.pysical,1500); };
	$scope.pysical=function(){
		$http.get('/i/physicalController/checkup',{params: {"rdcId":$scope.rdcid } }).success(function(data,status,config,header){
			 $("#loding").hide();
		      if(data.success){
		    	  window.localStorage.physicalday=new Date();
		    	  debugger;
		    	  $scope.data=data.entity;
		    	  
		    	  $scope.showpage(2);
		      }else{
		    	 alert(msg.errmsg[data.message]);
		      }
		 });
	};
	$scope.showsg=function(i,em){
		if(em){
			$("#grouppan1,#grouppan2,#grouppan3").addClass("collapsed-box");
			$("#grouppan1 button[data-widget=collapse] i,#grouppan2 button[data-widget=collapse] i,#grouppan3 button[data-widget=collapse] i").removeClass("fa-minus").addClass("fa-plus");
			$("#grouppan1 .box-body,#grouppan2 .box-body,#grouppan2 .box-body ").css({ display:"none"});
			
			$("#"+em ).removeClass("collapsed-box");
			$("#"+em+" .box-body").css({ display:"block"});
			$("#"+em+" button[data-widget=collapse] i").removeClass("fa-plus").addClass("fa-minus");
//			$("#phsg_sour3:first").prepend($("#"+em));
		}
		$scope.showpage(i);
	};
	//切換也頁面
	$scope.showpage=function(i){
		$("#physicalstep1,#physicalstep2,#physicalstep3").hide(); $("#physicalstep"+i).show();
	};
	
});

coldWeb.controller('cold360PhysicalList', function( $scope, $rootScope ) {
	
});


