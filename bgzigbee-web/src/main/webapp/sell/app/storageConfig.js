var  queryParams={audit:0};

function cellStyler(value,row){
    return '<button class="btn btn-delete" onclick="deleteConfig('+ row.id+',0)">删除</button>';
}
function delcfm() { if (!confirm("确认要删除？")) { return false; }return true;}
var deleteConfig = function (configID) {
    if(delcfm()){
        $.get('../../i/storage/deleteConfig',{"configID": configID,'audit': 0},function(data){
            /*for(var i=0;i<$scope.configs.length;i++)
            {
                if($scope.configs[i].id==configID)
                {
                    $scope.configs.splice(i,2);
                }
            }*/
        })
    }
}

function init_table(){
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        {field:'type',title:"类型",width:80,align:'center',sortable:true},
        {field:'addTime',title:'添加时间',width:80,align:'center',sortable:true,formatter:tool.col_format},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库配置信息", "icon-coldcf", "POST", "../../i/storage/findRdcConfig", queryParams, "#div_tool",null,col, true, onDblClickRow);
    //crspsh();
}

function onDblClickRow(index,field){}


/**
 * 动态组件 无需关心
 */

function onSelect(date){
    queryParams.startTime=date;
    reloaddata(queryParams);
}
//初始化数据
$().ready(function() {
    init_table();
    $("#valType").combobox({
        onChange: function (n,o) {
            var valType = $("#valType option:selected").val();
            queryParams.audit = valType;
            reloaddata(queryParams);
        }
    });
});//初始化数据
