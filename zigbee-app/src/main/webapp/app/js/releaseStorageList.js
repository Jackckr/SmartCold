/**
 * 冷库列表
 */
//$.ajax({type: "GET",cache: false,dataType: 'json',url: ER.root +'/i/user/findUser'}).success(function(data,status,config,headers){
checkLogin();
//		 window.user = data;
         $().ready(function() { 
	  var maxSize=10;
      var totalPages=  currentPage=  1;  // 当前页
      var isLoadRB=false;  
	  var ul_select=$("#ul_rdcsL_list");
      gosharedile=function(sharid){
    	 window.location.href ="colddetail.html?id="+sharid; 
      };
      initevg=function(){
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
   	    $("#searchDara_div i").click(function(e){//搜索
   	    	currentPage=1;
 	  		ul_select.empty();
   	  	    getPageData();
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
  		   var mtlist=[],stlist=[],prove=[];
  		   $.get(ER.root+'/i/city/findProvinceList',function(data) {
				 $.each(data, function(i, vo){prove.push("<li value='"+vo.provinceId+"' >"+vo.provinceName+"</li>"); });
				 $("#ul_address_list").append(prove.join("")); 
				 $("#ul_address_list li").click(function(event) {addfilter(this);});
  		   });
  		   $.post(ER.root+"/i/rdc/getRDCFilterData",function(data) {
  			   if(data.success){	
  					 var _mtty=data.entity.mt, _stty=data.entity.te;//经营类型,温度类型
  					 $.each(_mtty, function(i, vo){mtlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });
  					 $.each(_stty, function(i, vo){stlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
  					 $("#ul_mtty_list").append(mtlist.join("")); 
  					 $("#ul_stty_list").append(stlist.join("")); 
  					 $("#ul_mtty_list li,#ul_stty_list li").click(function(event) {addfilter(this);});
  			   }
  	      });
  	 };
  	 getFilter=function(pageNum,pageSize){
  			var sqm =$("#ul_sqm_list li.active").attr("value");//面积
  		    var smty=$("#ul_stty_list li.active").attr("value");//温度
  			var sety=$("#ul_mtty_list li.active").attr("value");//经营类型
  			var adds=$("#ul_address_list li.active").attr("value");////地区
  			var keyword=$("#searchDara_div input").val();////关键字搜索
  		    var _options={ sqm:sqm, managetype: smty,storagetempertype:sety,provinceid:adds,keyword:keyword};
  		    var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
  		    return _filter;
  	};
  	function gethtml(rdc){
  		  var score=['<li class="imgCell" ><a href="releasestorage.html?id='+rdc.id+'"><img class="fl" src="'+rdc.logo+'"><div><p class="ellipsis">'+rdc.name+'</p><p class="position omg"><i class="iconfont">&#xe66e;</i>'+rdc.address+'</p><ul class="star" value="'+rdc.score+'">'];
  		  for ( var i = 0; i < 5; i++) { score.push(i<=rdc.score?'<li class="filled">★</li>':"<li>★</li>"); }
  		  score.push('</ul></div></a><button class="grab" onclick="gosharedile('+rdc.id+');" >详情</button></li>');
  		  return score.join("");
  	}
  	function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		   var _filter=  getFilter(currentPage,maxSize);
  		  $.post(ER.root+"/i/rdc/findRDCDTOByUserId", {
  			   userID: window.user.id,
               keyword:"",
               pageNum: currentPage,
               pageSize:maxSize}, _filter, function(data) {	
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
//})