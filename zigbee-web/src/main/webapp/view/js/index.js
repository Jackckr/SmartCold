$(function () {
    $('.navSmall').hover(function() {//导航下拉菜单
        $(this).children('ul').stop().toggle();
    });
    $(document).scroll(function () {//吸附导航
        var sTop = document.body.scrollTop || document.documentElement.scrollTop;
        var oTop = 86;
        if(sTop>oTop){
            $('.header').addClass('fixed');
            $(".banner").css('marginTop',oTop);
        }else{
            $('.header').removeClass('fixed');
            $(".banner").css('marginTop',0);
        }
    });
    $('.imgList li:first').show();
    $('.dianList li:last').css('margin-right', 0);
    //自定义一个变量，用来模拟不断改变的下标，默认值要和页面一致
    var num=0;
    var timer;
    //封装跳转下一张的功能
    function nextFn(event) {
        $('.imgList li').eq(num).stop().fadeOut(1000);
        num++;
        if(num>3){
            num=0;
        }
        $('.dianList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).stop().fadeIn(1000);
    }
    timer=setInterval(nextFn, 3000);
    $('.banner').hover(function() {
        $(".leftBtn,.rightBtn").show();
        clearInterval(timer);
    }, function() {
        $(".leftBtn,.rightBtn").hide();
        clearInterval(timer);
        timer=setInterval(nextFn, 3000);
    });
    //点击跳转
    $('.dianList li').click(function(event) {
        $('.imgList li').eq(num).stop().fadeOut(1000);
        var i=$(this).index();
        $('.dianList li').eq(i).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(i).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(i).stop().fadeIn(1000);
        num=i;

    });
    $('.rightBtn').click(nextFn);
    //单击左按钮：切上一张
    $('.leftBtn').click(function(event) {
        $('.imgList li').eq(num).stop().fadeOut(1000);
        num--;
        if(num<0){
            num=3;
        }
        $('.dianList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).stop().fadeIn(1000);

    });

});

/*
 *点击banner 图上筛选条件js
 */
function activeA(ops) {
    var oIndex=$(ops).index() ;
    $(ops).addClass('activeA').siblings().removeClass('activeA');
    $('.filterTxt').show()
        .children('li').eq(oIndex).show()
        .siblings('li').hide();
}
$(".arealist li").click(function () {//点击之后跳转到冷库商情
    $(this).addClass('activeLi').siblings().removeClass('activeLi');
    $(".filterTxt").hide();
    alert('在这里要做跳转咯');
})