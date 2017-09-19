var queryParams = {page: null, rows: null, role: null, words: null};
//======================================================================格式化col=======================================================
var col_userType = function (i) {
    switch (i) {
        case 0:
            return '门店用户';
        case 1:
            return '区域经理';
        case 2:
            return '集团用户';
    }
};
function col_cellStyler(value, row) {
    return [
        '<button class="btn" onclick="user_level(', row.id, ',', row.role, ',\'', row.username, '\')">升/降级</button>',
        '<button class="btn btn-delete" onclick="goDeleteUser(', row.id, ',\'', row.username, '\')">删除</button>'
    ].join("");
}

//======================================================================菜单事件function=======================================================
//删除单个用户
var goDeleteUser = function (uid, username) {
    $.messager.confirm('删除确认', '你确认要<er>删除</er>用户<er>' + username + '</er>吗?', function (r) {
        if (r) {
            $.ajax({
                type: 'GET',
                url: '../../i/userStore/deleteUser',
                data: {"userID": uid},
                success: function (data) {
                    reloaddata();
                }
            });
        }
    });
};
//批量删除用户
var deleteUsers = function () {
    var userIDs = getTableCheckedID();
    if (userIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + userIDs.length + '</er>条用户信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '../../i/userStore/deleteByUserIDs',
                    traditional: true,
                    data: {userIDs: userIDs},
                    success: function (data) {
                        if (data.status == 1) {
                            reloaddata();
                        } else {
                            $.messager.alert('错误', '删除用户失败！', 'error');
                        }
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除用户', '您还没有选择用户哦', 'info');
    }

};
//添加用户
function adduser(ioc, tit) {
    $('#userForm').form('clear');
    $("#user_id").val(0);
    $("#rad_type_0,#read_audit_1").click();
    $('#input_userpwd').validatebox({required: true});
    $('#username').validatebox({
        prompt: '请输入用户名',
        required: true,
        validType: {length: [3, 16], remote: ['../../i/userStore/vistUserName', 'username']}
    });
    $('#userdialog').dialog({title: '添加用户信息', iconCls: 'user_add', closed: false});
}
//tool
function edituser() {
    var selusers = getTableChecked();
    if (selusers.length > 0) {
        var user = selusers[0];
        user.password = null;
        editByuser(user);
    } else {
        alert_infomsg("请选择一个用户进行操作");
    }
}
//保存用户
function saveUser() {
    var userfrom = $('#userForm');
    if (!userfrom.form('validate')) {
        return;
    }
    var data = $('#userForm').serialize();
    $.ajax({
        type: 'POST', url: '../../i/userStore/addorupdateUser', data: data,
        success: function (data) {
            if (data.status == 0) {
                $('#userdialog').dialog({closed: true});
                reloaddata();
            }
        }
    });
}
//编辑用户
function editByuser(user) {
    $('#userForm').form('clear');
    $('#input_userpwd').validatebox({required: false});
    $('#username').validatebox({prompt: '请输入用户名', required: true, validType: {length: [3, 16]}});
    $('#userForm').form('load', user);
    $('#userdialog').dialog({title: '修改用户信息', iconCls: 'user_edit', closed: false});
}
//=====================修改审核状态===============================
function user_audit(id, audit, username) {
    $("#user_auditForm").form('load', {id: id, oldaudit: audit, audit: audit, username: username});
    $('#user_auditdialog').dialog({closed: false});
}
function user_upaudit() {
    $('#user_auditdialog').dialog({closed: true});
    var id = $("#user_auditForm input[name='id']").val(), oldaudit = $("#user_auditForm input[name='oldaudit']").val(),
        audit = $("#user_auditForm input[name='audit']:checked").val();
    if (oldaudit != audit && id != "") {
        $.post('../../i/user/changeAudit', {'userID': id, 'audit': audit}, function () {
            reloaddata();
        });
    }
}
//=====================修改用户级别===============================
function user_level(id, level, username) {
    $("#user_levelForm").form('load', {id: id, level: level, oldlevel: level, username: username});
    $('#user_leveldialog').dialog({closed: false});
}
function user_uplevel() {
    $('#user_leveldialog').dialog({closed: true});
    var id = $("#user_levelForm input[name='id']").val(), oldlevel = $("#user_levelForm input[name='oldlevel']").val(),
        level = $("#user_levelForm input[name='level']:checked").val();
    if (level != oldlevel && id != "") {
        $.post('../../i/userStore/changeRole', {'userID': id, 'role': level}, function () {
            reloaddata();
        });
    }
}


function onDblClickRow(index, field) {
    editByuser(field);
}//双击编辑用户信息
//======================================================================格式化col=======================================================
function init_table() {
//	var fottol  ={buttons: [{text:'添加用户',iconCls:'user_add',handler:adduser},{text:'编辑用户',iconCls:'user_edit',handler:edituser},{text:'删除用户',iconCls:'user_del',handler:deleteUsers},"-"]};
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'username', title: '用户名', width: 80, align: 'center', sortable: true},
        {field: 'telephone', title: '手机号', width: 80, align: 'center', sortable: true},
        {field: 'email', title: '邮箱', width: 80, align: 'center', sortable: true},
        {field: 'role', title: '用户类型', width: 80, align: 'center', sortable: true, formatter: col_userType},
        {field: 'addTime', title: '添加时间', width: 80, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: col_cellStyler}
    ]];
    initTable("用户管理", "icon-user", "POST", "../../i/userStore/getUserByFilter", queryParams, '#user_filter', null, col, true, onDblClickRow);
//    objTable.datagrid({singleSelect: true});//设置为单选
    crspsh();
}

//======================================================================初始化数据=======================================================
//初始化数据
$().ready(function () {
    init_table();
    $('#sel_user_type').combobox({
        onChange: function (val) {
            queryParams.role = val;
            reloaddata(queryParams);
        }
    });
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
        if (opts.field == 'ck' || opts.field == 'id' || opts.hidden || opts.field == 'hand') {
            continue;
        }
        muits.push("<div id='" + fields[i] + "' name='" + fields[i] + "'  onclick='chclip(this);' data-options=\"iconCls:'icon-" + fields[i] + "'\">" + opts.title + "</div>");
    }
    $('#mm').html(String.prototype.concat.apply("", muits));
    $('#fddata').searchbox({menu: '#mm'});
//    $('#seache').appendTo('#div_st_filter');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() == "" || name.trim() == "") {
        value = null, name = null;
    }
    queryParams.words=value;
    reloaddata(queryParams);
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
