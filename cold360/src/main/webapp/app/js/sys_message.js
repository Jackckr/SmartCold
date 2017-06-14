checkLogin();
var ischeck = flag = true;
var isLoadRB = false;
var rdcId = storages = null;
var rdcName = $("#rdcName").html();
var searchContent = $("#searchDara_div>input").val();
var modestate = ['待处理', '已处理'];
modestate[-1]="已拒绝";
var txt = "全部";
var news=[];
var params = {
    userId: user.id,utype: user.type,rdcId: rdcId,
    type: null,stype: null,isRead: null,status: null,
    page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
};
$(function () {
    if(user.roleid==2||user.roleid==3) {
        $(".searchZoom").show();
    }
    $(".prevpage").show();
    $(".nextpage").hide();
    /*rdc下拉列表*/
    $(".transion").click(function () {
        $(".one").hide();
        $(".two").show();
        $('.search input').focus()
    });
    $(".cancel").click(function () {
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    });
    $("#searchDara_div input").keyup(function () {
        $('.searchTop').show()
    })
    $(".rdcList li").click(function () {
        $('.searchTop').hide();
        $(".one").children('.txt').text($(this).children('span').html())
        $(".one").show();
        $(".two").hide();
    });

})

//内页和外页切换
function togglepage(flag) {
    if(flag){
        $(".nextpage").show();
        $(".prevpage").hide();
    }else{
        $(".nextpage").hide();
        $(".prevpage").show();
    }

}
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var rootRdcId = $.getUrlParam('storageID');
//获取rdcId
$.get(ER.coldroot + '/i/rdc/findRDCsByUserid', {userid: user.id}
    ,function (data) {
        if (data && data.length > 0) {
            storages = data;
            if (!rootRdcId) {
                if (localStorage.rdcId) {
                    rdcId = localStorage.rdcId;
                    findByRdcId(localStorage.rdcId);
                } else {
                    currentRdc = storages[0];
                    rdcId = storages[0].id;
                    $("#rdcName").html(storages[0].name);
                    viewStorage(storages[0].id);
                }
            } else {
                findByRdcId(rootRdcId);
                rdcId = rootRdcId;
            }
            params.rdcId = rdcId;
        }
        params.isRead=0;
        params.status=0;
        initAjax(1);
        counts();
        nums();
    }
);
//header  文字切换
function infoTxt(ops) {
    txt = $(ops).children('p').html();
    return txt;
}

//搜索消息
function searchSys() {
    params.page = 1;
    params.keyword = $(".searchInput").val();
    params.isRead=null;
    params.status=null;
    $("#allList").empty();
    allMsgAjax(-1);
    $("#infoTxt").html("搜索");
}

function counts() {//统计未读条数
     // $.post(ER.coldroot+'/i/messageRecord/getMsgCountByRdcId',{rdcId:rdcId,type:user.type,userId:user.id},function(data){
    $.post(ER.coldroot+'/i/MessageController/getMsgCount',{rdcId:rdcId,type:user.type,userId:user.id,state:null,isread:0},function(data){
         var counts = data;
         if(counts>0){
             $("#noread").show();
             $("#noread").html(counts);
         }else{
             $("#noread").hide();
         }

     })
}

function nums() {//统计未处理条数
    $.post(ER.coldroot+'/i/MessageController/getMsgCount',{rdcId:rdcId,type:user.type,userId:user.id,state:0,isread:null},function(data){
        var nums = data;
        if(nums>0){
            $("#nodeal").show();
            $("#nodeal").html(nums);
        }else{
            $("#nodeal").hide();
        }
    })
}

//返回上一步
function goprev() {
    params.page=1;
    params.keyword=null;
    params.isRead=0;
    params.status=0;
    togglepage(false);
    $('.myedit').html("编辑");
    $(".editSys,.checkAll").hide();
    initAjax(1);
    counts();
    nums();
}

