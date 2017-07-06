$().ready(function () {
    var maxSize = 10;
    var totalPages =1;
    var  currentPage = 1;
    var ul_select = $("#ul_rdcsL_list");
    var isLoadRB=false;
    var flag=2;
    getSoll = function () {
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
        localStorage.list_cache_storehouse = JSON.stringify({
            totalPages: totalPages,
            currentPage: currentPage,
            html: $("#ul_rdcsL_list").html(),
            scrollHeight: scrollHeight
        });
    };
    function gethtml(item,index) {
        var obj;
        localStorage.gowhere='collect';
        switch (index){
            case 1:
                obj=item.rdcShareDTO;
                if(!obj){
                    return ["<li class='clearfix' >该内容已被删除！<button onclick='cancelCollect("+item.id+","+index+")'>取消收藏</button></li>" ].join("");
                }
                return [
                "<li class='clearfix' ><div class='clearfix'><div class='img fl'  onclick='detailinfo("+ obj.id+")'><img src='",
                obj.logo, "'/></div><p class='company'>", obj.title,
                "</p><p class='position'>", obj.typeText,
                "</p></div><p class='btnGroup'><a href='storehousedetail.html?id="+obj.id+"'><button>查看</button></a><button onclick='cancelCollect("+item.id+","+index+")'>取消收藏</button></p></li>" ].join("");
            case 2:
                obj=item.rdcEntity;
                if(!obj){
                    return ["<li class='clearfix' >该内容已被删除！<button onclick='cancelCollect("+item.id+","+index+")'>取消收藏</button></li>" ].join("");
                }
                return [
                    "<li class='clearfix' ><div class='clearfix'><div class='img fl'><img src='"+obj.logo+"'/></div><p class='company'>", obj.name,
                    "</p><p class='position'><i class='iconfont'>&#xe66e;</i>",
                    obj.address,
                    "</p></div><p class='btnGroup'><a href='rdcdetail.html?id="+obj.id+"'><button>查看</button></a><button onclick='cancelCollect("+item.id+","+index+")'>取消收藏</button></p></li>" ].join("");
        }

    }
    cancelCollect = function (id,index) {
        $.post(ER.root+"/i/collect/delCollectById",{collectId:id},function (data) {
            ul_select.empty();
            currentPage=1;
            flag=index;
            initData();
        });
    }
    getCollectShare=function (ops) {
        $(ops).addClass('collectActive').siblings().removeClass('collectActive');
        ul_select.empty();
        flag=1;currentPage=1;
        initData();
    }
    getCollectRdc=function (ops) {
        $(ops).addClass('collectActive').siblings().removeClass('collectActive');
        ul_select.empty();
        flag=2;currentPage=1;
        initData();
    }
    function getPageData(url) {//启用无限加载
        var _filter = {pageNum: currentPage, pageSize: maxSize,uid:window.user.id};
        $.post(ER.root + url, _filter, function (data) {
            if(!(isLoadRB == false && currentPage <= totalPages)){return;}
            isLoadRB = true;
            if (data.list.length > 0) {
                totalPages = data.pages;
                currentPage++;
                var html = [];
                var rdcsList = data.list;//
                $.each(rdcsList, function (index, item) {
                    html.push(gethtml(item,flag));
                });
                ul_select.append(html.join(""));
                $(".nodata").hide();
            } else {
                $(".nodata").show();
            }
            isLoadRB = false;
        });
    };
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight > scrollHeight - 100) {
            if (isLoadRB == false && currentPage <= totalPages) {
                getPageData(flag==1?"/i/collect/getCollectShared":"/i/collect/getCollectRdc");
            }
        }
    });
    function initData() {//启用无限加载
        if (localStorage.list_cache_storehouse) {
            var cachdata = JSON.parse(localStorage.list_cache_storehouse);
            totalPages = parseInt(cachdata.totalPages);
            currentPage = parseInt(cachdata.currentPage);
            $("#ul_rdcsL_list").html(cachdata.html);
            $(document).scrollTop(cachdata.scrollHeight);
        } else {
            getPageData(flag==1?"/i/collect/getCollectShared":"/i/collect/getCollectRdc");
        }
    };
    initData();
});
