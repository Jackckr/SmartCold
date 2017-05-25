var  queryParams={page:null,rows:null,audit:'8', type:null,keyword:null};

function cellStyler(value,row){
    return '<a href="javascript:void(0)" onclick="ck('+ row.id+')">[审核]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[关联冷库]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[删除]</a>';
}

$.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
    var admin = data.entity;
    if (admin == null || admin.id == 0) {
        var url = "http://" + location.host + "/login.html";
        window.location.href = url;
    }
});
var getAudit = function(i) {
    if (i == 0)
        return '待审核';
    else if (i > 0) {
        return '通过';
    } else {
        return '未通过';
    }
}
function init_table(){
    var tol=[
        {'iconCls': 'icon_rem','handler': '','text':'删除'},
        "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
    var col=[[
        {field:'ck',checkbox:true},
        {field:'id',title:'ID',sortable:true},
        {field:'username',title:'用户名',width:80,align:'center',sortable:true},
        {field:'telephone',title:'手机号',width:80,align:'center',sortable:true},
        {field:'email',title:'邮箱',width:80,align:'center',sortable:true},
        {field:'addTime',title:'添加时间',width:80,align:'center',sortable:true,formatter:tool.col_format},
        {field:'audit',title:'状态',width:80,align:'center',sortable:true,formatter:getAudit},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("用户管理", "icon-user", "POST", "../../i/user/getUserByFilter", queryParams, "#user_filter", null,col, true, onDblClickRow);

}

function treeselect(node){
    if(node!=null){
        if(node.type){
            queryParams.type=node.type;queryParams.stype=null;
        }else if(node.stype){
            queryParams.type=null;queryParams.stype=node.stype;
        }
        reloaddata(queryParams);
    }
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
function onSelect(date){
    queryParams.startTime=date;
    reloaddata(queryParams);
}
$.extend($.fn.validatebox.defaults.rules, {
    myvalidate : {
        validator : function(value, param) {
            var username = $("#username").val().trim();
            console.log(username);
            var haha = " ";
            $.ajax({
                type : 'GET',
                async : false,
                url : '../../i/user/checkUserName',
                data : {
                    "username" : username
                },
                success : function(data) {
                    haha = data;
                }
            });
            console.log(haha);
            return haha.indexOf("true");
        },
        message : '用户名已经被占用'
    }
});
//初始化数据
$().ready(function() {
    init_table();
    $("#sel_type").combobox({
        onSelect: function(date){
            var $val = $("#sel_type option:selected").val();
            queryParams.type=$val;
            reloaddata(queryParams);
        }
    });
    $('#userForm').form({
        url:'../../i/user/addUser',
        onSubmit: function(){
            $.messager.progress();
            var isValid = $(this).form('validate');
            if (!isValid){
                $.messager.progress('close');
            }
            return isValid;
        },
        success:function(data){
            $('#userForm').dialog('close');
            window.location.reload();
        }
    });
});//初始化数据

$.extend($.fn.validatebox.defaults.rules, {
    remotes : {
        validator : function(value, param) {
            if (!value) {
                return true;
            }
            console.log(param);
            var data = {};
            data[param[1]] = value;
            // param[2] 就是配置的{param:'id',selector:'id'}
            if (param[2]) {
                data[param[2].param] = $(param[2].selector).val();
            }
            var res = $.ajax({
                url : param[0],
                dataType : "json",
                data : data,
                async : false,
                cache : false,
                type : "post"
            }).responseText;
            return res =!res;
        },
        message : "输入的值已存在"
    }
});