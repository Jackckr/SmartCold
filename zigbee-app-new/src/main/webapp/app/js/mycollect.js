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
        switch (index){
            case 1:
                obj=item.rdcShareDTO;
                return [
                "<li class='clearfix' ><div  onclick='detailinfo("+ obj.id+")' class='clearfix'><div class='img fl'  onclick='detailinfo("+ obj.id+")'><img src='",
                obj.logo, "'/></div><p class='company'>", obj.title,
                "</p><p class='position'>", obj.typeText,
                "</p></div><p class='btnGroup'><button onclick='editshareinfo(", obj.id,",",obj.dataType,
                ")'>修改</button><button onclick='delrdc(", obj.id,
                ",this);'>删除</button></p></li>" ].join("");
                break;
            case 2:
                obj=item.rdcEntity;
                return [
                    "<li class='clearfix' ><div  onclick='detailinfo("+ obj.id+")' class='clearfix'><div class='img fl'><img src='"+obj.logo+"'/></div><p class='company'>", obj.name,
                    "</p><p class='position'><i class='iconfont'>&#xe66e;</i>",
                    obj.address,
                    "</p></div><p class='btnGroup'><button onclick='editinfo(", obj.id,
                    ")'>修改</button><button onclick='delrdc(", obj.id,
                    ",this);'>删除</button></p></li>" ].join("");
                break;
        }

    }
    getCollectShare=function () {
        ul_select.empty();
        flag=1;currentPage=1;
        initData();
    }
    getCollectRdc=function () {
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
