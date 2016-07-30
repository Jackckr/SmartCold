/**
 * 发布货品车
 */
coldWeb.controller('releaseItemList', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location) {
	 if(user==null||(user!=null&&user.id==0)){ util.info(null,"你还没有登录！请登录后操作！",function(){window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";return; });}
	 $("#shareMain_list").removeClass("hide");
	 $scope.typeCode=1;
	 $scope.maxSize = 5;	// 显示最大页数
     $scope.bigTotalItems = 0; // 总条目数(默认每页十条)
     $scope.bigCurrentPage = 1;  // 当前页
     $scope._cuttid=$stateParams._cuttid;//系统传参  rdcconfig
     var datatype= $location.search()._cuttid;//外部传参
     if(!datatype){ datatype=rdcconfig._cuttid; }
     $scope.dataType = $stateParams._cuttid?$stateParams._cuttid:datatype;//当前数据类型
     $scope.appmode=[{url1:""},{tolimg:["goods","outCur","offerCur"],tool:[[1,"出售"],[2,"求购"]],btn:"发布"},{tolimg:["car","carCur","noCarCur"],tool:[[1,"找货"],[2,"找车"]],btn:"发布"},{tolimg:["rent","rentCur","noRentCur"],tool:[[1,"出租"],[2,"求租"]],btn:"发布"}];
	 $scope.releaseitem=function(data){//带数据发布
		  var url= $scope.dataType==2?"releaseCarInfo":"releaseItem";
		  $state.go(url,{data:data,dataid:$scope.typeCode-1,_cuttid: $scope.dataType});
	 };
	 $scope.simplyitem=function(){//不关联发布
		 if(user==null||(user!=null&&user.id==0)){ util.info(null,"你还没有登录！请登录后操作！",function(){
			 window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";return; 
			 });
		  return;
		 }
		 var url= $scope.dataType==2?"releaseCarInfo":"releaseItem";
		  $state.go(url,{data:null,dataid:$scope.typeCode-1,_cuttid: $scope.dataType});
	 };
     $scope.goLogin=function(){
    	  window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";
	 };
	 $scope.goaddrdcpag=function(){
		  if(user!==null&&user.id!=0){
			  $location.path("/coldStorageAdd");
		  }else{
              window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";
		  }
	  };
	  $scope.pageChanged = function () {
		  $.post("/i/ShareRdcController/getRdcByUid",   {pageNum : $scope.bigCurrentPage,pageSize : $scope.maxSize}, function(data) { $scope.$apply(function () {
	    	   $scope.rdclist = data.data;//
			   $scope.bigTotalItems = data.total;
			   if(data.total==0){$("#nodata_div").removeClass("hide"); $("#dataList_div").addClass("hide"); }
		  });});
	  };
	  $scope.changtype=function(_em){
		   var em=$(_em); 
	       $("#item_type_div span").removeClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]); 
	       $scope.typeCode=em.attr("value");
	       em.addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
	       if($scope.dataType==3){
			   if($scope.typeCode==1&&$scope.bigTotalItems==0){ alert("请添加库后执行该操作！");return; }
			   var data=$scope.typeCode==1?$scope.rdclist[0]:null;
	    	   $state.go('releaseItem',{data:data,dataid:$scope.typeCode-1,_cuttid: $scope.dataType});	
	       }
	  };
	 $scope.pageChanged();
});
