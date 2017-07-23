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
 localStorage.oURL=document.URL;

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
    	$scope.user=window.user;
		$scope.datatype=1;
		$http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	    $scope.appmode=[{},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
	    $scope.gosharedile=function(sharid){ 
	    	debugger;
//	    	window.location.href ="storehousedetail.html?id="+sharid;
        };
         $scope.manageType=["","产地型","市场型","仓储型","配送型","生产型","中央厨房","医药型","其它"];
         $scope.tempType=["","冷藏库","冷冻库","超低温库","恒温库","多温区库"];
         $scope.refreg=["","氨制冷","氟利昂制冷","氨氟都有","其他"];
         $scope.struct=["","土建型","钢结构型"];
         $scope.saveType=["","货架存放","非货架存放","堆垛存放","货架和堆垛都有"];
         $scope.isHave=["","有","无"];
         $scope.oSwitch=false;
         $scope.user=window.user;
         $scope.on_off=function($event){
         	if($scope.oSwitch){
                $scope.oSwitch=false;
                $event.target.innerText='展开';
			}else{
                $scope.oSwitch=true;
                $event.target.innerText='收起';
			}
		 };
         $scope.checkUserLogin = function () {
             if(window.user!=null&&window.user!=undefined){
                 return true
             }else{
                 return false
             };
         };
         $scope.goWhere = function () {
             if($scope.checkUserLogin()){//登录
                 if(localStorage.gowhere){//从我的html跳转而来
                     goback();
                 }else{//
                     if(localStorage.isStand==0){
                         location.href='rdclist.html'
                     }else if(localStorage.isStand==1){
                         location.href='rdcstand.html'
                     }else if(localStorage.isStand==2){
                         location.href='user-mycold.html'
                     }else{
                         goback();
                     }
				 }
             }else{//未登录
                 goback();
             }
         };
		$scope.initdata=function(){
	       //获得数据
	    	$http.get(ER.root+'/i/rdc/findRDCDTOByRDCId', { params: {"rdcID": id}}).success(function(data) {//withCredentials: true , headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    		if(data){
	    			$scope.vo=data[0];
	    			$scope.auth_show = ($scope.isLogin(user) && $scope.vo.audit !== 2);
    			}else{
	    			//alert(data.message);
	    			layer.open({
	    		 	    content: data.message
	    		 	    ,btn: '确定'
	    		 	  });
	    			}
	    	}); 
	    	// class="userType"
	    	/*if(window.user!=null && window.user.type!=0){
	    		$("div.userType").show();
	    		$("p.userType").hide();
	    	}else{
	    		$("div.userType").hide();
	    		$("p.userType").show();
	    	}*/
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
         /*详情页轮播*/
         function slideFn() {
             $dragBln = false;
             $(".main_image").touchSlider({
                 flexible: true,
                 speed: 200,
                 paging: $(".flicking_con a"),
                 counter: function (e) {
                     $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
                 }
             });

             $(".main_image").bind("mousedown", function () {
                 $dragBln = false;
             });

             $(".main_image").bind("dragstart", function () {
                 $dragBln = true;
             });

             $(".main_image a").click(function () {
                 if ($dragBln) {
                     return false;
                 }
             });
         }
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) { baguetteBox.run('.baguetteBoxOne', {buttons:true});imgBoxHide();slideFn();});
      });
     app.directive('onFinishRenderFilters', function ($timeout) { return { restrict: 'A', link: function(scope, element, attr) {   $timeout(function() { scope.$emit('ngRepeatFinished');  },100); } };});
 }
