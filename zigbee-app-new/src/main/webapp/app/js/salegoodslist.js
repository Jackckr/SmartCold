/**
 * 出售求购列表
 */
$().ready(function () {
    var maxSize = 10;
    var isLoadRB = false;
    var rdcid = getUrlParam("rdcid");
    var ul_select = $("#ul_goodlist_list");
    var typeCode = $("#rdcType").val(), totalPages = currentPage = 1;  // 当前页//rental_type:出租类型:1:出租 2:求租
    gosharedile = function (sharid) {//共享详情
        window.location.href = "storehousedetail.html?id=" + sharid;
    };
    var match={area:'',mantype:'',temtype:'',sqm:'',goodtype:''};
    var myFilter=null;
    if(localStorage.match) {
        myFilter = JSON.parse(localStorage.match);
    }
    $(".transion").click(function () {
        $(".one").hide();
        $(".two").show();
    });
    $(".cancel").click(function () {
        $(".one").show();
        $(".two").hide();
        localStorage.removeItem('match');
        window.location.reload();
    });
    initevg = function () {
        $("#tool_but button").click(function (e) {
            type = this.value;
            currentPage = 1;
            ul_select.empty();
            getPageData();
        });
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
    addfilter = function (em,city) {
        var $this = $(em).html();
        if(city){
            localStorage.cityShow=$this;
        }
        $(em).addClass('active').siblings().removeClass('active').parent().parent().hide();
        $(em).parent().parent().siblings('a').children('span').html($this);
        $(".backDrop").hide();
        $(em).parent().parent().siblings().removeClass('current').children('i').removeClass('current').html('&#xe62d;');
        currentPage = 1;
        ul_select.empty();
        if($(em).attr('data-val')){
            myFilter.provinceid=myFilter.cityid='';
            localStorage.removeItem('cityShow');
        }
        getPageData();
    };
    backfilter=function () {
        $("#ul_city_list").hide().prev('ul').show();
        $("#ul_city_list li.active").attr("value",'');
    };
    initFilter = function () {
        var gdlist = [], prove = [];
        $.get(ER.root + '/i/city/findProvinceList', function (data) {
            $.each(data, function (i, vo) {
                prove.push("<li value='" + vo.provinceId + "' >" + vo.provinceName + "</li>");
            });
            $("#ul_hascar_list").append(prove.join(""));
            $("#ul_hascar_list li").click(function (event) {
                var provinceid=$(this).attr("value");
                if(provinceid){
                    $(this).addClass('active').siblings().removeClass('active');
                    $("#ul_city_list").show().prev('ul').hide();
                    $.ajax({
                        url: ER.root + "/i/city/findCitysByProvinceId",data:{provinceID:provinceid},type: "get", success: function (data) {
                            var cityArr = ['<li class="fl backLi" value="" onclick="backfilter()">返回</li><li class="fl active" value="" onclick="addfilter(this)">全部</li>'];
                            data.forEach(function (val, index) {
                                cityArr.push('<li  onclick="addfilter(this,1)" class="fl omg" value="' + val.cityID + '">' + val.cityName + '</li>');
                            });
                            window.localStorage.match_list_city = cityArr.join('');
                            $("#ul_city_list").empty().show().append(window.localStorage.match_list_city);
                        }
                    });
                }else{
                    addfilter(this);
                }
            });
            if(myFilter&&myFilter.provinceid) {
               // match.area=data[myFilter.provinceid-1].provinceName;
                $("#filter_section").children('.droplist').eq(0).find('span').html(localStorage.cityShow);
                $("#ul_hascar_list li").eq(myFilter.provinceid).addClass('active').siblings().removeClass('active');
            }
        });
        $.post(ER.root + "/i/ShareRdcController/getGDFilterData", function (data) {
            if (data.success) {
                var _gdty = data.entity.gt;//经营类型,温度类型
                $.each(_gdty, function (i, vo) {
                    gdlist.push("<li value='" + vo.type_code + "' >" + vo.type_name + "/" + vo.type_desc + "</li>");
                });
                $("#ul_goodtype_list").append(gdlist.join(""));
                $("#ul_goodtype_list li").click(function (event) {
                    addfilter(this);
                });
                if(myFilter&&myFilter.goodtype) {
                    match.goodtype=data.entity.gt[myFilter.goodtype-1].type_name+ "/" +data.entity.gt[myFilter.goodtype-1].type_desc;
                    $("#filter_section").children('.droplist').eq(1).find('span').html(match.goodtype);
                    $("#ul_goodtype_list li").eq(myFilter.goodtype).addClass('active').siblings().removeClass('active');
                }
            }
        });
    };
    getFilter = function (pageNum, pageSize) {
        var adds = $("#ul_hascar_list li.active").attr("value");////地区
        var gdty = $("#ul_goodtype_list li.active").attr("value");//商品类型
        var keyword = $("#searchDara_div input").val().trim();////关键字搜索
        var citys = $("#ul_city_list li.active").attr("value");////地区
        var uid = null;
        if (window.user) {
            uid = window.user.id;
        }
        var _options = {
            provinceid: adds,
            cityid:citys,
            goodtype: gdty,
            typeCode: typeCode,
            dataType: 1,
            rdcID: rdcid,
            keyword: keyword,
            uid: uid
        };
        var _filter = {pageNum: pageNum, pageSize: pageSize};
        jQuery.extend(_filter, _options);
        if(gdty||adds||keyword){
            localStorage.match=JSON.stringify(_filter);
            myFilter=_filter;
        };
        return _filter;
    };
    getSoll = function () {
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
        localStorage.list_cache_goodlist = JSON.stringify({
            totalPages: totalPages,
            currentPage: currentPage,
            html: $("#ul_goodlist_list").html(),
            scrollHeight: scrollHeight
        });
    };
    function gethtml(rdc) {
        var oStart = formatTime.mseconds(rdc.validStartTime);
        var oEnd = formatTime.mseconds(rdc.validEndTime);
        var today = new Date().getTime();
        var validEndTime = formatTime.standTime(rdc.validEndTime).getFullYear() + '-' +
            (formatTime.standTime(rdc.validEndTime).getMonth() + 1 < 10 ? '0' + (1 + formatTime.standTime(rdc.validEndTime).getMonth()) : formatTime.standTime(rdc.validEndTime).getMonth() + 1)
            + '-' + formatTime.standTime(rdc.validEndTime).getDate();
        var deadline = oEnd - oStart;
        var days = deadline / 1000 / 60 / 60 / 24;
        var daysRound = Math.floor(days);//租期
        var showDate = Math.floor((today - oStart) / 1000 / 60 / 60 / 24);
        var showTime = null;
        if (showDate >= 30) {
            showTime = Math.floor(showDate / 30) + '个月前发布';
        } else {
            if (showDate > 1) {
                showTime = showDate + '天前发布';
            } else {
                showTime = '刚刚发布';
            }
        }
        var usefulDate = rentDate[rdc.rentdate],oprice='';
        if (rdc.rentdate == undefined || rdc.rentdate == null || rdc.rentdate == 0) {
            if (daysRound < 30) {
                usefulDate = daysRound + 1 + '天'
            } else {
                if (daysRound / 30 > 12) {
                    usefulDate = (daysRound / 30 / 12).toFixed(1) + '年'
                } else {
                    usefulDate = (daysRound / 30).toFixed(1) + '个月'
                }
            }
        }
        var collectWords = '<a class="fr noCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
        if (rdc.collectType == 1) {
            collectWords = '<a class="fr hasCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
        }
        var unit = ['吨', 'Kg', '吨'];
        if(!rdc.unitPrice||rdc.unitPrice==0){
            oprice=rdc.unitPrice='面议';
        }else{
            oprice=rdc.unitPrice+'元/'+unit[rdc.publishunit];
        }
        var score = [
            '<li class="imgCell"><a href="storehousedetail.html?id=' + rdc.id + '" onclick="getSoll()"><span>'+rdc.typeText+'货源</span><div>' +
            '<p class="ellipsis">' + rdc.title + '</p><p class="position omg orange"><i class="iconfont">&#xe673;</i>' + rdc.sqm + unit[rdc.publishunit] + '</p><span class="grab green">[' + showTime + ']</span>' +
            '</div><div class="flex"><div class="item"><h4>' + usefulDate + '</h4>' +
            '<p>有效期</p></div><div class="item"><h4>' + validEndTime + '</h4><p>报价截止日</p>' +
            '</div><div class="item"><h4 class="omg">' +oprice+ '</h4><p>价格</p></div></div></a>' +
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
    function getPageData() {//启用无限加载
        isLoadRB = true;
        if($("#searchDara_div input").val().trim()){
            $(".one").hide();
            $(".two").show();
        }
        var _filter = getFilter(currentPage, maxSize);
        if(myFilter){
            _filter=myFilter;
            if(_filter.keyword){
                $(".one").hide();
                $(".two").show();
                $("#searchDara_div input").val(_filter.keyword);
            }
        };
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
        initFilter();
        initevg();
        if (localStorage.list_cache_goodlist) {
            var cachdata = JSON.parse(localStorage.list_cache_goodlist);
            totalPages = parseInt(cachdata.totalPages);
            currentPage = parseInt(cachdata.currentPage);
            $("#ul_goodlist_list").html(cachdata.html);
            $(document).scrollTop(cachdata.scrollHeight);
        } else {
            getPageData();
        }

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
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight > scrollHeight - 100) {
            if (isLoadRB == false && currentPage < totalPages + 1) {
                getPageData();
            }
        }
        ;
    });
    setRdcID();
    initData();
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