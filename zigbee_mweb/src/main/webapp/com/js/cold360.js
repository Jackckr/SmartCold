$(function() {
	//点击“其他”出现下拉单
	$('#other').bind({
		"click":function(e){
			$(this).children('.otherList').toggleClass('black'); 
			$(".backDrop").toggle()
			$(this).addClass('current').siblings().removeClass('current');
		},
		"mouseleave":function(){
			$(this).children('.otherList').addClass('black');  
		}
	});
	$(".backDrop").click(function(){
			$('.otherList').addClass('black');
			$(this).hide();
		})
	$('.otherList').click(function(e){
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if (target.nodeName.toLocaleLowerCase() == "a") {
			switch (target.id){
				case 'ysj':
					$(".dropNext").html(target.innerHTML)
					break;
				case 'fj':
					$(".dropNext").html(target.innerHTML)
					break;
			}
		}
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

