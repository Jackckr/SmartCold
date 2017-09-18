/*下拉列表切换*/
	$(function(){
		$(".droplist a").click(function(e){
			$(this).children('i').addClass('current').html('&#xe62e;');
			$(this).addClass('current')
					.next('.list').slideDown()
					.parent().siblings().children('a').removeClass('current')
					.children().removeClass('current').html('&#xe62d;')
					.parent().siblings('.list').hide();
			$(".backDrop").show();
		})
		$(".list li").click(function(e){  
			if($(this).index()==0){
				$(this).addClass('active').nextAll().removeClass('active').parent().hide();
			}else{
				$(this).parent().children().eq(0).removeClass('active');
				$(this).toggleClass('active').parent().hide();
			};
			$(".backDrop").hide();
			$(this).parent().siblings().removeClass('current').children().removeClass('current').html('&#xe62d;')
		});
		$(".backDrop").click(function(){
			$(".droplist a").removeClass('current').children().removeClass('current').html('&#xe62d;');
			$('.list').hide();
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