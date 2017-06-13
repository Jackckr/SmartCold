//设置模型

var isredMode=[{val:-1,text:"===全部==="},{val:0,text:"未读"},{val:1,text:"已读"}];//isRead
var isHandleMode=[{val:-1,text:"===全部==="},{val:0,text:"未处理"},{val:1,text:"已处理"}];//status
var MsgtypeMode=[{val:-1,text:"===全部==="},{val:0,text:"系统消息"},{val:1,text:"系统通知"},{val:2,text:"系统告警"}];//type
var MsgstypeMode= [[],
                   [{val:-1,text:"======全部======"},{val:"1",text:"系统通知"},{val:"2",text:"DEV重置通知"},{val:"3",text:"冷库认证通知"},{val:"4",text:"冷库绑定通知"},{val:"5",text:"冷库认证服务商通知"},{val:"6",text:"冷库绑定货主通知"}],
                   [{val:-1,text:"======全部======"},{val:"1",text:"DEV断线告警"},{val:"2",text:"DEV低电量告警"},{val:"3",text:"DEV配置异常告警"}]];//stype
//查询模型
var  queryParams={type:2,stype:null,isRead:null, state:null,keyword:null};
function col_cellStyler(value, row,index) {
	return ['<button class="btn" onclick="showmsg(',index,',' , row.id,',',row.level,',\'',row.tit,'\',\'',row.msg, '\',',row.isread,',',row.state,')">查看</button>'].join("");}

function initsel_lister(){
	  $("#sel_isread").combobox({data:isredMode,value:-1,   onChange:function(isRead){ queryParams.isRead=isRead==-1?null:isRead; reloaddata(queryParams);}});
	  $("#sel_state").combobox({data:isHandleMode,value:-1, onChange:function(state){ queryParams.state=state==-1?null:state; reloaddata(queryParams);}});
	  $('#sel_stype').combobox({data:MsgstypeMode[2],value:-1, onChange:function(stype){ queryParams.stype=stype==-1?null:stype;reloaddata(queryParams);}});
}
function init_table(){
	   var col=[[ 
	       	   {field:'ck',checkbox:true},
	       	   {field:'id',title:'ID',sortable:true},   
	       	   {field:'tit',title:'标题',width:10,sortable:true},   
	       	   {field:'msg',title:'内容',width:40,sortable:true},   
               {field:'isread',title:'是否已读',width:5,align:'center',sortable:true,formatter:tool.col_isdeal},   
               {field:'state', title:'是否处理',width:5,align:'center',sortable:true,formatter:tool.col_isdeal},   
               {field:'addtime',title:'时间',width:6,align:'center',sortable:true,formatter:tool.col_format},   
               {field:'hand',title:'操作',width:5,align:'center',formatter:col_cellStyler} 
	         ]];
	  initTable("设备告警","dev_warning", "POST", "../../i/systemInform/getSysMsgByFilter", queryParams,"#div_filteri",null, col,true, onDblClickRow);
}

function onDblClickRow(index,data){
	data.rowid=index;
	showMsgdialog(data);
	}
function showmsg(rowid,id,level,tit,msg,isread,state){var data=new Object();data.rowid=rowid;   data.id=id;data.level=level;data.tit=tit;data.msg=msg;showMsgdialog(data);}
function showMsgdialog(data){data.level="L"+data.level;$('#dev_msgForm').form('load',data);$('#dev_msgdialog').dialog({title:data.tit,iconCls:'dev_warning',closed: false});}
function up_dev_msgstatus(type){//Integer id,Integer state, Integer isRead
	   $('#dev_msgdialog').dialog('close');
	   var obj=   getFormData('#dev_msgForm');
	   if(obj.id==''||type==0&&obj.isread==1||type==1&&obj.state==1){  return; }
	   $.ajax({ url: '../../i/systemInform/changeSysMsgStatus',type: 'POST',data:{id:obj.id,isRead:1,state:type}, success: function(data) { 
		   obj.isread=1; obj.state=type;
		   objTable.datagrid('updateRow',{index: obj.rowid,row: obj}); 
	   }});
}
//初始化数据
$().ready(function() {
	initsel_lister();
    init_table();
});//初始化数据
