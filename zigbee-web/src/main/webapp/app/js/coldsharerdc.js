//当前页面配置信息o()
var rdcconfig={
	$scope:null,//上下文环境变量
	_cuttid:3,//当前选择类型	
	changMode:function(em){
			$("#tool_div li").removeClass("current");
			$(em).addClass("current");
			rdcconfig._cuttid=em.value;
			$("#table1,#table2,#table3").addClass("hide");
			$("#table"+em.value).removeClass("hide");
			rdcconfig.$scope.initApp();//初始化App
	},addfilter:function(id,em){
		 $($(id).parent()).prev().removeClass("active_rdc");
	      if(em.hasClass("active_rdc")){em.removeClass("active_rdc"); }else{ em.addClass("active_rdc");}
	      if( $(id+".active_rdc").length==0){//||$(id+".active_rdc").length==($(id).length-1)
	        $(id).removeClass("active_rdc");
	        $($(id).parent()).prev().addClass("active_rdc");
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
			  var gttyarr= $("#good_type_div li.active_rdc").length==$("#good_type_div li").length||$("#good_type_div li.active_rdc").length==0?null:$("#good_type_div li.active_rdc");
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
				     
					 $('#sl_lktype2').change(function(){ rdcconfig.$scope.changDataMode();});//出车、求车
					 $('#sl_provinceId2').change(function(){rdcconfig.$scope.changDataMode();});
					 $('#sl_cityid2').change(function(){rdcconfig.$scope.changDataMode();});
					 $('#sl_provinceId2_1').change(function(){rdcconfig.$scope.changDataMode();});
					 $('#sl_cityid2_2').change(function(){rdcconfig.$scope.changDataMode();});
			
			   }});
			   $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30, format: 'YYYY-MM-DD HH:mm'}, function(start, end, label) {
				  rdcconfig.$scope.changDataMode();
			   });
		}
		,getFilter:function(pageNum,pageSize){
				  var stentime=$("#reservationtime").val().split(" - ");
			      if(stentime.length!=2){ stentime=[null,null]; }
		    	  var ctlist= ($("#car_type_div li.active_rdc").length==$("#car_type_div li").length||$("#car_type_div li.active_rdc").length==0)?null:$("#car_type_div li.active_rdc");
			      var clist=($("#cool_type_div li.active_rdc").length==$("#cool_type_div li").length||$("#cool_type_div li.active_rdc").length==0)?null:$("#cool_type_div li.active_rdc");
				  var bslist=($("#business_type_div li.active_rdc").length==$("#business_type_div li").length||$("#business_type_div li.active_rdc").length==0)?null:$("#business_type_div li.active_rdc");
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
		   			stprovinceID:$("#sl_provinceId2").val(),//出发地1
		   			stcityID:$("#sl_cityid2").val(),//出发地2
		   			toprovinceID:$("#sl_provinceId2_1").val(),//目的地1
		   			tocityID:$("#sl_cityid2_2").val(),//目的地2
		   			validStartTime:stentime[0],//发货时间1
		   			validEndTime:stentime[1]//发货时间2
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
		  var sqmlist= ($("#sqm_div li.active_rdc").length==$("#sqm_div li").length||$("#sqm_div li.active_rdc").length==0)?null:$("#sqm_div li.active_rdc");
	      var setyList=($("#stfl_div li.active_rdc").length==$("#stfl_div li").length||$("#stfl_div li.active_rdc").length==0)?null:$("#stfl_div li.active_rdc");
		  var smtyList=($("#mtfl_div li.active_rdc").length==$("#mtfl_div li").length||$("#mtfl_div li.active_rdc").length==0)?null:$("#mtfl_div li.active_rdc");
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
var coldSharePage= coldWeb.controller('coldShareComment', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location) {
      $scope.maxSize = 10;	// 显示最大页数
      rdcconfig.$scope=$scope;
      rdcconfig._cuttid=$stateParams._cuttid?$stateParams._cuttid:rdcconfig._cuttid;//系统传参
//      $scope.bigTotalItems1=$scope.bigTotalItems2=$scope.bigTotalItems3 = 0; // 总条目数(默认每页十条)
//      $scope.bigCurrentPage1= $scope.bigCurrentPage2= $scope.bigCurrentPage3 = 1;  // 当前页
      $scope.page = {bigCurrentPage1:1,bigCurrentPage2:1,bigCurrentPage3:1,bigTotalItems1:0,bigTotalItems2:0,bigTotalItems3:0 };
      good._isLoad=psaction._isLoad=serdc._isLoad=false;
      $scope.appmode=[{title:["","货品","配送","冷库"]},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}];//1:货品 2：配送 3:仓库  
      $http.get('/i/city/findProvinceList').success(function (data) {
     	    $scope.gd_provinces = data;
     		$scope.stprovinceID =""; 
         	$scope.toprovinceID =""; 
         	$scope.changcity1();
         	$scope.changcity2();
     });//加载区域数据
	 $scope.changcity1 = function(id) {
		if($scope.stprovinceID!=""){
			$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.stprovinceID}  }).success(function(data) {$scope.city1 = data;}); 
		} else{
			$scope.city1 =null;
		}
	 };
	 $scope.changcity2 = function(id) {
		 if($scope.toprovinceID!=""){
		    $http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.toprovinceID}  }).success(function(data) {$scope.city2 = data;}); 
		 } else{
			$scope.city2 =null;
		}
	 };
     $("#myText1,#myText2,#myText3").bind("keyup", function(event) { if (event.keyCode == "13") { $scope.changDataMode(); } });//数据搜索事件
     $("#_sh_conner_div ._nonefilter" ).click(function(event) {  $(this).next().find("li").removeClass("active_rdc"); $(this).addClass("active_rdc");$scope.changDataMode();});//业务类型
     $scope.gosharedile=function(sharid){
    	
    		$scope.datatype=1;
    		$scope._dataid =sharid;//当前数据类型
    		$($scope._dataid?"#release_main":"#nodata_div").removeClass("hide");
    		if(!$scope._dataid){return;}
    		
    		
        	$http.get('/i/ShareRdcController/getSEByID', { params: {"id": $scope._dataid}  }).success(function(data) {
        		$scope.vo=null;
        		 $scope.vo=data.entity;
        		 $scope.dgfiles=data.entity.files;
        		 $scope.dgdatatype=data.entity.dataType;
        		 $scope.storageGallery = new Array();
	        		 $scope.storageGallery.length=0;
	        		 if($scope.dgfiles!=null&&$scope.dgfiles.length>0){
		                  for(var j=0; j<$scope.dgfiles.length; j++){
		                  	$scope.storageGallery.push({thumb:$scope.dgfiles[j] ,img:$scope.dgfiles[j]});
		                  }
		        	 }
        		 $("#shaerdailModal").modal('show');
        	}); 
//        	  $scope.$apply(function () { $("#dg_imglist").html('<ng-gallery images="storageGallery" thumbs-num="10" ></ng-gallery>'); });
	 };
	 $scope.getOrder=function () {  
		   $("#shaerdailModal").modal("hide");
		    $(".modal-backdrop").remove();
	    	if(user!="undefined"&&user.id!=0){
	    		if(user.telephone!=''&&user.telephone!=undefined){
	    	 $.ajax({ url: "/i/orders/generateOrder", data: {
	    		  userid:user.id,
	    		  username:user.username,
	    		  telephone:user.telephone,
	    		  address:user.address,
	    		  rsdid: $scope.vo.id,
	    		  dataType:$scope.vo.dataType,
	    		  typeText:$scope.vo.typeText,
	    		  releaseID:$scope.vo.releaseID,
	    		  title:$scope.vo.title
	    		  }, type: 'POST',dataType:"json", success: function(data) {
	    			  if(!data.success){
	    				  alert(data.message);
	    			  }
	    			  else{
	    				  $state.go('orderGenerate', {'data':data.entity});
	    			  }
	    	   }
	    	  }); 
	    	}
	    		else{
	    			alert("请留下手机号之后再下单");
	    		}
	    	}
	    	else{
	    		alert("登陆之后才可以抢单");
	    	}
       }; 
     $scope.changDataMode=function(){
    	 if(rdcconfig._cuttid==1){ $scope.pageChanged1(); }else if(rdcconfig._cuttid==2){$scope.pageChanged2();}else if(rdcconfig._cuttid==3){ $scope.pageChanged3(); }
     };
     $scope.pageChanged1 = function () {
		   var _filter=  good.getFilter($scope.page.bigCurrentPage1,$scope.maxSize);
		    $.post("/i/ShareRdcController/getSEGDList", _filter, function(data) {	  
	            $scope.$apply(function () {
	            	$scope.goods = data.data;//
			        $scope.page.bigTotalItems1 = data.total;
	             });
		    });
	   };
	  $scope.pageChanged2 = function () {
		   var _filter=  psaction.getFilter($scope.page.bigCurrentPage2,$scope.maxSize);
		   $.post("/i/ShareRdcController/getSEPSList", _filter, function(data) {	  
	           $scope.$apply(function () {
	              $scope.pslist = data.data;//
			      $scope.page.bigTotalItems2 = data.total;
	            });
		    });
	  };
	  $scope.pageChanged3 = function () {
		   var _filter=  serdc.getFilter($scope.page.bigCurrentPage3,$scope.maxSize);
		   $.post("/i/ShareRdcController/getSERDCList", _filter, function(data) {	  
	           $scope.$apply(function () {
	        	   $scope.rdcs = data.data;//
	   	           $scope.page.bigTotalItems3 = data.total;
	            });
		    });
	  };
	  $scope.goRelease=function(){
		  if(user!==null&&user.id!=0){
				  $state.go('releaseItemList',{_cuttid:rdcconfig._cuttid});
		  }else{
				util.info(null,"你还没有登录！请登录后操作！",function(){
		              window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#releaseItemList?_cuttid="+rdcconfig._cuttid;
				});
		  }
	 };
	 $scope.initApp=function(){
		 if(rdcconfig._cuttid==1){//getGDFilterData
			 if(!good._isLoad){
			   good._isLoad=true;
			   good.initFilter();//初始化过滤
			   $scope.pageChanged1();
			   $("#table1").removeClass("hide");
			   $("#tool_div li[value=1]").addClass("current");  
			 }
		 }else if(rdcconfig._cuttid==2){
			 if(!psaction._isLoad){
				 psaction._isLoad=true;
				 psaction.initFilter();//初始化过滤
				 $scope.pageChanged2();
				 $("#table2").removeClass("hide");
				 $("#tool_div li[value=2]").addClass("current");  
				}
		 }else if(rdcconfig._cuttid==3){
			  if(!serdc._isLoad){
				 serdc._isLoad=true;
			     serdc.initFilter();//初始化过滤
				 $scope.pageChanged3();
				 $("#table3").removeClass("hide");
				 $("#tool_div li[value=3]").addClass("current");  
			  }
		 }
	 };
	 $scope.initApp();
	
});