var  queryParams={audit:null,keyword:null};


function getRdcAudit(value) {
    if (value == 0)
        return '待审核';
    else if (value == 1) {
        return '通过';
    }else if (value == 2) {
        return '已认证';
    } else if (value==-1){
        return '未通过';
    }
}

function cellStyler(value,row){
    return '<a href="javascript:void(0)" onclick="ck('+ row.id+')">[修改]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[删除]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[审核]</a><a href="javascript:void(0)" onclick="rz('+ row.id+')">[认证]</a>';
}

function init_table(){
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        { field:'ck',checkbox:true},
        {field:'id',title:'ID',sortable:true},
        {field:'name',title:'冷库名称',width:80,align:'center',sortable:true},
        {field:'username',title:'添加人',width:80,align:'center',sortable:true},
        {field:'cellphone',title:'联系方式',width:80,align:'center',sortable:true},
        {field:'addtime',title:'添加时间',width:40,align:'center',sortable:true,formatter:tool.col_format},
        {field:'audit',title:'状态',width:40,align:'center',sortable:true,formatter:getRdcAudit},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库管理","icon-msgType", "POST", "../../i/rdc/getRdcDTOByPage", queryParams,"#div_filteri",null, col,true, onDblClickRow);

}

function onDblClickRow(index,field){}

/**
 * 动态组件 无需关心
 */
function crspsh() {
    $('.datagrid-toolbar').append("<div id=\"seache\"style=\"margin-top:-24px;float:right;margin-right:20px;\"><input id=\"fddata\"class=\"easyui-searchbox\" val=\"ml\" data-options=\"prompt:'请输入搜索条件...',searcher:finddatatb\"style=\"width:300px;display:inline;\"></input><div id=\"mm\"style=\"width:100px\" ></div></div>");
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
/*function startTime(date){
 queryParams.startTime=date;
 reloaddata(queryParams);
 }
 function endTime(date){
 queryParams.endTime=date;
 reloaddata(queryParams);
 }*/
function searchData() {
    queryParams.audit=$("#sel_audit option:selected").val();
    queryParams.keyword=$("#search").val();
    reloaddata(queryParams);
}
function ck(id) {

}
function rz(id) {
    $.ajax({
        url:"/i/rdc/getAuthenticationByRDCId",
        data:{"rdcID":id},
        type:"get",
        success:function (data) {
            var ele="";
            $("#cerBtn").attr("style","display='none'");
            for(var i=0;i<data.length;i++){
                if(data[i].user){
                    ele+="<div style='float: left;margin-left: 60px'><img src='"+data[i].file.location+"' style='height: 100px;width:100px'/><br/>"+data[i].time+"<br/><input type='radio' value='"+data[i].user.id+"'>"+data[i].user.username+"</div>";
                }else {
                    ele+="<div style='float: left;margin-left: 60px'><img src='"+data[i].file.location+"' style='height: 100px;width:100px'/><br/>"+data[i].time+"</div>";
                }
            }
            $("#certificationImg").empty().append(ele);
        }
    });
    $("#certificationCold").dialog('open');
}
function addCold() {
    $.ajax({
        url:"/i/city/findProvinceList",
        type:"get",
        success:function (data) {
            var option="";
            for(var i=0;i<data.length;i++){
                option+="<option value='"+data[i].provinceId+"'>"+data[i].provinceName+"</option>";
            }
            $("#province").empty().append(option);
            $("#province").combobox({});
        }
    });
    $('#addCold').dialog('open');
}


function dl(id) {
    var flag = confirm("确认删除？");
    if(!flag){return;}
    $.ajax({
        url:"/i/rdcShareInfo/delRdcShareInfoById",
        type:"post",
        data:{"id":id},
        success:function () {
            reloaddata(queryParams);
        }
    });
}
//初始化数据
$().ready(function() {
    init_table();
    $("#province").combobox({
        onSelect:function(record){
            $.ajax({
                url:"/i/city/findCitysByProvinceId",
                data:{"provinceID":record.value},
                type:"get",
                success:function (data) {
                    var option="";
                    for(var i=0;i<data.length;i++){
                        option+="<option value='"+data[i].cityID+"'>"+data[i].cityName+"</option>";
                    }
                    $("#city").empty().append(option);
                    $("#city").combobox({});
                }
            });
        }
    });
});//初始化数据