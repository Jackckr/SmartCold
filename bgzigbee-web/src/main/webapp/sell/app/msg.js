//设置模型
var isredMode=[{val:-1,text:"===全部==="},{val:0,text:"未读"},{val:1,text:"已读"}];//isRead
var isHandleMode=[{val:-1,text:"===全部==="},{val:0,text:"未处理"},{val:1,text:"已处理"}];//status
var MsgtypeMode=[{val:-1,text:"===全部==="},{val:0,text:"系统消息"},{val:1,text:"系统通知"},{val:2,text:"系统告警"}];//type
var MsgstypeMode= [[],
                   [{val:-1,text:"======全部======"},{val:"1",text:"系统通知"},{val:"2",text:"DEV重置通知"},{val:"3",text:"冷库认证通知"},{val:"4",text:"冷库绑定通知"},{val:"5",text:"冷库认证服务商通知"},{val:"6",text:"冷库绑定货主通知"}],
                   [{val:-1,text:"======全部======"},{val:"1",text:"DEV断线告警"},{val:"2",text:"DEV低电量告警"},{val:"3",text:"DEV配置异常告警"}]];//stype
//查询模型
var  queryParams={type:null,stype:null,isRead:null, state:null,keyword:null};
function row_Tool(value,row){
	return '<a href="javascript:void(0)" onclick="ck('+ row.id+')">[查看]</a><a href="javascript:void(0)" onclick="dl('+ row.id+')">[删除]</a>';
 }


function initsel_lister(){
	  $("#sel_isread").combobox({data:isredMode,value:-1,   onChange:function(isRead){ queryParams.isRead=isRead==-1?null:isRead; reloaddata(queryParams);}});
	  $("#sel_state").combobox({data:isHandleMode,value:-1, onChange:function(state){ queryParams.state=state==-1?null:state; reloaddata(queryParams);}});
	  $('#sel_stype').combobox({data:[{val:-1,text:"======全部======"}],value:-1, onChange:function(stype){ queryParams.stype=stype==-1?null:stype;reloaddata(queryParams);}});
	  $('#sel_type').combobox({  
          data:MsgtypeMode,value:-1, 
          onChange:function(val){  
        	  if(val==-1||val==0){
        		  if(val==0){ queryParams.type=0;}else{ queryParams.type=null; }
        		  $("#sel_stype").combobox({data: [{val:-1,text:"======全部======"}],value:-1});
        	  }else{
        		  queryParams.type=val;
        		  $("#sel_stype").combobox({data: MsgstypeMode[val] });
        	  }
        	  reloaddata(queryParams);
          } 
       });  
}
function init_table(){
	   var col=[[ 
	       	   {field:'ck',checkbox:true},
	       	   {field:'id',title:'ID',sortable:true},   
	       	   {field:'tit',title:'标题',width:10,sortable:true},   
	       	   {field:'msg',title:'内容',width:40,sortable:true},   
               {field:'isread',title:'是否已读',width:5,align:'center',sortable:true,formatter:tool.col_isdealisred},   
               {field:'state', title:'是否处理',width:5,align:'center',sortable:true,formatter:tool.col_isdeal},   
               {field:'addtime',title:'时间',width:5,align:'center',sortable:true,formatter:tool.col_format},   
               {field:'hand',title:'操作',width:10,align:'center',formatter:row_Tool} 
	         ]];
	  initTable(tool.gecssttit("系统消息告警","icon-msgType"), null, "POST", "../../i/systemInform/getSysByFilter", queryParams,"#div_filteri",null, col,true, onDblClickRow);
	  
 	  $('.datagrid-row').bind('contextmenu',function(e){e.preventDefault();$('#datamenu').menu('show', {left: e.pageX,top: e.pageY});});
	  crspsh();
}

function onDblClickRow(index,field){
	
	
}

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
    $('#seache').appendTo('#div_filteri');
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
	initsel_lister();
    init_table();
});//初始化数据
