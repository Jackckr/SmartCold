/**
 * 冷库列表
 */
$().ready(function() { 
	  var maxSize=10;
      var isLoadRB=false;  
	  var ul_select=$("#ul_goodlist_list");
	  var type=1, totalPages=  currentPage=  1;  // 当前页//rental_type:出租类型:1:出租 2:求租
      gosharedile=function(sharid){//共享详情
    	 window.location.href ="colddetail.html?id="+sharid; 
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
  		   var gdlist=[],prove=[];
  		   $.get(ER.root+'/i/city/findProvinceList',function(data) {
				 $.each(data, function(i, vo){prove.push("<li value='"+vo.provinceId+"' >"+vo.provinceName+"</li>"); });
				 $("#ul_hascar_list").append(prove.join("")); 
				 $("#ul_hascar_list li").click(function(event) {addfilter(this);});
  		   });
  		   $.post(ER.root+"/i/ShareRdcController/getGDFilterData",function(data) {
  			   if(data.success){	
  				var _gdty=data.entity.gt;//经营类型,温度类型
  				 $.each(_gdty, function(i, vo){gdlist.push("<li value='"+vo.type_code+"' >"+vo.type_name+"/"+vo.type_desc+"</li>"); });
  				 $("#ul_goodtype_list").append(gdlist.join("")) ; 
  				 $("#ul_goodtype_list li").click(function(event) {addfilter(this);});
  			   }
  	      });
  	 };
  	 getFilter=function(pageNum,pageSize){
  		    var adds=$("#ul_hascar_list li.active").attr("value");////地区
  			var gdty=$("#ul_goodtype_list li.active").attr("value");//商品类型
  		    var _options={provinceid:adds, goodtype: gdty,type:type,datatype:1};
  		    var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
  		    return _filter;
  	};
  	function gethtml(rdc){
  		  var score=['<li class="imgCell" ><a href="storehousedetail.html?id='+rdc.id+'"><img class="fl" src="'+rdc.logo+'"><div><p class="ellipsis">【'+rdc.typeText+"】"+rdc.title+'</p><p class="position omg"><i class="iconfont">&#xe66e;</i>'+rdc.detlAddress+'</p><ul class="star" value="'+rdc.score+'">'];
  		  for ( var i = 0; i < 5; i++) { score.push(i<=rdc.score&&i!=0?'<li class="filled">★</li>':"<li class='filled'>★</li>"); }
  		  score.push('</ul></div></a><button class="grab" onclick="gosharedile('+rdc.id+');" >详情</button></li>');
  		  return score.join("");
  	}
  	function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		   var _filter=  getFilter(currentPage,maxSize);
  		   $.post(ER.root+"/i/ShareRdcController/getSEGDList", _filter, function(data) {	
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