/*过滤参数*/
var queryParams = {keyword: null};


/*加载操作按钮*/
function cellStyler(value, row) {
    return '<button class="btn" onclick="ck(' + row.id + ')">修改</button><button class="btn btn-delete" onclick="del(' + row.id + ')">删除</button>';
}
/*初始化表格*/
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'name', title: '企业名称', width: 80, align: 'center', sortable: true},
        {field: 'address', title: '企业地址', width: 80, align: 'center', sortable: true},
        {field: 'addtime', title: '添加时间', width: 40, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: cellStyler}
    ]];
    initTable("集团管理","icon-cold", "POST", "../../i/company/newFindCompanyList", queryParams,"#div_filteri",null, col,true, onDblClickRow);


}
//双击编辑用户信息
function onDblClickRow(index, field) {
    ck(field.id);
}




/*刷新*/
function refresh() {
    $('#fddata').searchbox('setValue', '');
    queryParams.keyword="";
    $("#sel_audit").combobox({value:"8"});
    queryParams.audit="";
    reloaddata();
}


function sh(id, name, audit) {

}

function stand(id, name, stand) {

}

function rdc_upstand() {

}

/*添加集团*/
function addCold() {
    $("#companyButton").html("添加集团");
    $('#addCompany').panel({title: "添加集团"});
    $('#submitCompany').form('clear');
    $("#companyButton").attr("onclick", "addCompanySubmit()");
    $('#addCompany').dialog('open');
}

/*集团修改*/
function ck(id) {
    $("#companyButton").html("修改集团");
    $("#companyButton").attr("onclick", "updateCompanySubmit()");
    $('#addCompany').panel({title: "修改集团"});
    $('#submitCompany').form('clear');
    $.ajax({
        url:"/i/company/findCompanyById",
        data:{"companyId":id},
        type:"post",
        success:function (data) {
            $("#submitCompany").form("load",data);
        }
    });
    $('#addCompany').dialog('open');
}

/*提交添加集团信息*/
function addCompanySubmit() {
    var arr = $("#submitCompany").serializeArray();
    var vo={};
    $.each(arr,function (index,item) {
       vo[item.name]=item.value;
    });
    if(validate(vo)){
        $.ajax({
            url:"/i/company/addCompany",
            data:vo,
            type:"get",
            success:function (data) {
                alert_infomsg("添加成功！");
                $('#addCompany').dialog('close');
                reloaddata();
            }
        });
    }
}

/*提交修改集团信息*/
function updateCompanySubmit() {
    var serializeArray = $("#submitCompany").serializeArray();
    var vo={};
    $.each(serializeArray,function (index,item) {
       vo[item.name]=item.value;
    });
    $.ajax({
        url:"/i/company/updateCompanyById",
        data:vo,
        type:"post",
        success:function (data) {
            alert_infomsg(data.message);
            $('#addCompany').dialog('close');
            reloaddata();
        }
    });
}

/*验证*/
function validate(vo) {
    if(vo.name.trim()==""){
        alert_errmsg("企业名称不能为空！");
        return false;
    }
    if(vo.address.trim()==""){
        alert_errmsg("企业地址不能为空！");
        return false;
    }
    return true;
}
//删除集团
function del(id) {
    $.messager.confirm('删除确认', '你确认要<er>删除</er>这条集团信息吗?',function (r) {
       if(r){
           $.ajax({
               type: 'get',
               url: '../../i/company/deleteCompany',
               traditional: true,
               data: {'companyID': id},
               success: function (data) {
                   $.messager.alert('提示','删除成功！', 'info');
                   reloaddata();
               }
           });
       }
    });
}

//批量删除集团
function dels() {
    var companyIDs = getTableCheckedID();
    if (companyIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + companyIDs.length + '</er>条集团信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'post',
                    url: '../../i/company/deleteByCompanyIDs',
                    traditional: true,
                    data: {'companyIDs': companyIDs},
                    success: function (data) {
                        $.messager.alert('提示','删除成功！', 'info');
                        reloaddata();
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除集团', '您还没有选择集团哦', 'info');
    }
}

$().ready(function () {
    init_table();
    $('#fddata').searchbox({searcher:function(value){queryParams.keyword=value;  reloaddata(queryParams);}});
});//初始化数据
