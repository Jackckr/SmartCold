$(function() {
	$.ajax({ url: ER.root+"/i/UtilController/setVisited",type: "POST",data:{type:11}}); 
	$(".userImg").attr("src",window.user.avatar);
	//点击“其他”出现下拉单
	$('.other').bind({
		"click":function(e){//alert("双击")
			var $this = $(this).children('.otherList');
			$this.removeClass('black');
			$(".backDrop").show();	
			$(this).addClass('current').siblings().removeClass('current');
		},
		"mouseleave":function(){
			$(this).children('.otherList').addClass('black');  
			$(".backDrop").hide();
		}
	});
	/*rdc下拉列表*/
	$(".transion").click(function(){
	 	$(".one").hide();
	 	$(".two").show();	
	 	$('.search input').focus()
	 });
  	 $(".cancel").click(function(){
  	 	$(".one").show();
  	 	$(".two").hide();
  	 	$('.searchTop').hide();
  	 });
  	 $("#searchDara_div input").keyup(function(){
  	 	$('.searchTop').show()
  	 })
  	 $(".rdcList li").click(function(){
	 	$('.searchTop').hide();
	 	$(".one").children('.txt').text($(this).children('span').html())
	 	$(".one").show();
	 	$(".two").hide();
	 });
	/*rdc下拉列表*/ 
	/*$(".zoom").click(function () {
        $('.rdcDropList').slideDown();
        $(".backDrop").show();
    })
	$('.rdcDropList li').click(function () {
        $('.rdcDropList').hide();
        $(".backDrop").hide();
    })*/
	$(".backDrop").click(function(){
			$('.otherList').addClass('black');
			$(this).hide();
			//$('.rdcDropList').hide();
		})
	$('.otherList').click(function(e){
		swiper.activeIndex = 0; // 回归滑动第一个位置
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if ($(target).next().hasClass('inner')) {
			$(this).removeClass('black');
			$(".backDrop").show();
		} else{
			$(this).prev('.dropNext').children('b').html(target.innerHTML);
			var activeColor = $(this).css('color');
			$(this).find('a').css({'color':'#555'});
			target.style.color = activeColor;
			$(this).addClass('black');
			$(".backDrop").hide();
		}
		event.stopPropagation();
	});
	//图表切换
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
		observer: true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents: true//修改swiper的父元素时，自动初始化swiper
    });

});