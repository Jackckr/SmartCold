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
            e.stopPropagation();
        },
        "mouseleave":function(e){
            e.stopPropagation();
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

    // 获取父节点，并为它添加一个click事件
    if($('.otherList')[0] == undefined){
//		console.log("$('.otherList')[0]==undefined")
    }else{
        $('.otherList')[0].addEventListener("click",function(e) {
            swiper.activeIndex = 0; // 回归滑动第一个位置
            var e = e || window.event;
            var target = e.target || e.srcElement;
            // 检查事件源e.targe是否为A
            if(e.target && e.target.nodeName.toUpperCase() == "A") {
                // 真正的处理过程在这里
                $(this).prev('.dropNext').children('b').html(target.innerHTML);
                var activeColor = $(this).css('color');
                $(this).find('a').css({'color':'#555'});
                target.style.color = activeColor;
                $(this).addClass('black');
                $(".backDrop").hide();
            }
            e.stopPropagation();
        });
    }
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
/**
 *
 * app.js
 * 公共服务在此显示
 * 2017-5.21
 */
var app = angular.module('app', []);
app.service('userService', function($rootScope,  $http) {
    initAllByRdcId= function(rootRdcId){
        $rootScope.rdcId = rootRdcId;
        $http({method:'POST',url:ER.coldroot + '/i/acl/getRUACL',params:{rdcid : $rootScope.rdcId,uid : window.user.id}}).success(function (data) {
            $rootScope.aclml=data.aclml;
            $rootScope.aclmap={};
            $rootScope.pagstate=[];
            $("body .role_limit").attr("disabled",true).removeClass("role_limit").removeClass("role_hide");
            angular.forEach(data.aclml,function(obj,i){
                $rootScope.aclmap[obj.id]=obj.acl;
                if(obj.acl){
                    if(!obj.hasnode){
                        // 技术原因，无法处理
//				      					coldWeb.stateProvider.state(obj.controller,{url:obj.tourl,controller: obj.controller,  templateUrl: obj.templateUrl });
                    }
                }else{
                    $("#ml_acl"+obj.id).addClass("role_limit");
                    $("#ml_acl"+obj.id+" *").addClass("role_limit");
                    $("#ml_acl"+obj.id+" *").attr("disabled",true);
                    if(user.type==1 || user.type==2){
                        $("#ml_acl"+obj.id).addClass("role_hide");
                        $("#ml_acl"+obj.id+" *").addClass("role_hide");
                    }
                }
            });
        });
    }
})

