	 var serdc = {
			    initevg:function(){
			      $("#sqm_div li").click(function(event) {serdc.addfilter("#sqm_div li",$(this));});//面积
			      $("#mtfl_div li").click(function(event) {serdc.addfilter("#mtfl_div li",$(this));});//经营类型
			      $("#stfl_div li").click(function(event) {serdc.addfilter("#stfl_div li",$(this));});//温度类型
			      $("#myText").bind("keyup", function(event) { if (event.keyCode == "13") {serdc.getData();} });//数据搜索事件
			    },
			    addfilter:function(id,em){
			      $(id+":first").removeClass("active");
			      if(em.hasClass("active")){
			        em.removeClass("active"); 
			       }else{
			        em.addClass("active");
			       }
			      if(em.attr("value")==""|| $(id+".active").length==0){//||$(id+".active").length==($(id).length-1)
			        $(id).removeClass("active");
			        $(id+":first").addClass("active");
			      }
			    },
				initFilter:function(){
//				  $("#sl_provinceid").lk_selectbox(selectbox_config[0]);
				   $.post("/i/ShareRdcController/getSEFilterData",function(data) {if(data.success){
					 var mtlist=[],stlist=[];
					 var _mtty=data.entity.mt, _stty=data.entity.st;//经营类型,温度类型
					 $.each(_mtty, function(i, vo){mtlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });
					 $.each(_stty, function(i, vo){stlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
					 $("#mtfl_div ul").append(mtlist.join("")) ; 
					 $("#stfl_div ul").append(stlist.join("")) ; 
					  serdc.initevg();//初始化事件
				    }});
				},
				getData:function(pageNum,pageSize){
				  var sqmlist= ($("#sqm_div li.active").length==$("#sqm_div li").length-1||$("#sqm_div li:first.active").length==1)?null:$("#sqm_div li.active");
			      var setyList=($("#stfl_div li.active").length==$("#stfl_div li").length-1||$("#stfl_div li:first.active").length==1)?null:$("#stfl_div li.active");
				  var smtyList=($("#mtfl_div li.active").length==$("#mtfl_div li").length-1||$("#mtfl_div li:first.active").length==1)?null:$("#mtfl_div li.active");
			      var smty=null,sety=null,sqm=null;
			      if(smtyList){smty=[];  $.each(smtyList, function(i, vo){smty.push(vo.value);});smty=smty.join(","); }
			      if(setyList){sety=[];  $.each(setyList, function(i, vo){sety.push(vo.value);});sety=sety.join(","); }
			      if(sqmlist){sqm=[]; $.each(sqmlist, function(i, vo){sqm.push( $(vo).attr("value"));}); sqm=sqm.join(",");}
				  var _options={
				    sqm:sqm, //面积
					managetype: smty,//经营类型  
					storagetempertype:sety,//  温度类型 -> rdcext t
		       		type:$("#sl_lktype").val(),//类型
		   			keyword:  $("#myText").val(),//支持关键字搜索-
		       		provinceid:$("#sl_provinceid").val()//区域
				  };
				   var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
					$.post("/i/ShareRdcController/getSERDCList",_filter,function(data) {if(data.success){
						//	debugger;
					}});
					// debugger;
					//            $.ajax({ type: 'POST', data: _filter,DataType: "json",url: "/i/ShareRdcController/getSERDCList",success: function(data) {
								        	
					// 			}});
				}
			 };	
coldWeb.controller('coldShareComment', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	   serdc.initFilter();//初始化过滤
	   $http.get('/i/city/findProvinceList').success(function (data) { $scope.provinces = data; });
});



