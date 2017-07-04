/**
 * 冷库列表
 */
$().ready(function() { 
	  var maxSize=10;
      var isLoadRB=false;  
      var rdcid=getUrlParam("rdcid");
	  var ul_select=$("#ul_goodlist_list");
	  var type=2, totalPages=  currentPage=  1;  // 当前页//rental_type:出租类型:1:出租 2:求租
      gosharedile=function(sharid){//共享详情
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
	     	if(scrollTop + windowHeight > scrollHeight-100){
	     		if(isLoadRB==false&&currentPage<=totalPages){
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
  			var keyword=$("#searchDara_div input").val().trim();////关键字搜索
  		    var _options={provinceid:adds, goodtype: gdty,typeCode:2,dataType:1,rdcID:rdcid,keyword:keyword};
  		    var _filter={pageNum : pageNum,pageSize : pageSize};jQuery.extend(_filter, _options);
  		    return _filter;
  	};
	getSoll=function(){
		var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
		localStorage.list_cache_goodlist=JSON.stringify({totalPages:totalPages,currentPage:currentPage,html:$("#ul_goodlist_list").html(),scrollHeight:scrollHeight});
	};
  	function gethtml(rdc){
        var oStart=new Date(rdc.validStartTime).getTime(),oEnd=new Date(rdc.validEndTime).getTime(),today=new Date().getTime();
        var deadline=oEnd-oStart;
        var days    = deadline / 1000 / 60 / 60 / 24;
        var daysRound   = Math.floor(days);//租期
        var hours    = deadline/ 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound   = Math.floor(hours);
        var minutes   = deadline / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound  = Math.floor(minutes);
        var seconds   = deadline/ 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        var showDate=Math.floor((today-oStart)/ 1000 / 60 / 60 / 24);
        var showTime=null;
        if(showDate>=30){
            showTime=Math.floor(showDate/30)+'个月前发布';
        }else{
            if(showDate>1){
                showTime=showDate+'天前发布';
            }else{
                showTime='刚刚发布';
            }
        }
        if(rdc.username==undefined){
            rdc.username=rdc.id
        }
        var collectWords='<a class="fr noCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
        if(rdc.collectUserIds && window.user){
            for(var i=0;i<rdc.collectUserIds.length;i++){
                if(rdc.collectUserIds[i]==window.user.id){
                    collectWords='<a class="fr hasCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
                }
            }
        }
        var score = [
            '<li class="imgCell"><a href="storehousedetail.html?id=' + rdc.id + '" onclick="getSoll()"><span>求购货源</span><div>'+
            '<p class="ellipsis">'+rdc.title+'</p><p class="position omg orange"><i class="iconfont">&#xe673;</i>'+rdc.sqm+'吨</p><span class="grab green">['+showTime+']</span>'+
            '</div><div class="flex"><div class="item"><h4>'+daysRound+'天</h4>'+
            '<p>有效期</p></div><div class="item"><h4>'+rdc.validEndTime+'</h4><p>报价截止日</p>'+
            '</div><div class="item"><h4 class="omg">'+rdc.username+'</h4><p>发布者</p></div></div></a>' +
			'<div class="btnFn clearfix"><a href="storehousedetail.html?id='+rdc.id+'" class="fl"><i class="iconfont">&#xe65b;</i>查看</a>'+
            collectWords+'<a class="fr"><i class="iconfont">&#xe66c;</i>咨询</a></div></li>'
        ];
  		  return score.join("");
  	}
    collect=function(ops,id) {
        if(!(window.user && window.user.id!=0)){
            layer.open({content: "请登入后收藏！", btn: '确定'});
            return;
        }
        var em = $(ops);
        if(em.hasClass('noCollect')){
            $.post(ER.root+"/i/collect/addCollectRdc",{uid:window.user.id,collectId:id,collectType:2},function (data) {

            });
            em.removeClass('noCollect').addClass('hasCollect');
            em.children('i').html('&#xe60c;');
            em.children('em').html('已收藏');
        }else{
            $.post(ER.root+"/i/collect/delCollectById",{uid:window.user.id,collectId:id,collectType:2},function (data) {

            });
            em.addClass('noCollect').removeClass('hasCollect');
            em.children('i').html('&#xe605;');
            em.children('em').html('收藏');
        }
    };
  	function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		   var _filter=  getFilter(currentPage,maxSize);
  		   $.post(ER.root+"/i/ShareRdcController/newGetSERDCList", _filter, function(data) {
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
	function initData(){//启用无限加载
		if(localStorage.list_cache_goodlist){
			var  cachdata=JSON.parse(localStorage.list_cache_goodlist);
			totalPages=parseInt(cachdata.totalPages);
			currentPage= parseInt(cachdata.currentPage);
			$("#ul_goodlist_list").html(cachdata.html);
			$(document).scrollTop(	cachdata.scrollHeight );
		}else{
			getPageData();
		}
		initFilter();
		initevg();

	};
	searchFilter = function(){//搜索
   		if($("#searchDara_div input").val().trim() != ""){
   			currentPage=1;
    		ul_select.empty();
    		getPageData();
    	}
    };
    searchFilters = function(){//搜索
    	if($("#searchDara_div input").val().trim() == ""){
    		alert("请输入你要搜索的内容~")
    	}else{
    		currentPage=1;
    		ul_select.empty();
    		getPageData();
    	}
    };
    $(window).scroll(function(){
 	    var scrollTop = $(this).scrollTop();
     	var scrollHeight = $(document).height();
     	var windowHeight = $(this).height();
     	if(scrollTop + windowHeight > scrollHeight-100){
     		if(isLoadRB==false&&currentPage<totalPages+1){
     		   getPageData();
     		}
     	};
 	});
	initData();
});	