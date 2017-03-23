


coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
    // 显示最大页数
    $scope.maxSize = 10;//33
    $scope.bigTotalItems = 0; // 总条目数(默认每页十条)
    $scope.bigCurrentPage = 1;   // 当前页
    function initfilter(){
    	 $http.get('/i/city/findProvinceList').success(function (data) { $scope.provinces = data; });
    	 $http.get('/i/rdc/getRDCFilterData').success(function (data) { 
    		 var fmlist=[],cllist=[],sklist=[];
			 var _fmty=data.entity.te, _clty=data.entity.dt, _skty=data.entity.mt;//经营类型，商品存放形式、温度类型
			 $.each(_fmty, function(i, vo){fmlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });
			 $.each(_clty, function(i, vo){cllist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
			 $.each(_skty, function(i, vo){ sklist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
			 $("#fl_mt_ty ul").append(sklist.join("")) ; 
			 $("#fl_dt_ty ul").append(cllist.join("")) ; 
			 $("#fl_te_ty ul").append(fmlist.join("")) ; 
			 $("#fl_mt_ty li").click(function(event) {addfilter("#fl_mt_ty li",$(this));});//车型
			 $("#fl_dt_ty li").click(function(event) {addfilter("#fl_dt_ty li",$(this));});//温度类型
		     $("#fl_te_ty li").click(function(event) {addfilter("#fl_te_ty li",$(this));});//业务类型
		     $("#fl_sm_ty li").click(function(event) {addfilter("#fl_sm_ty li",$(this));});//业务类型
		     $("#fl_cr_ty li").click(function(event) {var em=$(this);  if(em.hasClass("active")){em.removeClass("active");$(em.parent()).prev().addClass("active");}else{$("#fl_cr_ty li" ).removeClass("active");$(em.parent()).prev().removeClass("active");em.addClass("active");}  $scope.pageChanged();  });
		     $("#rdc_filter_div ._nonefilter" ).click(function(event) {  $(this).next().find("li").removeClass("active"); $(this).addClass("active");  $scope.pageChanged(); });//业务类型
		     $("#sl_provincesl").change(function(){$scope.pageChanged();});
		     $("#txt_seachtxt").bind("keyup", function(event) { if (event.keyCode == "13") { 
		    	 if($(this).val().trim() == ""){
		    		 alert("请输入冷库关键字~")
		    	 }else{
			    	 $("#rdc_filter_div li" ).removeClass("active");
			    	 $("#rdc_filter_div ._nonefilter" ).addClass("active");
			    	 $scope.pageChanged(true); 
		    	 }
		     } });//数据搜索事件
          });
    }
    function addfilter(id,em){
		 $($(id).parent()).prev().removeClass("active");
	      if(em.hasClass("active")){em.removeClass("active"); }else{ em.addClass("active");}
	      if( $(id+".active").length==0){
	        $(id).removeClass("active");
	        $($(id).parent()).prev().addClass("active");
	      }
          $scope.pageChanged();   //通知组件刷新数据
	   }
	 function getFilter(pageNum,pageSize,isKey){
	    	  var mtlist= ($("#fl_mt_ty li.active").length==$("#fl_mt_ty li").length||$("#fl_mt_ty li.active").length==0)?null:$("#fl_mt_ty li.active");//经营类型
		      var dtlist= ($("#fl_dt_ty li.active").length==$("#fl_dt_ty li").length||$("#fl_dt_ty li.active").length==0)?null:$("#fl_dt_ty li.active");//商品存放形式
			  var telist= ($("#fl_te_ty li.active").length==$("#fl_te_ty li").length||$("#fl_te_ty li.active").length==0)?null:$("#fl_te_ty li.active");//冷库温度类型
			  var smlist= ($("#fl_sm_ty li.active").length==$("#fl_sm_ty li").length||$("#fl_sm_ty li.active").length==0)?null:$("#fl_sm_ty li.active");//冷库总面积
			  var bslist= ($("#fl_cr_ty li.active").length==$("#fl_cr_ty li").length||$("#fl_cr_ty li.active").length==0)?null:$("#fl_cr_ty li.active");//配备冷藏车辆情况:
		      var mtty=daty=tety=smty=bsty=null;
		      if(mtlist){mtty=[]; $.each(mtlist, function(i, vo){mtty.push($(vo).attr("value"));});mtty=mtty.join(",");}
		      if(dtlist){daty=[]; $.each(dtlist, function(i, vo){daty.push($(vo).attr("value"));});daty=daty.join(",");}
		      if(telist){tety=[]; $.each(telist, function(i, vo){tety.push($(vo).attr("value"));});tety=tety.join(",");}
		      if(smlist){smty=[]; $.each(smlist, function(i, vo){smty.push($(vo).attr("value"));});smty=smty.join(",");}
		      if(bslist){bsty=[]; $.each(bslist, function(i, vo){bsty.push($(vo).attr("value"));});bsty=bsty.join(",");}
		      var _options={
			   isKey:isKey,//true,主动搜索
               managementType    : mtty  ,//        经营类型
               storageType       : daty  ,//        存放类型
               storagetempertype : tety  ,//                   温度类型
               sqm               : smty  ,//      温度类型
               hasCar            :  bsty ,
               keyword:$scope.query,//支持关键字搜索-
               provinceid:$scope.provinceSelected//地区
			  };
			   var _filter={pageNum : pageNum,pageSize : pageSize};
			   jQuery.extend(_filter, _options);
			   return _filter;
	}

	 $scope.pageChanged = function (isKey) {
		 if(isKey){
			 if($("#txt_seachtxt").val().trim() == ""){
	    		 alert("请输入冷库关键字~")
			 }else{
				 var _filter=  getFilter($scope.bigCurrentPage,$scope.maxSize,isKey);
				   $.post("/i/rdc/getRDCList", _filter, function(data) {
				            $scope.$apply(function () {
				                $scope.rdcs = data.data;
				 			    $scope.bigTotalItems = data.total;
				            });
					});
			 }
		 }else{
			 var _filter=  getFilter($scope.bigCurrentPage,$scope.maxSize,isKey);
			   $.post("/i/rdc/getRDCList", _filter, function(data) {
			            $scope.$apply(function () {
			                $scope.rdcs = data.data;
			 			    $scope.bigTotalItems = data.total;
			            });
				});
		 }
   };
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    function addScore(rdc) {
        rdc.score = (Math.random() + 4).toFixed(1);
        rdc.userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
        rdc.userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
        return rdc;
    }
    $scope.goRdcMap = function () {
        $state.go('coldStorageMap', {});
    };
    $scope.goDetail = function (rdcID) {
            	 console.log("rdcID" + rdcID);
                 $state.go('coldStorageComment', {"rdcID": rdcID});
     };
    $scope.goAddRdc = function () {
        $http.get('/i/user/findUser').success(function(data){
            $rootScope.user = data;
            if($rootScope.user == null || $rootScope.user.id == 0){
                url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd";
                window.location.href = url;
            } else {
                $location.path("/coldStorageAdd");
            }
        });
    };

    $scope.goComment = function (rdcID) {
        $location.path("/coldStorage/" + rdcID + "/review");
    };

    function findHotRdcDTOList(){
        $http.get('/i/rdc/findHotRdcDTOList', {
            params: {
                "npoint":6
            }
        }).success(function (data) {
            var size = data.length;
            data.splice(6, size);
            $scope.hotrdcs = data;
        });
    }
    
    $scope.goHotBoard = function () {
        angular.element(document.getElementById('hotBoard')).removeClass('btn-default');
        angular.element(document.getElementById('hotBoard')).addClass('btn-success');
        angular.element(document.getElementById('scoreBoard')).removeClass('btn-success');
        angular.element(document.getElementById('scoreBoard')).addClass('btn-default');
        findHotRdcDTOList();
    };

    $scope.goScoreBoard = function () {
        angular.element(document.getElementById('scoreBoard')).removeClass('btn-default');
        angular.element(document.getElementById('scoreBoard')).addClass('btn-success');
        angular.element(document.getElementById('hotBoard')).removeClass('btn-success');
        angular.element(document.getElementById('hotBoard')).addClass('btn-default');
        $http.get('/i/rdc/findScoreRdcDTOList', {
            params: {
                "npoint":6
            }
        }).success(function (data) {
            $scope.hotrdcs = data;
        });
    };
    $scope.initpagedata=function(){
    	$scope.pageChanged();
    	initfilter();
    	$scope.goHotBoard();
    };
    $scope.initpagedata();
});

