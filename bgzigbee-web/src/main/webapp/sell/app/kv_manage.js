var oldkey = undefined,savekey, queryParams = {page: null, rows: null, words: null,issis:null,type:null};
function saveKv() {
    if (! $("#kvForm").form('validate')) {  return;}
    var serializeArray = $("#kvForm").serializeArray();
    var vo={};
    $.each(serializeArray,function (index, val) {
        vo[val.name]=val.value;
    });
    if(vo.id==0){
        $.ajax({url:"/i/storageKeys/saveStorageKeys",data:vo,type:"post",success:function (data) {
            $('#kvdialog').dialog('close');
            alert_infomsg(data.message);
            reloaddata(queryParams);
        }});
    }else {
        $.ajax({url:"/i/storageKeys/updateStorageKeys",data:vo,type:"post",success:function (data) {
            $('#kvdialog').dialog('close');
            alert_infomsg(data.message);
            reloaddata(queryParams);
        }});
    }
}
function ck(id) {
    $('#kvForm').form('clear');
    $('#kvdialog').dialog('open');
    $('#key').validatebox({prompt:'请输入key',required:true,validType:{length:[3,64]}});
    $.ajax({url:"/i/storageKeys/findById",data:{id:id},type:"post",success:function (data) {
        savekey=data.key;
        $('#kvForm').form('load',data);
    }});
}

function isUpdateKey(mark) {
    var key = mark.value;
    if(key!=savekey){
        $('#key').validatebox({prompt:'请输入key',required:true,validType:{length:[3,64],remote:['../../i/storageKeys/checkKey','key'],invalidMessage:'key已存在!'}});
    }else {
        $('#key').validatebox({prompt:'请输入key',required:true,validType:{length:[3,64]}});
    }
}

function del(id) {
    $.messager.confirm('删除确认', '你确认要<er>删除</er>这条信息吗?', function (r) {
        $.ajax({url:"/i/storageKeys/delStorageKey",data:{id:id},type:"post",success:function (data) {
            alert_infomsg("删除成功！");
            reloaddata(queryParams);
        }});
    });
}

//批量删除冷库
function dels() {
    var kvs = getTableCheckedID();
    if (kvs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + kvs.length + '</er>条信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '/i/storageKeys/delStorageKeys',
                    traditional: true,
                    data: {'ids': kvs},
                    success: function (data) {
                        $.messager.alert('提示', "删除成功！", 'info');
                        reloaddata(queryParams);
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除键值', '您还没有选择哦', 'info');
    }
}

function onSelect(node) {
    if (node.type != oldkey) {
        oldkey = node.type;
        queryParams.type=oldkey;
        objTable.datagrid({queryParams:queryParams});
    }
}
function onDblClickRow(index, row) {


}
function col_cellStyler() {


}


/*加载操作按钮*/
function cellStyler(value, row) {
    return '<button class="btn" onclick="ck(' + row.id + ')">修改</button><button class="btn btn-delete" onclick="del(' + row.id + ')">删除</button>';
}
function init_table() {
//	var tool  = [{text:'清除无效设备',iconCls:'dev_del',handler:opendevdialog},{text:'设备充电',iconCls:'dev_replace',handler:opendevdialog},{text:'更换设备',iconCls:'dev_replace',handler:opendevdialog},{text:'刷新',iconCls:'pagination-load',handler:reloaddata}];
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'key', title: 'key', width: 80, align: 'center', sortable: true},
        {field: 'issis', title: '数据类型', width: 80, align: 'center', sortable: true,formatter:getData },
        {field: 'desc', title: '描述', width: 80, align: 'center', sortable: true},
        {field: 'unit', title: '单位', width: 80, align: 'center', sortable: true},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: cellStyler}
    ]];
    objTable = $('#objTable').datagrid({
        url: "../../i/storageKeys/getKeys",
        title: "键值管理",
        iconCls: "dev_mang",
        method: "POST",
        fit: true,
        fitColumns: true,
        remoteSort: false,
        striped: true,
        rownumbers: true,
        toolbar: '#tabl_tool',
        columns: col,
        onLoadError: clearTable,
        onDblClickRow: onDblClickRow
    });
}
function getData(val) {
    return val==0?"采集数据":"分析数据";
}

function initTree(url, onSelect) {
    var types=[{"text":"rdc","value":0}];
    objtree = $('#objtree').tree({url: url, method: 'post', animate: true, lines: true, onSelect: onSelect,loadFilter:function (data) {
        $.each(data,function (index, val) {
           val.text=val.desc;
           types.push({"text": val.desc, "value":val.type});
        });
        $("#type").empty().combobox("loadData", types);
        return data;
    }});
}
function initData() {
    init_table();
    initTree('../../i/spiderConfig/getSetTables', onSelect);
}
$().ready(function () {
    initData();
    $('#sel_issis').combobox({onChange:function(val){ queryParams.issis=val;  objTable.datagrid({queryParams:queryParams});}});
    $('#fddata').searchbox({searcher:function(value){queryParams.words=value;  objTable.datagrid({queryParams:queryParams});}});
});
