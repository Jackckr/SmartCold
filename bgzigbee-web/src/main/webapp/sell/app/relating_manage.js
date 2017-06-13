var  queryParams={type:null,stauts:null,startTime:null, endTime:null,keyword:null};


function getRdcAttr(value) {
    if (value!=undefined){
        return value.name;
    }else {
        return "暂无";
    }
}

function cellStyler(value,row){
    return '<button class="btn" onclick="ck('+ row.id+')">查看</button><button class="btn btn-delete" onclick="dl('+ row.id+')">删除</button>';
}

function init_table(){
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        { field:'ck',checkbox:true},
        {field:'id',title:'ID',sortable:true},
        {field:'rdcEntity',title:'冷库名称',width:80,align:'center',sortable:true,formatter:getRdcAttr},
        {field:'title',title:'标题',width:80,align:'center',sortable:true},
        {field:'note',title:'内容',width:80,align:'center',sortable:true},
        {field:'stauts',title:'状态',width:80,align:'center',sortable:true,formatter:isStauts},
        {field:'typeText',title:'共享类型',width:40,align:'center',sortable:true},
        {field:'telephone',title:'联系电话',width:40,align:'center',sortable:true},
        {field:'detlAddress', title:'出发地-目的地',width:40,align:'center',sortable:true},
        {field:'updatetime',title:'更新时间',width:40,align:'center',sortable:true,formatter:tool.col_format},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库信息共享","icon-msgType", "POST", "../../i/rdcShareInfo/getRdcShareInfo", queryParams,"#div_filteri",null, col,true, onDblClickRow);

}

function onDblClickRow(index,field){
    ck(field.id);
}

/**
 * 动态组件 无需关心
 */
function crspsh() {
    $('.datagrid-toolbar').append("<div id=\"seache\"style=\"margin-top:-24px;float:right;margin-right:20px;\"><input id=\"fddata\"class=\"easyui-searchbox\" val=\"ml\" data-options=\"prompt:'请输入搜索条件...',searcher:finddatatb\"style=\"width:300px;display:inline;\"></input><div id=\"mm\"style=\"width:100px\" ></div></div>");
    var muits = new Array();
    var fields = $('#objTable').datagrid('getColumnFields');
    for (var i = 0; i < fields.length; i++) {
        var opts = $('#objTable').datagrid('getColumnOption', fields[i]);
        if (opts.field == 'ck' || opts.hidden || opts.field == 'hand') {
            continue;
        }
        muits.push("<div id='" + fields[i] + "' name='" + fields[i] + "'  onclick='chclip(this);' data-options=\"iconCls:'icon-" + fields[i] + "'\">" + opts.title + "</div>");
    }
    $('#mm').html(String.prototype.concat.apply("", muits));
    $('#fddata').searchbox({menu: '#mm' });
    $('#seache').appendTo('.datagrid-toolbar');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() != "" && name != "") { objTable.datagrid('reload', {coleam:name,colval:name});}
} //简单查找数据
function chclip(em) {
    $("#seache input[placeholder='请输入搜索条件...']").hide();
    $("#seache span[class='textbox combo']").remove();
    $("#scvlcc").remove();
    $("#seache input[class='textbox-value']").attr("value", "");
    $("#seache input[class='textbox-value']").attr("name", em.id);
    if (em.id == "isread" || em.id == "state" ) {
        var id = "#ch" + em.id;
        var magrlef = '94px';
        var width = '180px';
        var html = '<select id="scvlcc"  style="width: '+width+' ;height:18px;"></select>';
        $("#seache input[placeholder='请输入搜索条件...']").after(html);
        $('#scvlcc').combo({ editable: false });
        $("#scvlcc").next().css({'margin-left': magrlef,  'margin-right': '18px','padding-bottom': '2px'});
        $(id).appendTo($('#scvlcc').combo('panel'));
        $(id + ' span').click(function() {
            $('#scvlcc').combo('setValue', $(this).attr("value")).combo('setText', $(this).text()).combo('hidePanel');
            $("#seache input[class='textbox-value']").attr("name", em.id);
            $("#seache input[class='textbox-value']").attr("value", $(this).attr("value"));
        });
        setTimeout(function(){
            $("span[class='textbox combo']").find("input[type='text']").css({'margin-left':'0px'});
        }, 0);
    } else {
        $("#seache input[placeholder='请输入搜索条件...']").show();
    }
}
/*function startTime(date){
 queryParams.startTime=date;
 reloaddata(queryParams);
 }
 function endTime(date){
 queryParams.endTime=date;
 reloaddata(queryParams);
 }*/
function searchData() {
    queryParams.startTime=$("#startTime").val();
    queryParams.endTime=$("#endTime").val();
    queryParams.type=$("#sel_type option:selected").val();
    queryParams.stauts=$("#sel_stauts option:selected").val();
    queryParams.keyword=$("#search").val();
    reloaddata(queryParams);
}
function getRdcAttr(value) {
    if (value){
        return value.name;
    }else {
        return "暂无";
    }
}
function isStauts(value) {
    if(value==1){
        return "有效";
    }else {
        return "无效";
    }
}
/*批量删除*/
function delRdcShares() {
    var rdcShares = getTableCheckedID();
    if (rdcShares.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + rdcShares.length + '</er>条冷库共享信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '/i/rdcShareInfo/delRdcShareInfoByIds',
                    traditional: true,
                    data: {'rdcShares': rdcShares},
                    success: function (data) {
                        if (data.status == 0) {
                            reloaddata();
                        } else {
                            $.messager.alert('错误', '删除冷库共享信息失败！', 'error');
                        }
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除冷库共享信息', '您还没有选择冷库共享信息哦', 'info');
    }
}
/*查看冷库共享详细信息*/
function ck(id) {
    $.ajax({
        url:"/i/rdcShareInfo/getRdcShareInfoById",
        type:"post",
        data:{"id":id},
        dataType:"json",
        success:function (data) {
            $("#share_title").html(data.title!=undefined?data.title:"");
            $("#share_coldName").html(data.rdcEntity!=undefined?data.rdcEntity.name:"");
            $("#share_type").html(data.typeText!=undefined?data.typeText:"");
            $("#validStartTime").html(data.validStartTime!=undefined?data.validStartTime:"");
            $("#validEndTime").html(data.validEndTime!=undefined?data.validEndTime:"");
            $("#share_address").html(data.detlAddress!=undefined?data.detlAddress:"");
            $("#share_filings").html(data.bookings!=undefined?data.bookings:"");
            $("#share_phone").html(data.telephone!=undefined?data.telephone:"");
            $("#share_note").html(data.note!=undefined?data.note:"");
        }
    })
    $('#showShareInfo').dialog('open');
}
function dl(id) {
    var flag = confirm("确认删除？");
    if(!flag){return;}
    $.ajax({
        url:"/i/rdcShareInfo/delRdcShareInfoById",
        type:"post",
        data:{"id":id},
        success:function () {
            reloaddata(queryParams);
        }
    });
}
//初始化数据
$().ready(function() {
    init_table();
    /*$("#sel_type").combobox({
     onSelect: function(date){
     var val =date.value;
     queryParams.type=val;
     reloaddata(queryParams);
     }
     });*/
});//初始化数据
