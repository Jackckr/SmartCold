var  queryParams={audit:0};

function cellStyler(value,row){
    return '<button class="btn btn-delete" onclick="goDeleteUser('+ row.id+')">删除</button>';
}
function cellType(type){
    if (type == 0)
        return valText = '经营类型';
    else if (type ==1) {
        return valText = '商品存放类型';
    } else if(type==-1) {
        return valText = '温度类型';
    }
}
function delcfm() { if (!confirm("确认要删除？")) { return false; }return true;}
var goDeleteUser = function (userID) {
    if(delcfm()){
        $.ajax({
            type : 'GET',
            url : '../../i/user/deleteUser',
            data : {
                "userID" : userID
            },
            success : function(data) {console.log(data)}
        });
        reloaddata();
    }
};

function init_table(){
    //var sel_type = type;
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        {field:'type',title:valText,width:80,align:'center',sortable:true,formatter:cellType},
        {field:'addTime',title:'添加时间',width:80,align:'center',sortable:true,formatter:tool.col_format},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库配置信息", "icon-coldcf", "POST", "../../i/storage/findRdcConfig", queryParams, "#user_filter", null,col, true, onDblClickRow);
    crspsh();
}

function onDblClickRow(index,field){}


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
    $('#fddata').searchbox({menu: '#mm' });
    $('#seache').appendTo('.datagrid-toolbar');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() != "" && name != "") { objTable.datagrid('reload', {coleam:name,colval:name});}
} //简单查找数据
function chclip(em) {
    $("#seache input[placeholder='请输入搜索条件...']").hide();
    $("#seache span[class='textbox combo']").remove();
    $("#scvlcc").remove();
    $("#seache input[class='textbox-value']").attr("value", "");
    $("#seache input[class='textbox-value']").attr("name", em.id);
    if (em.id == "isread" || em.id == "state" ) {
        var id = "#ch" + em.id;
        var magrlef = '94px';
        var width = '180px';
        var html = '<select id="scvlcc"  style="width: '+width+' ;height:18px;"></select>';
        $("#seache input[placeholder='请输入搜索条件...']").after(html);
        $('#scvlcc').combo({ editable: false });
        $("#scvlcc").next().css({'margin-left': magrlef,  'margin-right': '18px','padding-bottom': '2px'});
        $(id).appendTo($('#scvlcc').combo('panel'));
        $(id + ' span').click(function() {
            $('#scvlcc').combo('setValue', $(this).attr("value")).combo('setText', $(this).text()).combo('hidePanel');
            $("#seache input[class='textbox-value']").attr("name", em.id);
            $("#seache input[class='textbox-value']").attr("value", $(this).attr("value"));
        });
        setTimeout(function(){
            $("span[class='textbox combo']").find("input[type='text']").css({'margin-left':'0px'});
        }, 0);
    } else {
        $("#seache input[placeholder='请输入搜索条件...']").show();
    }
}
function onSelect(date){
    queryParams.startTime=date;
    reloaddata(queryParams);
}
var valText=null;
//初始化数据
$().ready(function() {
    init_table();
    $("#valType").combobox({
        onChange: function (n,o) {
            var valType = $("#valType option:selected").val();
            valText = $("#valType").combobox('getText');
            console.log(valText);
            queryParams.audit = valType;
            reloaddata(queryParams);
        }
    });
});//初始化数据
