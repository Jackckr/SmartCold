/**
 * 冷库列表
 */
$().ready(function() { 
	  var maxSize=10;
      var isLoadRB=false;  
      var rdcid=getUrlParam("rdcid");
	  var ul_select=$("#ul_rdcsL_list");
	  var type=totalPages=  currentPage=  1;  // 当前页
      gosharedile=function(sharid){
    	 window.location.href ="storehousedetail.html?id="+sharid; 
      };
      initevg=function(){
    	$("#tool_but button").click(function(e){
       		 type=this.value;
       		 currentPage=1;
       		 ul_select.empty();
       		 getPageData();
       	});
   		$(".droplist a").click(function(e){//条件过滤
   			$(this).children('i').addClass('current').html('&#xe62e;');
   			$(this).addClass('current').next('.listcontain').slideDown().parent().siblings().children('a').removeClass('current').children('i').removeClass('current').html('&#xe62d;').parent().siblings('.listcontain').hide();
   			$(".backDrop").show();
   		});
   	    $(".backDrop").click(function(){
			$(".droplist a").removeClass('current').children('i').removeClass('current').html('&#xe62d;');
			$('.listcontain').hide();
			$(this).hide();
		});
   	    $(window).scroll(function(){
     	    var scrollTop = $(this).scrollTop();
	     	var scrollHeight = $(document).height();
	     	var windowHeight = $(this).height();
	     	if(scrollTop + windowHeight > scrollHeight-30){
	     		if(isLoadRB==false&&currentPage<totalPages){
	     		   getPageData();
	     		}
	     	};
     	});
     };
      addfilter= function(em){
  		var $this = $(em).html();
  		$(em).addClass('active').siblings().removeClass('active').parent().parent().hide();
  		$(em).parent().parent().siblings('a').children('span').html($this);
  		$(".backDrop").hide();
  		$(em).parent().parent().siblings().removeClass('current').children('i').removeClass('current').html('&#xe62d;');
  		currentPage=1;
  		ul_select.empty();
  		getPageData();
  	 };
  	 initFilter=function(){
  		   var prove=[];
  		   $.get(ER.root+'/i/city/findProvinceList',function(data) {
				 $.each(data, function(i, vo){prove.push("<li value='"+vo.provinceId+"' >"+vo.provinceName+"</li>"); });
				 $("#ul_address_list").append(prove.join("")); 
				 $("#ul_address_list li").click(function(event) {addfilter(this);});
  		   });
  		  $.post(ER.root+"/i/ShareRdcController/getPSFilterData",function(data) {if(data.success){
			  var fmlist=[],cllist=[],sklist=[];
				 var _fmty=data.entity.fm, _clty=data.entity.cl, _skty=data.entity.sk;//业务类型,温度类型,车型
				 $.each(_fmty, function(i, vo){fmlist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"</li>"); });
				 $.each(_clty, function(i, vo){cllist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"</li>"); });  
				 $.each(_skty, function(i, vo){ sklist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
				 $("#car_type_div").append(sklist.join("")) ; //车型
				 $("#cool_type_div").append(cllist.join("")) ; //温度类型
				 $("#business_type_div").append(fmlist.join("")) ; //业务类型
				 $("#car_type_div li,#cool_type_div li,#business_type_div li").click(function(event) {addfilter(this);});
		
		   }});
  	 };
  	 getFilter=function(pageNum,pageSize){
  			var ctty =$("#car_type_div li.active").attr("value");//车型	
  		    var clty=$("#cool_type_div li.active").attr("value");//温度
  			var bsty=$("#business_type_div li.active").attr("value");//业务类型
  			var adds=$("#ul_address_list li.active").attr("value");////地区
  		    var _options={
					type:type,//类型
					datatype:2,//请求数据类型
					rdcID:rdcid,
					carType:ctty, //车型	
					provincefwID:adds,
					businessType: bsty,//业务类型 
					storagetempertype:clty//  温度类型 -> rdcext t
 
  		    };
  		    var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
  		    return _filter;
  	};
  	function gethtml(rdc){
  		  var score=['<li class="imgCell" ><a href="storehousedetail.html?id='+rdc.id+'"><img class="fl" src="'+rdc.logo+'"><div><p class="ellipsis">【'+rdc.typeText+"】"+rdc.title+'</p><p class="position omg">出发地：'+rdc.unit1+"　目的地:"+rdc.unit2+'</p><ul class="star" value="'+rdc.score+'">'];
  		 if(rdc.score==undefined){rdc.score=5;}
  		  for ( var i = 0; i < 5; i++) { score.push(i<=rdc.score?'<li class="filled">★</li>':"<li　class='filled'>★</li>"); }
  		  score.push('</ul></div></a><button class="grab" onclick="gosharedile('+rdc.id+');" >立即联系</button></li>');
  		  return score.join("");
  	}
  	function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		   var _filter=  getFilter(currentPage,maxSize);
  		   $.post(ER.root+"/i/ShareRdcController/getSEPSList", _filter, function(data) {	
  	   	          if(data.success&&data.data.length>0){
  	   	        	  totalPages=data.totalPages;
  	   	         	  currentPage++; var html=[];var   rdcsList = data.data;//
  	   	              $.each(rdcsList, function(index, item) {html.push( gethtml(item)); });
  	   	              ul_select.append(html.join(""));
  	   	              $(".nodata").hide();
  	   	          }else{
  	   	              $(".nodata").show();
  	   	          }
  	   	     isLoadRB=false;
  		    });
  	};
  	getPageData();
  	initFilter();
  	initevg();
});	