 var id  = getUrlParam("id");//当前rdc-id数据信息
 //登录之后才显示手机号码
 function tel(){
	 if(window.user!=null&&window.user!=undefined){
		 $(".myphone").show();
		 $(".myphonedis").hide();
	 }else{
		 $(".myphone").hide();
		 $(".myphonedis").show();
	 };
 }

 if(id==null||id==''){
	 	$(document.body).html("");
	 	layer.open({
	 	    content: '请求内容不存在~~'
	 	    ,btn: '确定'
	 	  });
	 	//alert("请求内容不存在！");
 }else{
     var app = angular.module('app', []);
     $(".myphone").hide();     
     app.controller('colddetail', function($http, $location,$scope) { 
    	$scope.rdcid=id;
		$scope.datatype=1;
		$http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	    $scope.appmode=[{},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
	    $scope.gosharedile=function(sharid){ 
	    	debugger;
//	    	window.location.href ="storehousedetail.html?id="+sharid;
        };
		$scope.initdata=function(){
	       //获得数据
	    	$http.get(ER.root+'/i/rdc/findRDCByID', { params: {"rdcID": id}}).success(function(data) {//withCredentials: true , headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    		if(data.success){
	    			$scope.vo=data.data[0];
	    			tel();
	    			$scope.auth_show = ($scope.isLogin(user) && $scope.vo.audit !== 2);
    			}else{
	    			//alert(data.message);
	    			layer.open({
	    		 	    content: data.message
	    		 	    ,btn: '确定'
	    		 	  });
	    			}
	    	}); 
	        $http.get(ER.root + "/i/ShareRdcController/getSEGDList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:1}}).success(function( data) {//货品共享
				$scope.goodList = data.data;//
				$scope.gdtotal = data.total;//
			});
			$http.get(ER.root + "/i/ShareRdcController/getSEPSList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:2}}).success(function(data) {//配送共享
				$scope.pslist = data.data;//
				$scope.pstotal = data.total;//
			});
			$http.get(ER.root + "/i/ShareRdcController/getSERDCList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:3}}).success(function(data) {//冷库共享
				$scope.rdcList = data.data;//
				$scope.rdctotal = data.total;//
			});
			$http.get(ER.root + "/i/comment/findCommentsByRDCId", {params: {npoint:200,rdcID:id}}).success(function(data) {//评价信息--npoint：记录条数
				$scope.evaList = data;//
				$scope.evatotal = data.length;//
			});
		};
		$scope.initevg=function(){
			 baguetteBox.run('.baguetteBoxOne', {animation: 'slideIn', buttons: true});
		};
		$scope.initdata();
		$scope.initevg();
		$scope.isLogin = function (user) {
	        return undefined!=user && user.id > 0;
	    }
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {/*alert("33");*/ baguetteBox.run('.baguetteBoxOne', {buttons:true});imgBoxHide()});
      });
     app.directive('onFinishRenderFilters', function ($timeout) { return { restrict: 'A', link: function(scope, element, attr) {   $timeout(function() { scope.$emit('ngRepeatFinished');  },100); } };});
 }
