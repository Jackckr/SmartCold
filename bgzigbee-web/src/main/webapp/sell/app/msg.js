var  queryParams={type:null,stype:null,isRead:null, state:null,keyword:null};

function cellStyler(value,row){
	return '<a href="javascript:void(0)" onclick="ck('+ row.id+')">[查看]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[删除]</a>';
 }

function init_tree(){
	initTree("../../i/systemInform/getMsgType",treeselect);//
}
function init_table(){
	   var tol=[
	            {'iconCls': 'icon_rem','handler': '','text':'删除'},
		    "-",{'iconCls': 'icon-reload','handler': 'reloaddata','text':'刷新'},"-"];
	   var col=[[ 
	       	  { field:'ck',checkbox:true},
	       	  {field:'id',title:'ID',sortable:true},   
	       	  {field:'tit',title:'标题',width:80,align:'center',sortable:true},   
	       	  {field:'msg',title:'内容',width:80,align:'center',sortable:true},   
           {field:'isread',title:'是否已读',width:40,align:'center',sortable:true,formatter:isred},   
           {field:'state', title:'是否处理',width:40,align:'center',sortable:true,formatter:isdeal},   
           {field:'addtime',title:'时间',width:40,align:'center',sortable:true},   
           {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler} 
	         ]];
	  initTable(gecssttit("系统消息告警","icon-msgType"), null, "POST", "../../i/systemInform/getSysByFilter", queryParams,tol,tol, col,true, onDblClickRow);
	  
 	  $('.datagrid-row').bind('contextmenu',function(e){e.preventDefault();$('#datamenu').menu('show', {left: e.pageX,top: e.pageY});});
	  crspsh();
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


//初始化数据
$().ready(function() {
	   init_tree();
       init_table();
});//初始化数据
