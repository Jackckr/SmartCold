/**
 * 共享详情
 */
coldWeb.controller('shareriteminfo',function($rootScope, $scope, $stateParams, $state, $cookies, $http, $location) {
	 $scope.my_tel=user.telephone;
	 $scope.vercodeval="";
	var InterValObj=null; //timer变量，控制时间  
	var count =curCount=60;//当前剩余秒数  
	$scope._dataid = $stateParams.dataid;//当前数据类型
    $scope.initdata = function() {
        	$http.get('/i/ShareRdcController/getSEByID', { params: {"id": $scope._dataid}  }).success(function(data) {
        		 $scope.vo=data.entity;
        	}); 
    };
    $scope.sendMessage=function () {  
        curCount = count;  
        var phone=$("#user_tel").val();//手机号码  
        if(phone != ""){  
            $("#gt_yzm_but").attr("disabled", "true");  
            $("#gt_yzm_but").text(curCount + "重新发送");  
            InterValObj = window.setInterval($scope.SetRemainTime, 1000); //启动计时器，1秒执行一次  
             //向后台发送处理数据  
            $.ajax({ url: "/i/ShareRdcController/sharvistPhone", data: {telephone:phone , dataid: $scope.vo.id}, type: 'POST',dataType:"json", success: function(data) {alert(data.message);}}); 
        }else{  
            alert("手机号码不能为空！");  
        }  
    } ; 
    //timer处理函数  
    $scope.SetRemainTime= function() {  
        if (curCount == 0) { window.clearInterval(InterValObj);  $("#gt_yzm_but").removeAttr("disabled"); $("#gt_yzm_but").text("重新获取");   }  else {  curCount--;   $("#gt_yzm_but").text(curCount + "重新发送");  }  
    } ;
    $scope.vercode=function(){
	    var vercode=$("#user_yzm").val();
	    if(vercode.length>=4){
	    	 $.ajax({ url: "/i/ShareRdcController/sharvistCode", data: {yzm:vercode}, type: 'POST',dataType:"json", success: function(data) {
	    		 $("#shar_excut_ord").attr("disabled", !data);
	    	}}); 
	     }else{
	    	 $("#shar_excut_ord").attr("disabled", true);
	     }
    };
    $scope.shareApplyObj=function(){//点击抢单操作
    		$.ajax({ url: "/i/ShareRdcController/shareApplyObj", type: 'POST',dataType:"json", success: function(data) {
    			
    		}}); 
    };
    $scope.initdata();
});