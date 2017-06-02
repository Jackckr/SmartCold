var queryParams = {page: null, rows: null, audit: null, type: null, keyword: null};



//======================================================================格式化col=======================================================
var col_audit = function (i) { switch(i){case -1:return '未通过';case 0:return '待审核';default: return '通过';}};
var col_userType = function (i) {switch(i){case 0:return '平台用户';case 1:return '货主用户';case 2: return '服务商';}};
function col_cellStyler(value, row) {return ['<button class="btn" onclick="changeAudit(' , row.id ,',' , row.audit , ')">审核</button>' , '<button class="btn btn-info" onclick="setRdcandUser(' ,+ row.id ,')">关联冷库</button>' ,'<button class="btn btn-delete" onclick="goDeleteUser(' , row.id, ',\'',row.username,'\')">删除</button>'].join("");}
//======================================================================菜单事件function=======================================================
//
var setRdcandUser = function () { self.parent.addTab("冷库管理", "/sell/viwe/rdcmanage.html", 'icon-cold');};
//删除单个用户
var goDeleteUser = function (uid,username) {
    $.messager.confirm('删除确认', '你确认要<er>删除'+username+'</er>吗?', function (r) {if (r) {$.ajax({ type: 'GET', url: '../../i/user/deleteUser',data: {"userID": uid }, success: function (data) {reloaddata(); }}); }});
};
//批量删除用户
var deleteUsers = function () {
    var userIDs =  getTableCheckedID();
    if (userIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>'+userIDs.length+'</er>条用户信息吗?', function (r) {
            if (r) {  $.ajax({  type: 'POST', url: '../../i/user/deleteByUserIDs', traditional :true,  data: { userIDs: userIDs },success: function (data) { if(data.status==1){ reloaddata();}else{ $.messager.alert('错误', '删除用户失败！', 'error'); } }}); }
        });
    } else {  $.messager.alert('删除用户', '您还没有选择用户哦', 'info'); }

};
var changeAudit = function (id, audit) {
    if (audit == 1) { $.messager.alert('审核状态', '已是通过状态了', 'info'); return false;};
    $.messager.confirm('通过审核', '你确定要给该用户通过审核？', function(r){var audit =  r?1:-1; $.post('../../i/user/changeAudit', {'userID': id, 'audit': audit}, function () { reloaddata();});});
};

function adduser(ioc,tit){
	$("$input_userpwd").
	$('#userForm').form('clear');
	$('#userdialog').dialog({title:tit,iconCls:ioc,closed: false});
}
function edituser(ioc,tit){
	var selusers=getTableChecked();
	if(selusers.length>0){
		var user=selusers[0];
		user.password=null;
		editByuser(ioc, tit, user);
	}else{
		 alert_infomsg("请选择一个用户进行操作");
	}
}

function editByuser(ioc,tit,user){
	$('#userForm').form('load',user);
	$('#userdialog').dialog({title:tit,iconCls:ioc,closed: false});
}

function saveUser(){
	$('#userdialog').dialog('close');
}



function onDblClickRow(index, field) {
	$('#userForm').form('clear');
	$('#userForm').form('load',{
		name:'myname',
		email:'mymail@gmail.com',
		subject:'subject',
		message:'message',
		language:'en'
	});
}
//======================================================================格式化col=======================================================
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'username', title: '用户名', width: 80, align: 'center', sortable: true},
        {field: 'telephone', title: '手机号', width: 80, align: 'center', sortable: true},
        {field: 'type', title: '用户类型', width: 80, align: 'center', sortable: true, formatter: col_userType},
        {field: 'email', title: '邮箱', width: 80, align: 'center', sortable: true},
        {field: 'addTime', title: '添加时间', width: 80, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'audit', title: '状态', width: 80, align: 'center', sortable: true, formatter: col_audit},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: col_cellStyler}
    ]];
    initTable("用户管理", "icon-user", "POST", "../../i/user/getUserByFilter", queryParams, "#user_filter", null, col, true, onDblClickRow);
//    objTable.datagrid({singleSelect: true});//设置为单选
    crspsh();
}

function init_add_user(){
	$('#userForm').form({
        url: '../../i/user/addUser',
        onSubmit: function () {
            $.messager.progress();
            var isValid = $(this).form('validate');
            if (!isValid) {
                $.messager.progress('close');
            }
            return isValid;
        },
        success: function (data) {
            $('#userForm').window('close');
            reloaddata();
            $.messager.progress('close');
        }
    });
}
//======================================================================初始化数据=======================================================
//初始化数据
$().ready(function () {
  init_table();
  init_add_user();
});
//======================================================================初始化数据=======================================================

//<tr>
//<td><input type="button" value="提交" onclick="" class="btn btn-info" style="width: 150px;"></td>
//<td style="text-align: right;"><input type="button" value="取消" onclick="$('#userForm').window('close')" class="btn" style="width: 150px;"></td>
//</tr>


function submitForm(){$('#userForm').submit();}
function clearForm(){$('#userForm').window('close');}
//function adduser(){$("#add_user_dig").dialog('open');}
/**
 * 动态组件 无需关心
 */
function crspsh() {
    $('.datagrid-toolbar').append("<div id=\"seache\"style=\"float:right;margin-right:20px;\"><input id=\"fddata\"class=\"easyui-searchbox\" val=\"ml\" data-options=\"prompt:'请输入搜索条件...',searcher:finddatatb\"style=\"width:300px;display:inline;\"></input><div id=\"mm\"style=\"width:100px\" ></div></div>");
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
    $('#fddata').searchbox({menu: '#mm'});
    $('#seache').appendTo('.datagrid-toolbar');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() != "" && name != "") {
        objTable.datagrid('reload', {coleam: name, colval: name});
    }
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
function onSelect(date) {
    queryParams.startTime = date; reloaddata(queryParams);
}
