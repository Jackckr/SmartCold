/**
 * 消息列表
 */
checkLogin();
function updatestatus(id,url){ $.post(ER.root+"/i/message/updateMsgStaus", {ids:id,userID:window.user.id},  function(data) {}); window.location.href=url;}
$().ready(function() { 
      var mode={titl:["", "订单通知","冷库360报警"]};
	  var maxSize=10,totalPages=-1 ,  currentPage=  1, isLoadRB=false,ul_select=$("#ul_msgsL_list");
      initevg=function(){
   	       $(window).scroll(function(){
     	     var scrollTop = $(this).scrollTop(), scrollHeight = $(document).height(), windowHeight = $(this).height();
	     	 if(scrollTop + windowHeight > scrollHeight-100){if(isLoadRB==false&&currentPage<=totalPages){getPageData();}};
	     });
     };
     function gethtml(msg){
      if(msg.msgcategory==1){
    	   if(msg.url!=undefined&&msg.url!=""){
    	   }else  if(msg.oid!=undefined&&msg.oid!=0){
    		  msg.url = "orderdetail.html?id="+msg.oid;
    	   }else{  msg.url = "user-myorder.html";   }
      }
      else if(msg.msgcategory==2){
    	  if(msg.url==undefined||msg.url=="") {	      msg.url = "user-myorder.html";}
      }
   	  var news=['<li class="messageList clearfix"><div class="oDelete">删除</div><a onclick="updatestatus('+msg.id+',\''+msg.url+'\');"><div class="messageImg fl">',msg.isread==0?'<b class="redDot"></b>':"" ,'<i class="iconfont">&#xe7ec;</i></div> <div class="messageInfo"><p class="fr">',msg.informtime.substring(0,19),'</p><p class="newsTitle">',mode.titl[msg.msgcategory],'</p><p class="newsTitle omg">',msg.msgdata,'</p></div></a></li>'];
   	  return news.join("");
   }
  function getPageData(){//启用无限加载
  		   isLoadRB=true;
  		  $.post(ER.root+"/i/message/findMessageByUserId", {pageNum: currentPage, pageSize:maxSize, userID:window.user.id},  function(data) {	
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
var flag=true;
function deleteShow(ops) {
    if (flag) {
        $(ops).html("完成");
        $(".deleteAll,.oDelete").show();
        flag = false;
    } else {
        $(ops).html("编辑");
        $(".deleteAll,.oDelete").hide();
        flag = true;
    };
}