//每条list拼接
function listObj(datalist,inOut){//out:1外部进入//in：-1内部进入
    news=[];
    $.each(datalist,function (i,value) {
        var oState = value.state==0?'<span class="fr redState">'+modestate[value.state]+'</span>':'<span class="fr">'+modestate[value.state]+'</span>';
        news.push('<li class="sysInfo">'+
            '<a onclick="sysModal(\''+value.title+'\',\''+value.message+'\','+rdcId+','+value.sType+','+value.uid+','+value.id+','+value.state+','+inOut+','+value.type+','+value.isread+')">'+
            '<p class="clearfix"><label class="check_icon on fl editSys black" >'+
            '<input type="checkbox"><i class="iconfont"></i></label>'+
            '<b class="fl">'+value.title+'</b>'+oState+
            '<p>'+value.message+'</p>'+
            '<p class="msgTime">'+value.addTime+'</p></a></li>')
    });
}

function initAjax(inOut){//初始化加载最新2条数据
    isLoadRB=true;
    $.ajax({
        type: 'POST',
        url: ER.coldroot +'/i/messageRecord/getMessageList',
        data: params,
        success: function (data) {
            var datalist = data.data;
            $("#twoList").empty();
            var len = datalist.length,j=0;
            if(len){
                $('.sysNo').hide();
                if(len>2){
                    data=datalist.slice(0,2);
                    listObj(data,inOut);
                }
            }else {
                $('.sysNo').show();
            }
            $("#twoList").append(news.join(""));
        }
    });
};
function allMsgAjax(inOut) {//ajax加载消息
    $("#infoTxt").html(txt);
    togglepage(true);
    isLoadRB=true;
    $.ajax({
        type: 'POST',
        url: ER.coldroot +'/i/messageRecord/getMessageList',
        data: params,
        success: function (data) {
            var datalist = data.data;
            if(datalist.length==0&&params.page==1){
                $('.sysNo').show();
            }else{
                $('.sysNo').hide();
            }
            params.totalPages = data.totalPages;
            listObj(datalist,inOut);
            $("#allList").append(news.join(""));
            params.page++;
            isLoadRB=false;
        }
    });
}
function changeStatus(isread,ops,status) {//已读未读,已处理未处理
    params = {
        userId: user.id,utype: user.type,rdcId: rdcId,
        type: null,stype: null,isRead: isread,status: status,
        page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
    };
    infoTxt(ops);
    $("#allList").empty();
    allMsgAjax(-1);
}
function allmsg(ops) {//全部消息按钮
    params = {
        userId: user.id,utype: user.type,rdcId: rdcId,
        type: null,stype: null,isRead: null,status: null,
        page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
    };
    infoTxt(ops);
    $("#allList").empty();
    allMsgAjax(-1);
};
function syswarn() {
    alert("暂无");
}
/*无限加载*/
$(window).scroll(function(){
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if(scrollTop + windowHeight > scrollHeight-100){
        if(isLoadRB==false&&params.page<=params.totalPages){
            allMsgAjax(-1);
        }
    };
});
//模态框
function sysModal(title,message,id,sType,uid,valId,status,step,uType,isRead) {
    if (status == 1 || status == -1) {
        alert("该条内容已处理完毕~")
        return
    }
    var oLi='';
    params.isRead = 1;
    if(sType==1&&uType==1){
        $.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId', {rdcID: id},
            function (data) {
                if (data && data.length > 0) {
                    mystorages = data;
                }
            }
        );
        $.each(mystorages,function (i,items) {
            oLi = oLi.concat('<li class="fl"><label><input type="checkbox" value="'+items.id+'">'+items.name+'</label></li>');
            return oLi;
        });
    }
    var modalObj = '<div class="sysModal"><div class="sysModalMain"><div class="sysModalHeader"><img src="../com/img/modalBg.png" style="width: 11rem;height: 5.12rem;" alt="">'+
        '<h4>'+title+'</h4><p>'+message+'</p></div>'+
        '<div class="sysModalBody"><div ng-if="currmsg.type==1&&currmsg.sType==1" >'+
        '<ul id="ul_storage" class="clearfix">'+oLi+'</ul></div></div><div class="sysModalFooter clearfix">'+
        '<div class="fl" onclick="handleFn('+sType+','+uid+','+valId+','+step+','+isRead+','+status+',0)">关闭</div>'+
        '<div class="fl"  onclick="handleFn('+sType+','+uid+','+valId+','+step+','+isRead+','+status+',1)">同意</div>'+
        '<div class="fl" onclick="handleFn('+sType+','+uid+','+valId+','+step+','+isRead+','+status+',-1)">拒绝</div></div>'+
        '<div class="sysClose" onclick="handleFn('+sType+','+uid+','+valId+','+step+','+isRead+','+status+',0)">&times;</div></div></div>';
    $("body").append(modalObj);
}

