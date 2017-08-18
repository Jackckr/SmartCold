var  queryParams={audit:0};

function cellStyler(value,row){
    return '<button class="btn btn-delete" onclick="deleteConfig('+ row.id+',0)">删除</button>';
}
var deleteConfig = function (configID) {
    var valType = $("#valType option:selected").val();
    $.messager.confirm('删除确认', '你确认要删除吗?', function (r) {
        if (r) {
            $.get('../../i/storage/deleteConfig',{"configID": configID,'audit': valType},function(data){
                reloaddata();
            })
        }
    });
};

function init_table(){
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        {field:'type',title:"类型",width:80,align:'center',sortable:true},
        {field:'addTime',title:'key',width:80,align:'center',sortable:true,formatter:tool.col_format},
        {field:'hand',title:'描述',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库配置信息", "icon-coldcf", "POST", null, queryParams, "#div_tool",null,col, true, onDblClickRow);
}

function onDblClickRow(index,field){}
function openWindow() {
    $('#typeForm').window('open');
    $("#opsAudit").html($("#valType").combobox('getText'))
}
//初始化数据
$().ready(function() {
    init_table();
});
