var queryParams = {page: null, rows: null, audit: '8', type: null, keyword: null};

function cellStyler(value, row) {
    return '<button class="btn" onclick="changeAudit(' + row.id + ',' + row.audit + ')">审核' +
        '</button><button class="btn btn-info" onclick="setRdcandUser(' + row.id + ')">关联冷库' +
        '</button><button class="btn btn-delete" onclick="goDeleteUser(' + row.id + ')">删除</button>';
}
/*
 * <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-remove'">Remove</a>
 <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'">Save</a>
 * */
$.ajax({type: "GET", cache: false, dataType: 'json', url: '/i/admin/findAdmin'}).success(function (data) {
    var admin = data.entity;
    if (admin == null || admin.id == 0) {
        var url = "http://" + location.host + "/login.html";
        top.location.href = url;
    }
});
var getAudit = function (i) {
    if (i == 0)
        return '待审核';
    else if (i > 0) {
        return '通过';
    } else {
        return '未通过';
    }
};
var userType = function (i) {
    if (i == 0)
        return '基本用户';
    else if (i == 1) {
        return '温度版';
    } else if (i == 2) {
        return '维修版';
    }
};
function delcfm() {
    $.messager.confirm('删除确认', '你确认要删除吗?', function (r) {
        if (!r) {
            return false;
        }
        return true;
    });
}

var goDeleteUser = function (userID) {
    $.messager.confirm('删除确认', '你确认要删除吗?', function (r) {
        if (r) {
            $.ajax({
                type: 'GET',
                url: '../../i/user/deleteUser',
                data: {
                    "userID": userID
                },
                success: function (data) {
                	 reloaddata();
                }
            });
        }
    });
};
var deleteUsers = function () {
    var userID =  getTableChecked();
    if (userID.length > 0) {
        $.messager.confirm('删除确认', '你确认要删除吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '../../i/user/deleteByUserIDs',
                    traditional :true, 
                    data: { userIDs: userID },
                    success: function (data) {
                    	 if(data==1){
                    		 reloaddata();
                         }else{
//                        	 $.messager.("错误","删除失败！");
                         }
                       
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除用户', '您还没有选择用户哦', 'info');
    }

};
var changeAudit = function (id, audit) {
    if (audit == 1) {
        $.messager.alert('审核状态', '已是通过状态了', 'info');
        return false
    };
    $.messager.confirm('通过审核', '你确定要给该用户通过审核？', function(r){
        if(r){
            audit = 1
        }else{
            audit = -1;
        }
        $.post('../../i/user/changeAudit', {'userID': id, 'audit': audit}, function () {
            reloaddata();
        });
    });

};
var setRdcandUser = function () {
    self.parent.addTab("冷库管理", "/sell/viwe/rdcmanage.html", 'icon-cold');
};
function init_table() {
    var tol = [
        {'iconCls': 'icon_rem', 'handler': '', 'text': '删除'},
        "-", {'iconCls': 'icon-reload', 'handler': 'reloaddata', 'text': '刷新'}, "-"];
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'username', title: '用户名', width: 80, align: 'center', sortable: true},
        {field: 'telephone', title: '手机号', width: 80, align: 'center', sortable: true},
        {field: 'type', title: '用户类型', width: 80, align: 'center', sortable: true, formatter: userType},
        {field: 'email', title: '邮箱', width: 80, align: 'center', sortable: true},
        {field: 'addTime', title: '添加时间', width: 80, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'audit', title: '状态', width: 80, align: 'center', sortable: true, formatter: getAudit},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: cellStyler}
    ]];
    initTable("用户管理", "icon-user", "POST", "../../i/user/getUserByFilter", queryParams, "#user_filter", null, col, true, onDblClickRow);
    crspsh();
}

function treeselect(node) {
    if (node != null) {
        if (node.type) {
            queryParams.type = node.type;
            queryParams.stype = null;
        } else if (node.stype) {
            queryParams.type = null;
            queryParams.stype = node.stype;
        }
        reloaddata(queryParams);
    }
}
function onDblClickRow(index, field) {
}


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
    queryParams.startTime = date;
    reloaddata(queryParams);
}

//初始化数据
$().ready(function () {
    init_table();
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
            $('#userForm').dialog('close');
            reloaddata();
            $.messager.progress('close');
        }
    });
});//初始化数据
