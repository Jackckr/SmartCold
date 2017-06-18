
/**
 * Created by maqiang34 on 16/10/18.
 * 显示消息
 */
coldWeb.controller('message', function( $scope, $rootScope,$http ,$timeout) {
	$scope.params={userId:$rootScope.user.id,utype:$rootScope.user.type,rdcId:$rootScope.rdcId, type:null,stype:null,isRead:null,status:null, page:1, rows:10,total:0,totalPages:0};
	//$scope.notReadMessage=$rootScope.notReadMessage;
	$scope.modestate=['待处理','已处理'];
	$scope.changType  =function(type,  em){$scope.changestyle(em);$scope.params.type=type;$scope.initmsg();};
	$scope.changsType =function(stype, em){$scope.changestyle(em);$scope.params.stype=stype;$scope.initmsg();};
    $scope.changstatus = function (status, em,isread) {
        $scope.changestyle(em);
        $scope.params.status = status;
        $scope.params.isRead = isread;
        $scope.initmsg();
    };
	$scope.changestyle=function(em){$("#ul_msgtype li").removeClass("active");$(event.target.parentNode).addClass("active");};
	$scope.allmsg=function(em){$scope.changestyle(em);$scope.params.type=null,$scope.params.stype=null,$scope.params.isRead=null,$scope.params.status=null, $scope.params.page=1, $scope.params.rows=10;$scope.initmsg();};
	
	$scope.initmsg=function(){
		 $http({method:'POST',url:'i/messageRecord/getMessageList',params:$scope.params}).success(function (data) {
             $scope.params.total=data.total;
             $scope.params.totalPages=data.totalPages;
             $rootScope.msgList=data.data;
         });
	};
    $scope.syswarn = function () {
        alert("暂无");
    };
	$scope.counts = function () {
		//统计未读条数
        $http({method:'POST',url:'i/MessageController/getMsgCount',params:{rdcId:$rootScope.rdcId,type:$rootScope.user.type,userId:$rootScope.user.id,state:null,isread:0}}).success(function (data) {
			$scope.notReadMessage = data;
            $rootScope.notReadMessage = data;
        });
        //统计未处理条数
        $http({method:'POST',url:'i/MessageController/getMsgCount',params:{rdcId:$rootScope.rdcId,type:$rootScope.user.type,userId:$rootScope.user.id,state:0,isread:null}}).success(function (result) {
            $scope.notDealMessage = result;
        });
    }
    $scope.searchSys = function() {
        $scope.params.page = 1;
        $scope.params.keyword = $(".searchInput").val();
        $scope.initmsg();
    };
	$scope.showmsg=function(idex){
		$scope.currmsg=$rootScope.msgList[idex];
		if($scope.currmsg.state==1 || $scope.currmsg.state==-1){
		    alert("该条内容您已处理完毕了~")
            return
        }
		$(".sysModal").fadeIn();
	};
	//同意
	$scope.agree=function(){
		var str=[],oid="";  
		if($scope.currmsg.sType==1){
			$("#ul_storage input[type='checkbox']:checked").each(function(){  
				str.push($(this).val());  
			});
			if(str.length==0){
				alert("请选择授权的冷库！");
				return
			}else{oid=str.toString();}
		}
		$http({method:'POST',url:'i/authenUser/authorUserByRdcId',params:{ id:$scope.currmsg.id,userId:$scope.currmsg.uid,stype:$scope.currmsg.sType,rdcId:$scope.currmsg.rdcId, status:1,oids:oid  }}).success(function (data) {
			$scope.initmsg();
            $scope.counts();
            $(".sysModal").hide();
        });
	};
	//拒絕
    $scope.refuse=function(){
    	$http({method:'POST',url:'i/authenUser/authorUserByRdcId',params:{ id:$scope.currmsg.id,userId:$scope.currmsg.uid,stype:$scope.currmsg.sType,rdcId:$scope.currmsg.rdcId, status:-1,oids:""   }}).success(function (data) {
    		$scope.initmsg();
            $scope.counts();
            $(".sysModal").hide();
        });
	};
    $scope.off=function(){
        $http({method:'POST',url:'i/authenUser/authorUserByRdcId',params:{ id:$scope.currmsg.id,userId:$scope.currmsg.uid,stype:$scope.currmsg.sType,rdcId:$scope.currmsg.rdcId, status:0,oids:''  }}).success(function (data) {
            $scope.initmsg();
            $scope.counts();
            $(".sysModal").hide();
        });
        $(".sysModal").fadeOut();
    };

    $scope.initmsg();
    $scope.counts();
    $scope.pageChanged = function () {
        $scope.initmsg();
    }
});
