//当前页面配置信息o()
var rdcconfig={
	$scope:null,//上下文环境变量
	_cuttid:1,//当前选择类型	
	changMode:function(em){
			$("#tool_div li").removeClass("current");
			$(em).addClass("current");
			rdcconfig._cuttid=em.value;
			$("#table1,#table2,#table3").addClass("hide");
			$("#table"+em.value).removeClass("hide");
			rdcconfig.$scope.initApp();//初始化App
	},addfilter:function(id,em){
		 $($(id).parent()).prev().removeClass("active");
	      if(em.hasClass("active")){em.removeClass("active"); }else{ em.addClass("active");}
	      if( $(id+".active").length==0){//||$(id+".active").length==($(id).length-1)
	        $(id).removeClass("active");
	        $($(id).parent()).prev().addClass("active");
	      }
	      rdcconfig.$scope.changDataMode();   //通知组件刷新数据
	   }
};
//商品信息
var good={
	_isLoad:false,	
	initFilter:function(){
		   $.post("/i/ShareRdcController/getGDFilterData",function(data) {if(data.success){
			 var gdlist=[], _gdty=data.entity.gt;//经营类型,温度类型
			 $.each(_gdty, function(i, vo){gdlist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"/"+vo.type_desc+"</li>"); });
			 $("#good_type_div ul").append(gdlist.join("")) ; 
			 $("#good_type_div li").click(function(event) {rdcconfig.addfilter("#good_type_div li",$(this));});//
			 $('#sl_lktype1').change(function(){rdcconfig.$scope.changDataMode();});
			 $('#sl_provinceid1').change(function(){rdcconfig.$scope.changDataMode();});
			
		  }});
	}
	,getFilter:function(pageNum,pageSize){
			  var gttyarr= $("#good_type_div li.active").length==$("#good_type_div li").length||$("#good_type_div li.active").length==0?null:$("#good_type_div li.active");
		      var gdty=null;
		      if(gttyarr){gdty=[];  $.each(gttyarr, function(i, vo){gdty.push(vo.value);});gdty=gdty.join(","); }
			  var _options={
			    goodtype: gdty,//品类  
			    datatype:rdcconfig._cuttid,
	       		type:$("#sl_lktype1").val(),//出租、出售类型
	   			keyword:  $("#myText1").val(),//支持关键字搜索-
	       		provinceid:$("#sl_provinceid1").val()//区域
			  };
			   var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
			   return _filter;
			}
};
/**
 * 配送
 */