function handleFn(sType,uid,valId,step,isRead,status,onOff) {//0关闭操作，1同意操作，-1拒绝操作
    var str = [], oid = "";
    if(onOff==1){
        if (sType == 1) {
            $("#ul_storage input[type='checkbox']:checked").each(function () {
                str.push($(this).val());
            });
            if (str.length == 0) {
                alert("请选择授权的冷库！");
                return
            } else {
                oid = str.toString();
            }
        }
    }
    $.ajax({
        type: 'POST',
        url: ER.coldroot + '/i/authenUser/authorUserByRdcId',
        data: {
            id: valId,
            userId: uid,
            stype: sType,
            rdcId: rdcId,
            status: onOff,
            oids: oid
        },
        success:function (data) {
            if(step==1){
                params = {
                    userId: user.id,utype: user.type,rdcId: rdcId,
                    type: null,stype: null,isRead: 0,status: 0,
                    page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
                };
                $("#twolist").empty();
                initAjax(1);
            }else if(step==-1){
                params = {
                    userId: user.id,utype: user.type,rdcId: rdcId,
                    type: null,stype: null,isRead: isRead,status: status,
                    page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
                };
                $("#allList").empty();
                allMsgAjax(-1);
            };
            $(".sysModal").hide();
            counts();
            nums();
        }
    });
};
function findByRdcId(rdcId) {
    $.get(ER.coldroot + '/i/rdc/findRDCByRDCId', {rdcID: rdcId},
        function (data) {
            currentRdc = data[0];
            $("#rdcName").html(data[0].name);
            rootRdcId = data[0].id;
            viewStorage(rootRdcId);
        }
    )
}
function viewStorage(rdcId) {
    localStorage.rdcId = rdcId;
    rdcId = rdcId;
    $.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId', {rdcID: rdcId},
        function (data) {
            if (data && data.length > 0) {
                mystorages = data;
            }
        }
    )
    $(".one").show();
    $(".two").hide();
    $('.searchTop').hide();
};
function searchRdcs() {
    // 超管特殊处理
    if (user.roleid == 3) {
        var rdclists=[];
        $.get(ER.coldroot + '/i/rdc/searchRdc', {type: 1, filter: $("#searchDara_div>input").val()},
            function (data) {
                if (data && data.length > 0) {
                    storages = data;
                    $(".rdcList").empty();
                    $.each(storages,function (i,val) {
                        rdclists.push('<li class="omg" onclick="changeRdc('+val.id+',\''+val.name+'\')"><i class="iconfont">&#xe62f;</i><span>'+val.name+'</span></li>')
                    })

                    $(".rdcList").append(rdclists.join(""));
                    $('.searchTop').show();
                }
            }
        );
    }
};
function changeRdc(id,rdc) {
    rdcId = id;
    $("#rdcName").html(rdc);
    searchContent = "";
    viewStorage(id);
    window.location.reload()
};
function edit() {//编辑
    if (flag) {
        $(this).html("完成");
        $(".editSys,.checkAll").show();
        flag = false;
    } else {
        $(this).html("编辑");
        $(".editSys,.checkAll").hide();
        flag = true;
    }

}

