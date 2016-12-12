/**
 * 消息列表
 */
checkLogin();
function updatestatus(id,url){
	  $.post(ER.root+"/i/message/updateMsgStaus", {ids:id,userID:window.user.id},  function(data) {});
	  window.location.href=url;
}

$().ready(function() { 
	  var maxSize=10,totalPages=-1 ,  currentPage=  1, isLoadRB=false,ul_select=$("#ul_msgsL_list");
      initevg=function(){
   	       $(window).scroll(function(){
     	     var scrollTop = $(this).scrollTop(), scrollHeight = $(document).height(), windowHeight = $(this).height();
	     	 if(scrollTop + windowHeight > scrollHeight-100){if(isLoadRB==false&&currentPage<=totalPages){getPageData();}};
	     });
     };
    
     function gethtml(msg){
      var title = "";
      if(msg.msgcategory==1){
    	   title = "订单通知";
    	   if(msg.url!=undefined&&msg.url!=""){
    	   }else  if(msg.oid!=undefined&&msg.oid!=0){
    		   msg.url = "orderdetail.html?id="+msg.oid;
    	   }else{
    		   msg.url = "user-myorder.html"; 
    	   }
      }
      else if(msg.msgcategory==2){
    	  title = "冷库360报警";
    	  if(msg.url==undefined||msg.url=="") 
    	      msg.url = "user-myorder.html";
      }
   	  var news=['<li class="messageList clearfix" onclick="updatestatus('+msg.id+',\''+msg.url+'\');" ><a href="#"><div class="messageImg fl"><i class="iconfont">&#xe7ec;</i></div> <div class="messageInfo"><p class="fr">',msg.informtime.substring(0,19),'</p><p class="newsTitle">',title,'</p><p class="newsTitle">',msg.msgdata,'</p></div></a></li>'];
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
  	   	              $('.body').show(); $(".nodata").hide();
  	   	          }else{
  	   	        	  $('.body').hide(); $(".nodata").show();
  	   	          }
  	   	     isLoadRB=false;
  		    });
  	};
  	getPageData();
  	initevg();
});	