var psaction={
		_isLoad:false,	
		initFilter:function(){
			  $.post("/i/ShareRdcController/getPSFilterData",function(data) {if(data.success){
				  var fmlist=[],cllist=[],sklist=[];
					 var _fmty=data.entity.fm, _clty=data.entity.cl, _skty=data.entity.sk;//业务类型,温度类型,车型
					 $.each(_fmty, function(i, vo){fmlist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"</li>"); });
					 $.each(_clty, function(i, vo){cllist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"</li>"); });  
					 $.each(_skty, function(i, vo){ sklist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
					 $("#car_type_div ul").append(sklist.join("")) ; 
					 $("#cool_type_div ul").append(cllist.join("")) ; 
					 $("#business_type_div ul").append(fmlist.join("")) ; 
					 $("#car_type_div li").click(function(event) {rdcconfig.addfilter("#car_type_div li",$(this));});//车型
					 $("#cool_type_div li").click(function(event) {rdcconfig.addfilter("#cool_type_div li",$(this));});//温度类型
				     $("#business_type_div li" ).click(function(event) {rdcconfig.addfilter("#business_type_div li",$(this));});//业务类型
					 $('#sl_lktype2').change(function(){ rdcconfig.$scope.changDataMode();});
					 $('#sl_origin').change(function(){rdcconfig.$scope.changDataMode();});
					 $('#sl_destination').change(function(){rdcconfig.$scope.changDataMode();});
					 $('#sl_deliverytime').change(function(){rdcconfig.$scope.changDataMode();});
			   }});
			  $('#reservationtime').daterangepicker({
			      timePicker: true,
			      timePickerIncrement: 30,
			      format: 'YYYY/DD/MM H:mm'
			    }, function(start, end, label) {
			      //console.log(start.toISOString(), end.toISOString(), label);
			    });
		}
		,getFilter:function(pageNum,pageSize){
		    	  var ctlist= ($("#car_type_div li.active").length==$("#car_type_div li").length||$("#car_type_div li.active").length==0)?null:$("#car_type_div li.active");
			      var clist=($("#cool_type_div li.active").length==$("#cool_type_div li").length||$("#cool_type_div li.active").length==0)?null:$("#cool_type_div li.active");
				  var bslist=($("#business_type_div li.active").length==$("#business_type_div li").length||$("#business_type_div li.active").length==0)?null:$("#business_type_div li.active");
			      var bsty=null,clty=null,ctty=null;
			      if(bslist){bsty=[];  $.each(bslist, function(i, vo){bsty.push(vo.value);});bsty=bsty.join(","); }
			      if(clist){clty=[];  $.each(clist, function(i, vo){clty.push(vo.value);});clty=clty.join(","); }
			      if(ctlist){ctty=[]; $.each(ctlist, function(i, vo){ctty.push( $(vo).attr("value"));}); ctty=ctty.join(",");}
				  var _options={
				    carType:ctty, //车型
				    businessType: bsty,//业务类型  
					storagetempertype:clty,//  温度类型 -> rdcext t
					datatype:rdcconfig._cuttid,//请求数据类型
		       		type:$("#sl_lktype2").val(),//类型
		   			keyword:$("#myText2").val(),//支持关键字搜索-
		   			origintion:$("#sl_origintion").val(),//出发地
		   			destination:$("#sl_destination").val(),//目的地
		   			deliverytime:$("#sl_deliverytime").val(),//发货时间
				  };
				   var _filter={pageNum : pageNum,pageSize : pageSize};
				   jQuery.extend(_filter, _options);
				   return _filter;
				}
};
//仓库信息
var serdc = {
		_isLoad:false,
		initFilter:function(){
			   $.post("/i/ShareRdcController/getSEFilterData",function(data) {if(data.success){
				 var mtlist=[],stlist=[];
				 var _mtty=data.entity.mt, _stty=data.entity.st;//经营类型,温度类型
				 $.each(_mtty, function(i, vo){mtlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });
				 $.each(_stty, function(i, vo){stlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
				 $("#mtfl_div ul").append(mtlist.join("")) ; 
				 $("#stfl_div ul").append(stlist.join("")) ; 
			     $("#sqm_div li" ).click(function(event) {rdcconfig.addfilter("#sqm_div li",$(this));});//面积
			     $("#mtfl_div li").click(function(event) {rdcconfig.addfilter("#mtfl_div li",$(this));});//经营类型
			     $("#stfl_div li").click(function(event) {rdcconfig.addfilter("#stfl_div li",$(this));});//温度类型
			     $('#sl_lktype3').change(function(){rdcconfig.$scope.changDataMode();});
				 $('#sl_provinceid3').change(function(){rdcconfig.$scope.changDataMode();});
			   }});
		},
		getFilter:function(pageNum,pageSize){
		  var sqmlist= ($("#sqm_div li.active").length==$("#sqm_div li").length||$("#sqm_div li.active").length==0)?null:$("#sqm_div li.active");
	      var setyList=($("#stfl_div li.active").length==$("#stfl_div li").length||$("#stfl_div li.active").length==0)?null:$("#stfl_div li.active");
		  var smtyList=($("#mtfl_div li.active").length==$("#mtfl_div li").length||$("#mtfl_div li.active").length==0)?null:$("#mtfl_div li.active");
	      var smty=null,sety=null,sqm=null;
	      if(smtyList){smty=[];  $.each(smtyList, function(i, vo){smty.push(vo.value);});smty=smty.join(","); }
	      if(setyList){sety=[];  $.each(setyList, function(i, vo){sety.push(vo.value);});sety=sety.join(","); }
	      if(sqmlist){sqm=[]; $.each(sqmlist, function(i, vo){sqm.push( $(vo).attr("value"));}); sqm=sqm.join(",");}
		  var _options={
		    sqm:sqm, //面积
		    datatype:rdcconfig._cuttid,
			managetype: smty,//经营类型  
			storagetempertype:sety,//  温度类型 -> rdcext t
       		type:$("#sl_lktype3").val(),//类型
   			keyword:  $("#myText3").val(),//支持关键字搜索-
       		provinceid:$("#sl_provinceid3").val()//区域
		  };
		   var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
		   return _filter;
		}
 };	
var coldSharePage= coldWeb.controller('coldShareComment', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	rdcconfig.$scope=$scope;
	 rdcconfig._cuttid=1;
     $scope.maxSize = 5;	// 显示最大页数
     $scope.bigTotalItems1=$scope.bigTotalItems2=$scope.bigTotalItems3 = 0; // 总条目数(默认每页十条)
     $scope.bigCurrentPage1= $scope.bigCurrentPage2= $scope.bigCurrentPage3 = 1;  // 当前页
     good._isLoad=psaction._isLoad=serdc._isLoad=false;
     $http.get('/i/city/findProvinceList').success(function (data) { $scope.gd_provinces = data; });//加载区域数据
     $("#myText1,#myText2,#myText3").bind("keyup", function(event) { if (event.keyCode == "13") { $scope.changDataMode(); } });//数据搜索事件
     $("#_sh_conner_div ._nonefilter" ).click(function(event) {  $(this).next().find("li").removeClass("active"); $(this).addClass("active");$scope.changDataMode();});//业务类型
     $scope.changDataMode=function(){
    	 if(rdcconfig._cuttid==1){ $scope.pageChanged1(); }else if(rdcconfig._cuttid==2){$scope.pageChanged2();}else if(rdcconfig._cuttid==3){ $scope.pageChanged3(); }
     };
     $scope.pageChanged1 = function () {
		   var _filter=  good.getFilter($scope.bigCurrentPage1,$scope.maxSize);
		   $http({method:'POST',url:'/i/ShareRdcController/getSEGDList',params:_filter}).success(function (data) {
				$scope.goods = data.data;//
		        $scope.bigTotalItems1 = data.total;
		    });
	   };
	  $scope.pageChanged2 = function () {
	   var _filter=  psaction.getFilter($scope.bigCurrentPage2,$scope.maxSize);
	   $http({method:'POST',url:'/i/ShareRdcController/getSEPSList',params:_filter}).success(function (data) {
		   $scope.pslist = data.data;//
		   $scope.bigTotalItems2 = data.total;
	   });
	  };
	  $scope.pageChanged3 = function () {
	   var _filter=  serdc.getFilter($scope.bigCurrentPage3,$scope.maxSize);
	   $http({method:'POST',url:'/i/ShareRdcController/getSERDCList',params:_filter}).success(function (data) {
			$scope.rdcs = data.data;//
	        $scope.bigTotalItems3 = data.total;
	    });
	  };
	  $scope.goRelease=function(){
		  if(user!==null&&user.id!=0){
			  if(rdcconfig._cuttid==2){
				  $state.go('releaseCarInfo',{_cuttid:rdcconfig._cuttid});
			  }else{
				  $state.go('releaseItemList',{_cuttid:rdcconfig._cuttid});
			  }
		  }else{
			  alert("你还没有登录！请登录后操作！");
              window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList?_cuttid="+rdcconfig._cuttid;
		  }
	  };
	 $scope.initApp=function(){
		 if(rdcconfig._cuttid==1){//getGDFilterData
			 if(!good._isLoad){
			   good._isLoad=true;
			   good.initFilter();//初始化过滤
			   $scope.pageChanged1();
			 }
		 }else if(rdcconfig._cuttid==2){
			 if(!psaction._isLoad){
				 psaction._isLoad=true;
				 psaction.initFilter();//初始化过滤
				 $scope.pageChanged2();
				 }
		 }else if(rdcconfig._cuttid==3){
			  if(!serdc._isLoad){
				 serdc._isLoad=true;
			     serdc.initFilter();//初始化过滤
				 $scope.pageChanged3();
			  }
		 }
	 };
	 $scope.initApp();
	
});