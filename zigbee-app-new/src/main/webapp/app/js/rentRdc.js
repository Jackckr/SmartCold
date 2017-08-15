/**
 * 求租冷库列表
 */
$().ready(function () {
    var maxSize = 10;
    var isLoadRB = false;
    var ul_select = $("#ul_rdcsL_list");
    var rdcid = getUrlParam("rdcid");
    var type = 1, totalPages = currentPage = 1;  // 当前页//rental_type:出租类型:1:出租 2:求租
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
        /*$("#searchDara_div i").click(function (e) {//搜索
         currentPage = 1;
         ul_select.empty();
         getPageData();
         });*/
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
        var uid = null;
        if (window.user) {
            uid = window.user.id;
        }
        var _options = {
            typeCode: 1,
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
        var approve = ''
        if (rdc.audit == 2) {
            if (rdc.istemperaturestandard == 1) {
                approve = '<i class="iconfont green">&#xe6ac;</i><i class="green">已认证</i><i class="iconfont orange">&#xe6e9;</i><i class="orange">冷链委温度达标库</i>'
            } else {
                approve = '<i class="iconfont green">&#xe6ac;</i><i class="green">已认证</i>'
            }
        } else if (rdc.audit != 2) {
            if (rdc.istemperaturestandard == 1) {
                approve = '<i class="iconfont orange">&#xe63b;</i><i class="orange">未认证</i><i class="iconfont orange">&#xe6e9;</i><i class="orange">冷链委温度达标库</i>'
            } else {
                approve = '<i class="iconfont orange">&#xe63b;</i><i class="orange">未认证</i>';
            }
        }
        if (rdc.rdcSqm == undefined) {
            rdc.rdcSqm = rdc.sqm;
        }
        var collectWords = '<a class="fr noCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
        if (rdc.collectType == 1) {
            collectWords = '<a class="fr hasCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
        }
        var prices = null;
        if (rdc.unitPrice == undefined || rdc.unitPrice == 0) {
            prices = '面议';
        }else if(rdc.unit1&&rdc.unit2&&rdc.unit1.trim()!=""&&rdc.unit2.trim()!=""){
            prices=rdc.unitPrice+'<br><span>元/'+rdc.unit1+'/'+rdc.unit2+'</span>';
        }else {
            prices = rdc.unitPrice + '<br><span>元/天/㎡</span>';
        }
        var loseEffice = '';
        if (rdc.name == null || rdc.name == '' || rdc.name == 'undefined') {
            loseEffice = '<i class="iconfont loseEffice">&#xe667;</i>';
        }
        var score = [
            '<li class="imgCell"><a href="storehousedetail.html?id=' + rdc.id + '"  onclick="getSoll()">' + loseEffice + '<span><img src="' + rdc.logo + '" alt=""></span><div>' +
            '<p class="ellipsis">' + rdc.title + '</p><em>信息完整度<i class="blue">' + rdc.infoIntegrity + '%</i></em><p class="position omg">' + approve + '</p>' +
            '<p class="grab orange">' + prices + '</p></div><div class="flex"><div class="item"><h4>' + rdc.rdcSqm + '㎡</h4>' +
            '<p>总面积</p></div><div class="item"><h4>' + rdc.sqm + '㎡</h4><p>可租面积</p></div><div class="item"><h4>' + rdc.detlAddress + '</h4><p></p></div></div></a>' +
            '<div class="btnFn clearfix"><a href="storehousedetail.html?id=' + rdc.id + '" class="fl"><i class="iconfont">&#xe65b;</i>查看</a>' +
            collectWords + '<a class="fr"><i class="iconfont">&#xe66c;</i>咨询</a></div></li>'
        ];
        return score.join("");
    }

    collect = function (ops, id) {
        if (!(window.user && window.user.id != 0)) {
            checkLogin();
            return;
        }
        var em = $(ops);
        if (em.hasClass('noCollect')) {
            $.post(ER.root + "/i/collect/addCollectRdc", {
                uid: window.user.id,
                collectId: id,
                collectType: 2
            }, function (data) {

            });
            em.removeClass('noCollect').addClass('hasCollect');
            em.children('i').html('&#xe60c;');
            em.children('em').html('已收藏');
        } else {
            $.post(ER.root + "/i/collect/delByCollect", {
                uid: window.user.id,
                collectId: id,
                collectType: 2
            }, function (data) {

            });
            em.addClass('noCollect').removeClass('hasCollect');
            em.children('i').html('&#xe605;');
            em.children('em').html('收藏');
        }
    };
    function getPageData(search) {//启用无限加载
        if (search == 1) {
            currentPage = 1;
            ul_select.empty();
        }
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

    function setRdcID() {
        var urlParam = getUrlParam("rdcid");
        if(urlParam&&urlParam!=null&&urlParam!=""){
            localStorage.saveRdcID=urlParam;
        }
    }

    $("#searchDara_div>input").keypress(function (e) {
        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (eCode == 13) {
            searchFilters();
        }
    });
    searchFilter = function (search) {//搜索
        if ($("#searchDara_div input").val().trim() != "") {
            currentPage = 1;
            ul_select.empty();
            getPageData(search);
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
    setRdcID();
});
function goWhere() {
    if(localStorage.saveRdcID){
        var rdcId=localStorage.saveRdcID;
        checkLocal();
        location.href="rdcdetail.html?id="+rdcId;
    }else {
        location.href="../index.html";
    }
}