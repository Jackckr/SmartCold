/**
 * 冷库列表
 */
$().ready(function() { 
	  maxSize=10;
      currentPage=  1;  // 当前页
      var isLoadRB=false;  
	  var is_more =true;
	  var btn_more=$("#loading");
	  var ul_select=$("#ul_rdcsL_list");
      gosharedile=function(sharid){
    	 window.location.href ="storehousedetail.html?id="+sharid; 
      };
      $(window).scroll(function(){
   		var _needload=needtoloadRB();
   		if(_needload && isLoadRB==false &&is_more){
   			isLoadRB=true;
   		    getPageData();
   		}
      });
      initevg=function(){
   		$(".droplist a").click(function(e){//条件过滤
   			$(this).children('i').addClass('current').html('&#xe62e;');
   			$(this).addClass('current').next('.listcontain').slideDown().parent().siblings().children('a').removeClass('current').children('i').removeClass('current').html('&#xe62d;').parent().siblings('.listcontain').hide();
   			$(".backDrop").show();
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
  		   $.post(ER.root+"/i/rdc/getRDCFilterData",function(data) {
  			   if(data.success){	
  					 var mtlist=[],stlist=[];
  					 var _mtty=data.entity.mt, _stty=data.entity.te;//经营类型,温度类型
  					 $.each(_mtty, function(i, vo){mtlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });
  					 $.each(_stty, function(i, vo){stlist.push("<li value='"+vo.id+"' >"+vo.type+"</li>"); });  
  					 $("#ul_mtty_list").append(mtlist.join("")); 
  					 $("#ul_stty_list").append(stlist.join("")); 
  					 $("#filter_section .listcontain li").click(function(event) {addfilter(this);});
  					 $(".backDrop").click(function(){
						$(".droplist a").removeClass('current').children('i').removeClass('current').html('&#xe62d;');
						$('.listcontain').hide();
						$(this).hide();
					})
  			   }
  	     });
  	 };
  	 getFilter=function(pageNum,pageSize){
  			var sqm =$("#ul_sqm_list li.active").attr("value");
  		    var smty=$("#ul_stty_list li.active").attr("value");
  			var sety=$("#ul_mtty_list li.active").attr("value");//经营类型
  		    var _options={ sqm:sqm, managetype: smty,storagetempertype:sety,datatype:3};
  		    var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
  		   return _filter;
  	};
  	function gethtml(rdc){
  		  var score=['<li class="imgCell" ng-repeat="rdc in rdcsList"><a href="colddetail.html?id='+rdc.id+'"><img class="fl" src="'+rdc.logo+'"><div><p class="ellipsis">'+rdc.name+'</p><p class="position"><i class="iconfont">&#xe66e;</i>'+rdc.address+'</p><ul class="star" value="'+rdc.score+'">'];
  		  for ( var i = 0; i < 5; i++) { score.push(i<=rdc.score&&i!=0?'<li class="filled">★</li>':"<li>★</li>"); }
  		  score.push('</ul></div></a><button class="grab" onclick="gosharedile('+rdc.id+');" >立即抢单</button></li>');
  		  return score.join("");
  	}
  	function getPageData(){//启用无限加载
  		 var _filter=  getFilter(currentPage,maxSize);
  		   $.post(ER.root+"/i/rdc/getRDCList", _filter, function(data) {	  
  	   	          if(data.success&&data.data.length>0){
  	   	         	  currentPage++;
  	   	        	  var   rdcsList = data.data;//
  	   	              $.each(rdcsList, function(index, item) { 
  	   	            	ul_select.append( gethtml(item));
  	   	              });
  	   	              $(".nodata").hide();
  	   	          }else{
  	   	         $(".nodata").show();
  	   	          }
  		    });
  	};
  	needtoloadRB=function(){
  		return $(window).scrollTop()<(btn_more.offset().top-jQuery(window).height());
  		/*
  		var s=btn_more.offset().top;
  		var btn_top=btn_more.scrollTop();
  		var window_height=$(window).height();
  		var scroll_Top=$(window).scrollTop();
  		var sl= btn_top<scroll_Top+window_height?true:false;
  		return sl;
  		*/
  	};
  	
  	getPageData();
  	initFilter();
  	initevg();
});	


	



