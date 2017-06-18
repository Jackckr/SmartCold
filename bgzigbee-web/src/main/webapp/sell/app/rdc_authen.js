var queryParams = {page: null, rows: null, type: null,state: null};
//======================================================================格式化col=======================================================
var rdc_auth_state = function (i) { switch(i){case -1:return '未通过';case 0:return '待审核';default: return '通过';}};
var rdc_auth_type = function (i) { switch(i){case 0:return '平台/360用户';case 1:return '货主认证';default: return '维修商认证';}};
function col_cellStyler(value, row) {
	if(row.type==0){return ['<button class="btn" onclick="updaterdcAuthen(' , row.id,',',row.ishandle,',',row.state,',',row.rdcid,',',row.uid ,',\'',row.note,'\')">',row.ishandle==0?'审核':'查看','</button>'  ].join("");}else{return '<button class="btn btn-delete" title="当前认证由冷库主操作，您禁止操作！">无权</button>';}
}

function onDblClickRow(index, field) {
	updaterdcAuthen(field.id,field.ishandle,field.state,field.rdcid,field.uid,field.note);
}
function updaterdcAuthen(id,ishandle,state,rdcId,authUserId,note){
	var but=[];
	$('#rdc_state_auditForm').form('clear');
	$('#rdc_state_auditForm').form('load',{id:id,oldstate:state,ishandle:ishandle,oldishandle:ishandle,state:state,rdcId:rdcId,authUserId:authUserId,note:note,oldnote:note});
	if(ishandle==0){but.push({text:'提交',iconCls:'icon-ok',handler:user_upaudit});}
	but.push({text:'取消',iconCls:'icon-cancel2',handler:function(){$('#rdc_state_authendialog').dialog({closed: true});}});
	$('#rdc_state_authendialog').dialog({closed: false,buttons: but});
}
function user_upaudit(){
	$('#rdc_state_authendialog').dialog({closed: true});
    var obj=   getFormData('#rdc_state_auditForm');
    if(obj.id!=""){
    		if(obj.oldstate!=obj.state&&obj.state==1){
    			if(!obj.rdcId&&obj.authUserId){
    				$.post('../../i/authen/authRdc', {'rdcId': obj.rdcId, 'authUserId': obj.authUserId});//修改
    			}
    		}
			if(obj.ishandle!=1||obj.oldstate!=obj.state||obj.oldnote!=obj.note){
			    $.post('../../i/authen/updateAuthstate', {'id': obj.id, 'ishandle': 1,state:obj.oldstate!=obj.state?obj.state:null,note:obj.note});//修改
			    reloaddata();
			}
    }
}



//======================================================================格式化col=======================================================
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'rdcid', title: '冷库ID', width: 2, align: 'center', sortable: true},
        {field: 'uid', title: '用户ID', width: 2, align: 'center', sortable: true},
        {field: 'imgurl', title: '证书', width: 5, align: 'center', sortable: true,formatter: tool.col_img},
        {field: 'type', title: '认证类型', width: 5, align: 'center', sortable: true ,formatter: rdc_auth_type},
        {field: 'ishandle', title: '处理状态', width: 5, align: 'center', sortable: true ,formatter: tool.col_isdeal},
        {field: 'state', title: '审核状态', width: 5, align: 'center', sortable: true ,formatter: rdc_auth_state},
        {field: 'msg', title: '认证内容', width: 10, align: 'center', sortable: true},
        {field: 'note', title: '备注', width: 5, align: 'center', sortable: true },
        {field: 'addtime', title: '认证时间', width: 5, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'hand', title: '操作', width: 5, align: 'center', formatter: col_cellStyler}
    ]];
    initTable("认证审核", "icon-authe", "POST", "../../i/authen/getAuthRdcList", queryParams, '#div_filter', null, col, true, onDblClickRow);
    crspsh();
}

//======================================================================初始化数据=======================================================
//初始化数据
$().ready(function () {
  init_table();
   $("#sel_auth_type").combobox({value:"", onChange:function(val){  queryParams.type=val;   reloaddata(queryParams);}  }); 
   $("#sel_auth_state").combobox({value:"0", onChange:function(val){  queryParams.state=val;   reloaddata(queryParams);}  }); 
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
        var id = "#ch" + em.id, magrlef = '94px', width = '180px',html = '<select id="scvlcc"  style="width: ' + width + ' ;height:18px;"></select>';
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
