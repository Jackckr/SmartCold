/**
 * 消息列表
 */
checkLogin();
var app = angular.module('app', []);
app.controller('ctrl', function($http, $location,$scope) {
	 $scope.msgTotalNum = window.msgTotalNum;
});
$().ready(function() { 
	  var maxSize=10;
      var totalPages=-1 ,  currentPage=  1;  // 当前页
      var isLoadRB=false;  
	  var ul_select=$("#ul_msgsL_list");
      initevg=function(){
   	    $(window).scroll(function(){
     	    var scrollTop = $(this).scrollTop();
	     	var scrollHeight = $(document).height();
	     	var windowHeight = $(this).height();
	     	if(scrollTop + windowHeight > scrollHeight-30){
	     		if(isLoadRB==false&&currentPage<=totalPages){
	     		   getPageData();
	     		}
	     	};
     	});
     };

     function gethtml(msg){
      var title = "";
      if(msg.msgcategory==1){
    	   title = "订单通知";
    	   if(msg.url==undefined||msg.url=="")
    	      msg.url = "user-myorder.html";
      }
      else if(msg.msgcategory==2){
    	  title = "冷库360报警";
    	  if(msg.url==undefined||msg.url=="") 
    	      msg.url = "user-myorder.html";
      }
   	  var news=['<li class="messageList clearfix"><a href="'+msg.url+'"><div class="messageImg fl"><img  src="../com/img/message'+msg.msgcategory+'.png"></div> <div class="messageInfo"><p class="fr">'+msg.informtime+'</p><p class="newsTitle">'+title+'</p><p class="newsTitle">'+msg.msgdata+'</p></div></a></li>'];
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
  	   	              $('.body').show();
  	   	              $(".nodata").hide();
  	   	          }else{
  	   	        	  $('.body').hide();
  	   	              $(".nodata").show();
  	   	          }
  	   	     isLoadRB=false;
  		    });
  	};
  	getPageData();
  	initevg();
});	
