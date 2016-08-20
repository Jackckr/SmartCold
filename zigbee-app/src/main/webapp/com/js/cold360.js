$(function() {
	//点击“其他”出现下拉单
	$('.other').bind({
		"click":function(e){
			var $this = $(this).children('.otherList');
			if($this.hasClass('black')){
				$this.removeClass('black');
				$(".backDrop").show()
			}else{
				$this.addClass('black');
				$(".backDrop").hide()
			}
			/*$(this).children('.otherList').toggleClass('black'); 
			$(".backDrop").toggle()*/
			$(this).addClass('current').siblings().removeClass('current');
		},
		"mouseleave":function(){
			$(this).children('.otherList').addClass('black');  
			$(".backDrop").hide();
		}
	});
	/*rdc下拉列表*/
	$(".zoom").click(function () {
        $('.rdcDropList').slideDown();
        $(".backDrop").show();
    })
	$('.rdcDropList li').click(function () {
        $('.rdcDropList').hide();
        $(".backDrop").hide();
    })
	$(".backDrop").click(function(){
			$('.otherList').addClass('black');
			$(this).hide();
			$('.rdcDropList').hide();
		})
	$('.otherList').click(function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		$(this).prev('.dropNext').children('b').html(target.innerHTML);
		var activeColor = $(this).css('color');
		$(this).find('a').css({'color':'#555'});
		target.style.color = activeColor;
		/*alert(target.innerHTML)*/
	});
	//图表切换
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop : true,
        spaceBetween: 30
    });
	
});

