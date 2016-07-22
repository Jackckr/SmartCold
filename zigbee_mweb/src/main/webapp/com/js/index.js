/*下拉列表切换*/
$(function(){
		$(".droplist a").click(function(e){
			$(this).children('i').addClass('current').html('&#xe62e;');
			$(this).addClass('current')
					.next('.listcontain').slideDown()
					.parent().siblings().children('a').removeClass('current')
					.children('i').removeClass('current').html('&#xe62d;')
					.parent().siblings('.listcontain').hide();
			$(".backDrop").show();
		});
		$(".listcontain li").click(function(e){
			var $this = $(this).html();
			$(this).addClass('active').siblings().removeClass('active').parent().parent().hide();
			$(this).parent().parent().siblings('a').children('span').html($this);
			$(".backDrop").hide();
			$(this).parent().parent().siblings().removeClass('current').children('i').removeClass('current').html('&#xe62d;')
		});
		$(".backDrop").click(function(){
			$(".droplist a").removeClass('current').children('i').removeClass('current').html('&#xe62d;');
			$('.listcontain').hide();
			$(this).hide();
		})
		/*出租求租切换*/
		$('.rentKId').click(function(){
			$(this).addClass('btn').siblings('.wanted').removeClass('btn');
		})
		$('.wanted').click(function(){
			$(this).addClass('btn').siblings('.rentKId').removeClass('btn');
		})
})