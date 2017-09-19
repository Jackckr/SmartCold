/*过滤参数*/
var queryParams = {keyword: null};
var saveName="";

/*加载操作按钮*/
function cellStyler(value, row) {
    return '<button class="btn" onclick="ck(' + row.id + ')">修改</button><button class="btn btn-delete" onclick="del(' + row.id + ')">删除</button>';
}
/*初始化表格*/
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'name', title: '门店名称', width: 80, align: 'center', sortable: true},
        {field: 'address', title: '门店地址', width: 80, align: 'center', sortable: true},
        {field: 'addtime', title: '添加时间', width: 80, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: cellStyler}
    ]];
    initTable("集团管理", "icon-cold", "POST", "../../i/store/findByFilter", queryParams, "#div_filteri", null, col, true, onDblClickRow);
}
//双击编辑用户信息
function onDblClickRow(index, field) {
    ck(field.id);
}

/*刷新*/
function refresh() {
    $('#fddata').searchbox('setValue', '');
    queryParams.keyword = "";
    $("#sel_audit").combobox({value: "8"});
    queryParams.audit = "";
    reloaddata();
}


function sh(id, name, audit) {

}

function stand(id, name, stand) {

}

function rdc_upstand() {

}

/*添加门店*/
function addCold() {
    saveName="";
    $('#storeForm').form('clear');
    $("#storeButton").html("添加门店");
    $('#addStore').panel({title: "添加门店"});
    $('#name').validatebox({prompt:'请输入用户名',required:true,validType:{length:[3,16],remote:['../../i/store/checkStoreName','name'],invalidMessage:'店名已存在!'}});
    $('#submitStore').form('clear');
    $("#store_id").val(0);
    $("#storeButton").attr("onclick", "addStoreSubmit()");
    $('#addStore').dialog('open');
}

/*门店修改*/
function ck(id) {
    $('#addStore').panel({title: "修改门店"});
    $('#name').validatebox({prompt:'请输入用户名',required:true,validType:{length:[3,16]}});
    $('#storeForm').form('clear');
    $.ajax({
        url: "/i/store/findStoreById",
        data: {"storeId": id},
        type: "post",
        success: function (data) {
            saveName=data.name;
            $("#storeForm").form("load", data);
        }
    });
    $('#addStore').dialog('open');
}

/*提交添加集团信息*/
function saveStore() {
    if (!$("#storeForm").form('validate')){return;}
    var arr = $("#storeForm").serialize();
    $.ajax({
        url: "/i/store/addUpdateStore",
        data: arr,
        type: "post",
        success: function (data) {
            alert_infomsg("添加成功！");
            $('#addStore').dialog('close');
            reloaddata();
        }
    });
}

/*验证*/
function validate(vo) {
    if (vo.name.trim() == "") {
        alert_errmsg("企业名称不能为空！");
        return false;
    }
    if (vo.address.trim() == "") {
        alert_errmsg("企业地址不能为空！");
        return false;
    }
    if (vo.email.trim() == "") {
        alert_errmsg("企业邮箱不能为空！");
        return false;
    }
    if (vo.principal.trim() == "") {
        alert_errmsg("企业负责人不能为空！");
        return false;
    }
    if (vo.telephone.trim() == "") {
        alert_errmsg("企业电话不能为空！");
        return false;
    }
    var phoneNumRex = /^1[34578]\d{9}$/;
    var cellPhoneRex = /^0{1}\d{2,3}-{1}\d{7,8}$/;
    var emailRex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if (!phoneNumRex.test(vo.telephone) && !cellPhoneRex.test(vo.telephone)) {
        alert_errmsg("联系电话输入有误！(座机如：021-67189203)");
        return false;
    }
    if (!emailRex.test(vo.email)) {
        alert_errmsg("邮箱格式不正确！");
        return false;
    }
    return true;
}
//删除门店
function del(id) {
    $.messager.confirm('删除确认', '你确认要<er>删除</er>这条门店信息吗?', function (r) {
        if (r) {
            $.ajax({
                type: 'get',
                url: '../../i/store/delById',
                traditional: true,
                data: {'storeId': id},
                success: function (data) {
                    $.messager.alert('提示', '删除成功！', 'info');
                    reloaddata();
                }
            });
        }
    });
}

function changeName(mark) {
    if($(mark).val().trim()==saveName){
        $('#name').validatebox({prompt:'请输入用户名',required:true,validType:{length:[3,16]}});
    }else {
        $('#name').validatebox({prompt:'请输入用户名',required:true,validType:{length:[3,16],remote:['../../i/store/checkStoreName','name'],invalidMessage:'店名已存在!'}});
    }
}

//批量删除门店
function dels() {
    var storeIDs = getTableCheckedID();
    if (storeIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + storeIDs.length + '</er>条门店信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'post',
                    url: '../../i/store/delByIds',
                    traditional: true,
                    data: {'storeIds': storeIDs},
                    success: function (data) {
                        $.messager.alert('提示', '删除成功！', 'info');
                        reloaddata();
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除门店', '您还没有选择门店哦', 'info');
    }
}

$().ready(function () {
    init_table();
    $('#fddata').searchbox({
        searcher: function (value) {
            queryParams.keyword = value;
            reloaddata(queryParams);
        }
    });
});//初始化数据

