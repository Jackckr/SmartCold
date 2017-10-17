var queryParams = {audit: 0};
var slrdc;
var editIndex = undefined;
function cellStyler(value, row) {
    return '<button class="btn btn-delete" onclick="deleteConfig(' + row.id + ',0)">删除</button>';
}
var deleteConfig = function (configID) {
    var valType = $("#valType option:selected").val();
    $.messager.confirm('删除确认', '你确认要删除吗?', function (r) {
        if (r) {
            $.get('../../i/storage/deleteConfig', {"configID": configID, 'audit': valType}, function (data) {
                reloaddata();
            });
        }
    });
};

function init_table() {
    var tol = [
        {'iconCls': 'icon_rem', 'handler': '', 'text': '删除'},
        "-", {'iconCls': 'icon-reload', 'handler': 'reloaddata', 'text': '刷新'}, "-"];
    var col = [[
        {field: 'type', title: "类型", width: 80, align: 'center', sortable: true},
        {field: 'addTime', title: 'key', width: 80, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'hand', title: '描述', width: 100, align: 'center', formatter: cellStyler}
    ]];
    initTable("冷库配置信息", "icon-coldcf", "POST", null, queryParams, "#div_tool", null, col, true, onDblClickRow);
}

function onDblClickRow(index, field) {
}
function openWindow() {
    $('#typeForm').window('open');
    $("#opsAudit").html($("#valType").combobox('getText'));
}
function chanrdc(keyword) {
    $.ajax({
        type: 'get', url: '/i/rdc/findRdcList', data: {rows: 20, keyword: keyword}, success: function (data) {
            $("#sel_rdc_slid").combobox("loadData", data);
        }
    });
}
//=======================================================rdcSpider=================================================================
function submitXls() {
    if(!slrdc || slrdc.id==''){
        alert_infomsg('请选择一个rdc后再进行导入配置文件！');
        return false;
    }
    var file = $("#importXls")[0].files[0];
    if(!/\.(?:csv)$/.test(file.name)){
        alert_infomsg('请选择一个后缀名为csv的文件进行导入！');
        return false;
    }
    var formData = new FormData();
    formData.append('xlsFile', file);
    $.ajax({
        url: "/i/spiderConfig/importRdcSpider",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            $("#chooseCol").show();
            $("#dev_name").combobox("loadData", data);
            $("#data_relating").combobox("loadData", data);
        }
    });
}

function loadSpiderTable() {
    var name = $("#dev_name").combobox('getValue');
    var data = $("#data_relating").combobox('getValue');
    var params={nameId: name, dataId: data};
    initSpiderTable('/i/spiderConfig/loadRdcSpider',params);
}

function initSpiderTable(url,params) {
    $("#saveConfig").remove();
    $("#rdcSpiderTable").datagrid({
        title: '列表',
        url: url,
        toolbar: '<button id="saveConfig" class="btn" onclick="saveRdcConfig()">保存配置</button>',
        queryParams:params,
        width: 500,
        remoteSort: true,
        singleSelect: true,
        fitColumns: true,
        onClickRow: onClickRow,
        columns: [[
            {field: 'name', title: '设备名称', width: 80, editor: {type: 'textbox'}},
            {
                field: 'isReader', title: '读写状态', width: 80,
                editor: {
                    type: 'combobox', options: {
                        valueField: "value", textField: "text",
                        data: [{value: 'RW', text: 'RW'}, {value: 'OR', text: 'OR'}]
                    }
                }
            },
            {
                field: 'dataType', title: '数据类型', width: 80, editor: {
                type: 'combobox', options: {
                    valueField: "value", textField: "text",
                    data: [{value: 'INT', text: 'INT'}, {value: 'FLOAT', text: 'FLOAT'}, {value: 'BIT', text: 'BIT'}]
                }
            }
            }
        ]]
    });
}

function init_rdcList() {
    chanrdc();
}

function endEditing() {
    if (editIndex == undefined) {
        return true;
    }
    if ($('#rdcSpiderTable').datagrid('validateRow', editIndex)) {
        $('#rdcSpiderTable').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}

function onClickRow(index) {
    if (editIndex != index) {
        if (endEditing()) {
            $('#rdcSpiderTable').datagrid('selectRow', index)
                .datagrid('beginEdit', index);
            editIndex = index;
        } else {
            $('#rdcSpiderTable').datagrid('selectRow', editIndex);
        }
    }
}

function getRdcSpider(rdcId) {
    $("#chooseCol").hide();
    $.ajax({url:"/i/rdcSpider/getSpiderMapping",type:"post",data:{rdcId:rdcId},success:function (data) {
        if(data&&data!=''){
            initSpiderTable('/i/rdcSpider/getSpiderMapping',{rdcId:rdcId});
        }
    }});
}

function saveRdcConfig() {
    $('#rdcSpiderTable').datagrid('acceptChanges');
    var rows = $('#rdcSpiderTable').datagrid('getRows');
    var rdcConfig = JSON.stringify(rows);
    $.ajax({
        url:"/i/rdcSpider/addOrUpdateSpider",
        type:"post",
        data:{rdcId:slrdc.id,mapping:rdcConfig},
        success:function (data) {
            if(data&&data.status==1){
                alert_infomsg(data.message);
            }else {
                alert_errmsg('保存失败，请重试！');
            }
        }
    });
}
//初始化数据
$().ready(function () {
    init_table();
    init_rdcList();
    $('#sel_rdc_slid').combobox({
        valueField: 'id', textField: 'name', onSelect: function (record) {
            if(!slrdc || record.id!=slrdc.id){
                getRdcSpider(record.id);
                slrdc = record;
            }
        }
    });
});
