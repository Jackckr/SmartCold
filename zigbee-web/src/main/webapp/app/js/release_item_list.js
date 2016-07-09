/**
 * 发布货品车
 */
coldWeb.controller('releaseItemList', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location) {
	 if(user==null||(user!=null&&user.id==0)){
		 alert("请登录后执行该操作！");
		 window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";return;
	  }
	 $("#shareMain_list").removeClass("hide");
	 $scope.maxSize = 5;	// 显示最大页数
     $scope.bigTotalItems = 0; // 总条目数(默认每页十条)
     $scope.bigCurrentPage = 1;  // 当前页
     $scope._cuttid=$stateParams._cuttid;//系统传参
     var datatype= $location.search()._cuttid;//外部传参
     if(!datatype){ datatype=1; }
     $scope.dataType = $stateParams._cuttid?$stateParams._cuttid:datatype;//当前数据类型
     $scope.appmode=[{url1:""},{tolimg:["goods","outCur","offerCur"],tool:[[1,"出货"],[2,"求货"]],btn:"发布货品"},{tolimg:["car","carCur","noCaRcur"],tool:[[1,"有车"],[2,"求车"]],btn:"发布货品"},{tolimg:["rent","rentCur","noRentCur"],tool:[[1,"出租"],[2,"求租"]],btn:"发布仓库"}];
	 $scope.releaseitem=function(data){
		  $state.go('releaseItem',{data:data,dataid:data.rdcID,_cuttid: $scope.dataType});
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
			 $http({method:'POST',url:'/i/ShareRdcController/getRdcByUid'}).success(function (data) {
				   $scope.rdclist = data.data;//
				   $scope.bigTotalItems = data.total;
				   if(data.total==0){
					   $("#nodata_div").removeClass("hide");
					   $("#dataList_div").addClass("hide");
				   }
			  });
	  };
	  $scope.changtype=function(_em){
		  var em=$(_em); 
		  if(em.attr("value")==1&&$scope.bigTotalItems==0){
	    	   alert("请添加库后执行该操作！");
	    	   return;
	       }
 	       $("#item_type_div span").removeClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]); 
	       $scope.typeCode=em.attr("value");
	       em.addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
	       if( $scope.typeCode==1){
	    	   var data=$scope.rdclist[0];
	    	    $state.go('releaseItem',{data:data,dataid:data.rdcID,_cuttid: $scope.dataType});	
	       }else{
	    	   $state.go('releaseItem',{data:null,dataid:null,_cuttid: $scope.dataType});	
	       }
	  };
	 $scope.pageChanged();
});
