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
      var title = "";
      if(msg.msgcategory==1){
    	   title = "订单通知";
      }
      else if(msg.msgcategory==2){
    	  title = "冷库360报警";
      }
   	  var news=['<li class="messageList clearfix"><a href="'+msg.url+'"><div class="messageImg fl"><img  src="message'+msg.msgcategory+'"></div> <div class="messageInfo"><p class="newsTitle">'+title+'</p><p class="newsTitle">'+msg.msgdata+'</p><p class="newsDate">'+msg.informtime+'</p></div></a></li>'];
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
