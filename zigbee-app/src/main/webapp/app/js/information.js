
/**
 * 冷库列表
 */
var cundex=0,maxSize=10, isLoadRB=false;  
var lilist=[{categoryID:1},{categoryID:2},{categoryID:3}];
var pageinf=[{totalPages:-1,currentPage:1},{totalPages:-1,currentPage:1},{totalPages:-1,currentPage:1}];
function gethtml(news){
	var news=['<li><a href="newsdetail.html?id='+news.id+'"class="clearfix"><div class="imgFl fl" style="background:#eee url('+news.coverpic+') center no-repeat;background-size:cover;"></div> <div class="newsTxt"><p class="newsTitle">'+news.title+'</p><p class="newsDate">'+news.posttime+'</p></div></a></li>'];
	//  var news=['<li><a href="newsdetail.html?id='+news.id+'"class="clearfix"><div class="imgFl fl"><img  src="'+news.coverpic+'"></div> <div class="newsTxt"><p class="newsTitle">'+news.title+'</p><p class="newsDate">'+news.posttime+'</p></div></a></li>'];
	  return news.join("");
}
function getPageData(){//启用无限加载
	  isLoadRB=true;
	  $.post(ER.root+"/i/information/findInformationsByCate", {
         pageNum: pageinf[cundex].currentPage,pageSize:maxSize,
         categoryID:lilist[cundex].categoryID},  function(data) {	
      	   newsList = data;
      	   if(data.success&&data.data.length>0){
      		   pageinf[cundex].totalPages=data.totalPages;
      		   var html=[];var   newsList = data.data;//
	   	              $.each(newsList, function(index, item) {html.push( gethtml(item)); });
	   	              $("#ul_newsL_list"+lilist[cundex].categoryID).append(html.join(""));
	   	       	      $(".nodata").hide();
	   	          }else{
	   	               pageinf[cundex].totalPages=0;
	   	               $(".nodata").show();
	   	          }
            	 $(".tempWrap").css("height",$("#ul_newsL_list"+(cundex+1)).height());
	   	         isLoadRB=false;
		    });
};
function changmode(i){
	cundex=i;
	var bd = document.getElementById("tabBox1-bd");
	bd.parentNode.style.height = bd.children[i].children[0].offsetHeight+"px";
	bd.parentNode.style.transition="200ms";//添加动画效果
	if(pageinf[cundex].totalPages==-1){
		getPageData();
	}else{
		if(pageinf[cundex].totalPages==0){
			$(".nodata").show();
			// $(".tempWrap").css("height",$("#ul_newsL_list"+(cundex+1)).height());
		}else{
			$(".nodata").hide();
		}
	}
}
initevg=function(){
    $(window).scroll(function(){
    var scrollTop = $(this).scrollTop();
   	var scrollHeight = $(document).height();
   	var windowHeight = $(this).height();
   	if(scrollTop + windowHeight > scrollHeight-100){
   		if(isLoadRB==false&&pageinf[cundex].currentPage<   pageinf[cundex].totalPages){
   			pageinf[cundex].currentPage++; 
   		   getPageData();
   		}
   	};
	});
};
$().ready(function() { 
  	initevg();
});	

