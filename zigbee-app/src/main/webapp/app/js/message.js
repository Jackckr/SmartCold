/**
 * 消息列表
 */
checkLogin();
$().ready(function() { 
	  var maxSize=10;
      var totalPages=  currentPage=  1;  // 当前页
      var isLoadRB=false;  
	  var ul_select=$("#ul_msgsL_list");
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

     function gethtml(msg){
   	  var news=['<li><a href="msgdetail.html?id='+msg.id+'"class="clearfix"><div class="imgFl fl"><img  src="'+news.coverpic+'"></div> <div class="newsTxt"><p class="newsTitle">'+news.title+'</p><p class="newsDate">'+news.posttime+'</p></div></a></li>'];
   	  return news.join("");
   }
  	function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		  $.post(ER.root+"/i/message/findMessageByUserId", {
               pageNum: currentPage,
               pageSize:maxSize,
               userID:window.user.id},  function(data) {	
  	   	          if(data.success&&data.data.length>0){
  	   	        	  totalPages=data.totalPages;
  	   	         	  currentPage++; var html=[];var   msgsList = data.data;//
  	   	              $.each(msgsList, function(index, item) {html.push( gethtml(item)); });
  	   	              ul_select.append(html.join(""));
  	   	              $(".nodata").hide();
  	   	          }else{
  	   	              $(".nodata").show();
  	   	          }
  	   	     isLoadRB=false;
  		    });
  	};
  	getPageData();
  	initevg();
});	
