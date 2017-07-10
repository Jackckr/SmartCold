/**
 * 求租冷库列表
 */
$().ready(function () {
    var maxSize = 10;
    var isLoadRB = false;
    var ul_select = $("#ul_rdcsL_list");
    var rdcid = getUrlParam("rdcid");
    var type = 2, totalPages = currentPage = 1;  // 当前页//rental_type:出租类型:1:出租 2:求租
    $(".transion").click(function () {
        $(".one").hide();
        $(".two").show();
    });
    $(".cancel").click(function () {
        $(".one").show();
        $(".two").hide();
        currentPage = 1;
        ul_select.empty();
        $("#searchDara_div input").val(null);
        getPageData();
    });
    gosharedile = function (sharid) {//共享详情
        window.location.href = "storehousedetail.html?id=" + sharid;
    };
    initevg = function () {
        $(".droplist a").click(function (e) {//条件过滤
            $(this).children('i').addClass('current').html('&#xe62e;');
            $(this).addClass('current').next('.listcontain').slideDown().parent().siblings().children('a').removeClass('current').children('i').removeClass('current').html('&#xe62d;').parent().siblings('.listcontain').hide();
            $(".backDrop").show();
        });
        $(".backDrop").click(function () {
            $(".droplist a").removeClass('current').children('i').removeClass('current').html('&#xe62d;');
            $('.listcontain').hide();
            $(this).hide();
        });
        $("#searchDara_div i").click(function (e) {//搜索
            currentPage = 1;
            ul_select.empty();
            getPageData();
        });
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight > scrollHeight - 100) {
                if (isLoadRB == false && currentPage <= totalPages) {
                    getPageData();
                }
            }
            ;
        });
    };
    addfilter = function (em) {
        var $this = $(em).html();
        $(em).addClass('active').siblings().removeClass('active').parent().parent().hide();
        $(em).parent().parent().siblings('a').children('span').html($this);
        $(".backDrop").hide();
        $(em).parent().parent().siblings().removeClass('current').children('i').removeClass('current').html('&#xe62d;');
        currentPage = 1;
        ul_select.empty();
        getPageData();
    };
    initFilter = function () {
        var mtlist = [], stlist = [], prove = [];
        $.get(ER.root + '/i/city/findProvinceList', function (data) {
            $.each(data, function (i, vo) {
                prove.push("<li value='" + vo.provinceId + "' >" + vo.provinceName + "</li>");
            });
            $("#ul_hascar_list").append(prove.join(""));
            $("#ul_hascar_list li").click(function (event) {
                addfilter(this);
            });
        });
        $.post(ER.root + "/i/ShareRdcController/getSEFilterData", function (data) {
            if (data.success) {
                var _mtty = data.entity.mt, _stty = data.entity.st;//经营类型,温度类型
                $.each(_mtty, function (i, vo) {
                    mtlist.push("<li value='" + vo.id + "' >" + vo.type + "</li>");
                });
                $.each(_stty, function (i, vo) {
                    stlist.push("<li value='" + vo.id + "' >" + vo.type + "</li>");
                });
                $("#ul_mtty_list").append(mtlist.join(""));
                $("#ul_stty_list").append(stlist.join(""));
                $("#ul_mtty_list li,#ul_stty_list li,#ul_sqm_list li").click(function (event) {
                    addfilter(this);
                });
            }
        });
    };
    getFilter = function (pageNum, pageSize) {
        var sqm = $("#ul_sqm_list li.active").attr("value");//面积
        var smty = $("#ul_stty_list li.active").attr("value");//温度
        var sety = $("#ul_mtty_list li.active").attr("value");//经营类型
        var adds = $("#ul_hascar_list li.active").attr("value");////地区
        var keyword = $("#searchDara_div input").val().trim();////关键字搜索
        var _options = {
            typeCode: 2,
            dataType: 3,
            rdcID: rdcid,
            sqm: sqm,
            managetype: sety,
            storagetempertype: smty,
            provinceid: adds,
            keyword: keyword
        };
        var _filter = {pageNum: pageNum, pageSize: pageSize};
        jQuery.extend(_filter, _options);
        return _filter;
    };
    getSoll = function () {
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
        localStorage.list_cache_storehouse = JSON.stringify({
            totalPages: totalPages,
            currentPage: currentPage,
            html: $("#ul_rdcsL_list").html(),
            scrollHeight: scrollHeight
        });
    };
    function gethtml(rdc) {
        var oStart=new Date(rdc.validStartTime).getTime(),oEnd=new Date(rdc.validEndTime).getTime(),today=new Date().getTime();
        var deadline=oEnd-oStart;
        var days    = deadline / 1000 / 60 / 60 / 24;
        var daysRound   = Math.floor(days);//租期
        var hours    = deadline/ 1000 / 60 / 60 - (24 * daysRound);
        var hoursRound   = Math.floor(hours);
        var minutes   = deadline / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
        var minutesRound  = Math.floor(minutes);
        var seconds   = deadline/ 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
        var showDate=Math.floor((today-oStart)/ 1000 / 60 / 60 / 24);
        var showTime=null;
        if(showDate>=30){
            showTime=Math.floor(showDate/30)+'个月前发布';
        }else{
            if(showDate>1){//1~30天
                showTime=showDate+'天前发布';
            }else{//<1天
                showTime='刚刚发布';
            }
        }
        if(rdc.username==undefined){
            rdc.username=rdc.id
        }
        var usefulDate = rentDate[rdc.rentdate];
        if(rdc.rentdate==undefined || rdc.rentdate==null || rdc.rentdate==0){
            usefulDate = daysRound+'天'
        }
        var collectWords='<a class="fr noCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
        if(rdc.collectUserIds && window.user){
            for(var i=0;i<rdc.collectUserIds.length;i++){
                if(rdc.collectUserIds[i]==window.user.id){
                    collectWords='<a class="fr hasCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
                }
            }
        }
        var score = [
            '<li class="imgCell"><a href="storehousedetail.html?id=' + rdc.id + '" onclick="getSoll()"><span>求租冷库</span><div>'+
            '<p class="ellipsis">'+rdc.title+'</p><p class="position omg orange"><i class="iconfont">&#xe673;</i>'+rdc.sqm+'㎡</p><span class="grab green">['+showTime+']</span>'+
            '</div><div class="flex"><div class="item"><h4>'+usefulDate+'</h4>'+
            '<p>租期</p></div><div class="item"><h4>'+rdc.validEndTime+'</h4><p>报价截止日</p>'+
            '</div><div class="item"><h4 class="omg">'+rdc.username+'</h4><p>发布者</p></div></div></a>' +
            '<div class="btnFn clearfix"><a href="storehousedetail.html?id='+rdc.id+'" class="fl"><i class="iconfont">&#xe65b;</i>查看</a>'+
            collectWords+'<a class="fr"><i class="iconfont">&#xe66c;</i>咨询</a></div></li>'
        ];
        return score.join("");
    }
    collect=function(ops,id) {
        if(!(window.user && window.user.id!=0)){
            checkLogin();
            return;
        }
        var em = $(ops);
        if(em.hasClass('noCollect')){
            $.post(ER.root+"/i/collect/addCollectRdc",{uid:window.user.id,collectId:id,collectType:2},function (data) {

            });
            em.removeClass('noCollect').addClass('hasCollect');
            em.children('i').html('&#xe60c;');
            em.children('em').html('已收藏');
        }else{
            $.post(ER.root+"/i/collect/delByCollect",{uid:window.user.id,collectId:id,collectType:2},function (data) {

            });
            em.addClass('noCollect').removeClass('hasCollect');
            em.children('i').html('&#xe605;');
            em.children('em').html('收藏');
        }
    };

    function getPageData() {//启用无限加载
        isLoadRB = true;
        var _filter = getFilter(currentPage, maxSize);
        $.post(ER.root + "/i/ShareRdcController/newGetSERDCList", _filter, function (data) {
            if (data.success && data.data.length > 0) {
                totalPages = data.totalPages;
                currentPage++;
                var html = [];
                var rdcsList = data.data;//
                $.each(rdcsList, function (index, item) {
                    html.push(gethtml(item));
                });
                ul_select.append(html.join(""));
                $(".nodata").hide();
            } else {
                $(".nodata").show();
            }
            isLoadRB = false;
        });
    };

    function initData() {//启用无限加载
        if (localStorage.list_cache_storehouse) {
            var cachdata = JSON.parse(localStorage.list_cache_storehouse);
            totalPages = parseInt(cachdata.totalPages);
            currentPage = parseInt(cachdata.currentPage);
            $("#ul_rdcsL_list").html(cachdata.html);
            $(document).scrollTop(cachdata.scrollHeight);
        } else {
            getPageData();
        }
        initFilter();
        initevg();
    };
    $("#searchDara_div>input").keypress(function (e) {
        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (eCode == 13) {
            searchFilters();
        }
    });
    searchFilter = function () {//搜索
        if ($("#searchDara_div input").val().trim() != "") {
            currentPage = 1;
            ul_select.empty();
            getPageData();
        }
    };
    searchFilters = function () {//搜索
        if ($("#searchDara_div input").val().trim() == "") {
            alert("请输入你要搜索的内容~")
        } else {
            currentPage = 1;
            ul_select.empty();
            getPageData();
        }
    };
    initData();
});	