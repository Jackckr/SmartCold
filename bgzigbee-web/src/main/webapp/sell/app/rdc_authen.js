var queryParams = {page: null, rows: null, type: null,state: null};
//======================================================================格式化col=======================================================
var col_audit = function (i) { switch(i){case -1:return '未通过';case 0:return '待审核';default: return '通过';}};

function col_cellStyler(value, row) {
	return "";
//	return [
//	        '<button class="btn" onclick="user_audit(' , row.id,',',row.audit,',\'',row.username, '\')">审核</button>' , 
//	        '<button class="btn" onclick="user_level(' , row.id,',',row.level,',\'',row.username,'\')">升/降级</button>' , 
//	        '<button class="btn btn-delete" onclick="goDeleteUser(' , row.id, ',\'',row.username,'\')">删除</button>'
//	        ].join("");
	}

function delAuthen(){
	
}

function updateAuthen(){
	
}
function onDblClickRow(index, field) {}
//======================================================================格式化col=======================================================
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'rdcid', title: '冷库ID', width: 5, align: 'center', sortable: true},
        {field: 'uid', title: '用户ID', width: 5, align: 'center', sortable: true},
        {field: 'img', title: '证书', width: 5, align: 'center', sortable: true},
        {field: 'msg', title: '认证内容', width: 10, align: 'center', sortable: true},
        {field: 'state', title: '状态', width: 5, align: 'center', sortable: true ,formatter: col_audit},
        {field: 'addtime', title: '认证时间', width: 10, align: 'center', sortable: true, formatter: tool.col_format},
//        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: col_cellStyler}
    ]];
    initTable("认证管理", "icon-authe", "POST", "../../i/authen/getAuthRdcList", queryParams, '#user_filter', null, col, true, onDblClickRow);
//    objTable.datagrid({singleSelect: true});//设置为单选
    crspsh();
}

//======================================================================初始化数据=======================================================
//初始化数据
$().ready(function () {
  init_table();
 
});
//======================================================================初始化数据=======================================================

/**
 * 动态组件 无需关心
 */
function crspsh() {
    $('#div_st_filter').append("<div id=\"seache\"style=\"float:right;margin-right:20px;\"><input id=\"fddata\"class=\"easyui-searchbox\" val=\"ml\" data-options=\"prompt:'请输入搜索条件...',searcher:finddatatb\"style=\"width:300px;display:inline;\"></input><div id=\"mm\"style=\"width:100px\" ></div></div>");
    var muits = new Array();
    var fields = $('#objTable').datagrid('getColumnFields');
    for (var i = 0; i < fields.length; i++) {
        var opts = $('#objTable').datagrid('getColumnOption', fields[i]);
        if (opts.field == 'ck' || opts.hidden || opts.field == 'hand') {
            continue;
        }
        muits.push(["<div id='" , fields[i], "' name='" , fields[i] , "'  onclick='chclip(this);' data-options=\"iconCls:'icon-" ,fields[i] , "'\">" , opts.title ,"</div>"].join(""));
    }
    $('#mm').html(String.prototype.concat.apply("", muits));
    $('#fddata').searchbox({menu: '#mm'});
//    $('#seache').appendTo('#div_st_filter');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() == "" || name.trim() == "") {value=null,name=null; } objTable.datagrid('reload', {coleam: name, colval: value});
} //简单查找数据
function chclip(em) {
    $("#seache input[placeholder='请输入搜索条件...']").hide();
    $("#seache span[class='textbox combo']").remove();
    $("#scvlcc").remove();
    $("#seache input[class='textbox-value']").attr("value", "");
    $("#seache input[class='textbox-value']").attr("name", em.id);
    if (em.id == "isread" || em.id == "state") {
        var id = "#ch" + em.id;
        var magrlef = '94px';
        var width = '180px';
        var html = '<select id="scvlcc"  style="width: ' + width + ' ;height:18px;"></select>';
        $("#seache input[placeholder='请输入搜索条件...']").after(html);
        $('#scvlcc').combo({editable: false});
        $("#scvlcc").next().css({'margin-left': magrlef, 'margin-right': '18px', 'padding-bottom': '2px'});
        $(id).appendTo($('#scvlcc').combo('panel'));
        $(id + ' span').click(function () {
            $('#scvlcc').combo('setValue', $(this).attr("value")).combo('setText', $(this).text()).combo('hidePanel');
            $("#seache input[class='textbox-value']").attr("name", em.id);
            $("#seache input[class='textbox-value']").attr("value", $(this).attr("value"));
        });
        setTimeout(function () {
            $("span[class='textbox combo']").find("input[type='text']").css({'margin-left': '0px'});
        }, 0);
    } else {
        $("#seache input[placeholder='请输入搜索条件...']").show();
    }
}
