$(function () {
    $('.imgList li:first').show();
    $('.dianList li:last').css('margin-right', 0);
    //自定义一个变量，用来模拟不断改变的下标，默认值要和页面一致
    var num=0;
    var timer;
    //封装跳转下一张的功能
    var liLen = $('.imgList li').length-1;
    function nextFn(event) {
        $('.imgList li').eq(num).stop().fadeOut(500);
        num++;
        if(num>liLen){
            num=0;
        }
        $('.dianList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).stop().fadeIn(500);
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
        $('.imgList li').eq(num).stop().fadeOut(500);
        var i=$(this).index();
        $('.dianList li').eq(i).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(i).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(i).stop().fadeIn(500);
        num=i;

    });
    $('.rightBtn').click(nextFn);
    //单击左按钮：切上一张
    $('.leftBtn').click(function(event) {
        $('.imgList li').eq(num).stop().fadeOut(500);
        num--;
        if(num<0){
            num=liLen;
        }
        $('.dianList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(num).stop().fadeIn(500);

    });

    /*广告小轮播*/
    var counts=0;
    var mytimer;
    var myclone=$('.lists ul li:lt(4)').clone(true);
    $('.lists ul').append(myclone)
    function mynext(){
        counts++;
        if (counts>4) {
            $('.lists ul').css('left', 0);
            counts=1;
        };
        var moves=counts*-1200;
        $('.lists ul').stop().animate({'left': moves}, 300)
    }
    $('.adbanner .right').click(mynext);
    mytimer=setInterval(mynext,4000);
    $('.lists').hover(function() {
        clearInterval(mytimer);
    }, function() {
        clearInterval(mytimer);
        mytimer=setInterval(mynext,4800);
    });
    $('.adbanner .left').click(function(){
        counts--;
        if (counts<0) {
            $('.lists ul').css('left', -4800);
            counts=3;
        };
        var moves=counts*-1200;
        $('.lists ul').stop().animate({'left': moves},300)
    })

});

/*
 *点击banner 图上筛选条件js
 */
$('.filter').mouseleave(function () {
    $('.filter ul li').removeClass('activeA');
    $('.filterTxt').hide();
});
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