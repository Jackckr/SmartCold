
/**
 * Created by maqiang34 on 16/10/18.
 * 显示消息
 */
coldWeb.controller('message', function( $scope, $rootScope,$http ,$timeout) {
	$scope.params={userId:null,rdcId:$rootScope.rdcId, type:null,stype:null,isRead:null,status:null, page:1, rows:10};
	$scope.notReadMessage=$rootScope.notReadMessage;
	$scope.modestate=['待处理','已处理'];
	$scope.changType  =function(type,  em){$scope.changestyle(em);$scope.params.type=type;$scope.initmsg();};
	$scope.changsType =function(stype, em){$scope.changestyle(em);$scope.params.stype=stype;$scope.initmsg();};
	$scope.changstatus=function(status,em){$scope.changestyle(em);$scope.params.status=status;$scope.initmsg();};
	$scope.changestyle=function(em){$("#ul_msgtype li").removeClass("active");$(event.target.parentNode).addClass("active");};
	$scope.allmsg=function(em){$scope.changestyle(em);$scope.params.type=null,$scope.params.stype=null,$scope.params.isRead=null,$scope.params.status=null, $scope.params.page=0, $scope.params.rows=10;$scope.initmsg();};
	
	$scope.initmsg=function(){
		 $http({method:'POST',url:'i/messageRecord/getMessageList',params:$scope.params}).success(function (data) {
             $rootScope.msgList=data;
         });
	};
	$scope.showmsg=function(idex){
		$scope.currmsg=$rootScope.msgList[idex];
		$("#msgdialog").modal();
	};
	
	
	
	$scope.initmsg();
});
