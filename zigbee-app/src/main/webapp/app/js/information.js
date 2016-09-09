
/**
 * 冷库列表
 */
$().ready(function() { 
	  var maxSize=10;
      var totalPages=  currentPage=  1;  // 当前页
      var isLoadRB=false;  
	  var ul_select1=$("#ul_newsL_list1");
	  var ul_select2=$("#ul_newsL_list2");
	  var ul_select3=$("#ul_newsL_list3");
      initevg=function(){
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

  	function gethtml(news){
  		  var news=['<li><a href="newsdetail.html?id='+news.id+'"class="clearfix"><div class="imgFl fl"><img  src="'+news.coverpic+'"></div> <div class="newsTxt"><p class="newsTitle">'+news.title+'</p><p class="newsDate">'+news.posttime+'</p></div></a></li>'];
  		  return news.join("");
  	}
  	function getPageData1(){//启用无限加载
  		   isLoadRB=true;
  		  $.post(ER.root+"/i/information/findInformationsByCate", {
               pageNum: currentPage,
               pageSize:maxSize,
               categoryID:1},  function(data) {	
            	   newsList = data;
            	   if(data.success&&data.data.length>0){
   	   	        	  totalPages=data.totalPages;
   	   	         	  currentPage++; var html=[];var   newsList = data.data;//
   	   	              $.each(newsList, function(index, item) {html.push( gethtml(item)); });
   	   	              ul_select1.append(html.join(""));
//   	   	              $(".nodata").hide();
   	   	          }else{
//   	   	              $(".nodata").show();
   	   	          }
   	   	     isLoadRB=false;
   		    });
  	};
  	function getPageData2(){//启用无限加载
		   isLoadRB=true;
		  $.post(ER.root+"/i/information/findInformationsByCate", {
            pageNum: currentPage,
            pageSize:maxSize,
            categoryID:2},  function(data) {	
         	   newsList = data;
         	   if(data.success&&data.data.length>0){
	   	        	  totalPages=data.totalPages;
	   	         	  currentPage++; var html=[];var   newsList = data.data;//
	   	              $.each(newsList, function(index, item) {html.push( gethtml(item)); });
	   	              ul_select2.append(html.join(""));
//	   	              $(".nodata").hide();
	   	          }else{
//	   	              $(".nodata").show();
	   	          }
	   	     isLoadRB=false;
		    });
	};
	function getPageData3(){//启用无限加载
		   isLoadRB=true;
		  $.post(ER.root+"/i/information/findInformationsByCate", {
            pageNum: currentPage,
            pageSize:maxSize,
            categoryID:3},  function(data) {	
         	   newsList = data;
         	   if(data.success&&data.data.length>0){
	   	        	  totalPages=data.totalPages;
	   	         	  currentPage++; var html=[];var   newsList = data.data;//
	   	              $.each(newsList, function(index, item) {html.push( gethtml(item)); });
	   	              ul_select3.append(html.join(""));
//	   	              $(".nodata").hide();
	   	          }else{
//	   	              $(".nodata").show();
	   	          }
	   	     isLoadRB=false;
		    });
	};
  	getPageData1();
  	getPageData2();
  	getPageData3();
  	initevg();
});	