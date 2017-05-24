var curr_time = new Date(); 
var timefile, objtree,objTable,tablesize, stablesize; 
function geimgttit(tit,img){
	return '<div class="panel-icon" style="width:auto;"><img src="'+img+'" height="18px" width="auto"></div><h3 style="margin:0px 0px 5px 28px;">'+tit+'</h3>';
}
function gecssttit(tit,imgcss){
	return '<div class="panel-icon '+imgcss+' " style="height: 20px; width: 20px;"></div><h3 style="margin:0px 0px 5px 28px;">'+tit+'</h3>';
}


function initTree(url,onSelect){
	objtree=$('#objtree').tree({url:url,method:'post',animate:true,lines:true, onSelect:onSelect});
};

function reloaddata(){objTable.datagrid("reload");};
function reloaddata(queryParams){objTable.datagrid( { queryParams:queryParams });};
function onLoadError(){objTable.datagrid('loadData',{total:0,rows:[]});};
function initTable(title,iconCls,method,url,queryParams,tol,col,isautosize,onDblClickRow){
         	if(isautosize){ 
         		tablesize= stablesize = parseInt((($("#objTable").height() -80) / 26));
         	}
			if(tablesize<10){tablesize=stablesize=10;}
		     objTable=$('#objTable').datagrid({
			  url:url,
			  title:title,
			  iconCls: iconCls,
			  method:method,
			  queryParams:queryParams,
			  fit:true,
			  fitColumns:true,
			  remoteSort: false, 
			  striped:true,
			  rownumbers:true,
			  pagination:true,
			  pageSize:stablesize,
			  pageList:[tablesize,10,50,100,200,500],
			  toolbar:tol,
			  columns:col,
		      onLoadError:onLoadError,
		      onDblClickRow:onDblClickRow
		   });
}


function isred(value ,row,index){
	return value=="1"?'<span class="icon-tb icon-online" title="已读"></span>':'<span class="icon-tb icon-offline" title="未读"></span>';
	}
function isdeal(value,row,index){
	return value=="1"?'<span class="icon-tb icon-online" title="已处理"></span>':'<span class="icon-tb icon-offline" title="未处理"></span>';
}
function getRdcAttr(value) {
	if (value!=undefined){
	   return value.name;
	}else {
		return "暂无";
	}
}

//多语言
if($.fn.pagination){$.fn.pagination.defaults.beforePageText='第';$.fn.pagination.defaults.afterPageText='共{pages}页';$.fn.pagination.defaults.displayMsg='当前显示{from}到{to}条记录,共{total}条记录';}if($.fn.datagrid){$.fn.datagrid.defaults.loadMsg='正在处理，请稍待。。。'}if($.fn.treegrid&&$.fn.datagrid){$.fn.treegrid.defaults.loadMsg=$.fn.datagrid.defaults.loadMsg}if($.messager){$.messager.defaults.ok='确定';$.messager.defaults.cancel='取消'}$.map(['validatebox','textbox','filebox','searchbox','combo','combobox','combogrid','combotree','datebox','datetimebox','numberbox','spinner','numberspinner','timespinner','datetimespinner'],function(plugin){if($.fn[plugin]){$.fn[plugin].defaults.missingMessage='该输入项为必输项'}});if($.fn.validatebox){$.fn.validatebox.defaults.rules.email.message='请输入有效的电子邮件地址';$.fn.validatebox.defaults.rules.url.message='请输入有效的URL地址';$.fn.validatebox.defaults.rules.length.message='输入内容长度必须介于{0}和{1}之间';$.fn.validatebox.defaults.rules.remote.message='请修正该字段'}if($.fn.calendar){$.fn.calendar.defaults.weeks=['日','一','二','三','四','五','六'];$.fn.calendar.defaults.months=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']}if($.fn.datebox){$.fn.datebox.defaults.currentText='今天';$.fn.datebox.defaults.closeText='关闭';$.fn.datebox.defaults.okText='确定';$.fn.datebox.defaults.formatter=function(date){var y=date.getFullYear();var m=date.getMonth()+1;var d=date.getDate();return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)};$.fn.datebox.defaults.parser=function(s){if(!s)return new Date();var ss=s.split('-');var y=parseInt(ss[0],10);var m=parseInt(ss[1],10);var d=parseInt(ss[2],10);if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){return new Date(y,m-1,d)}else{return new Date()}}}if($.fn.datetimebox&&$.fn.datebox){$.extend($.fn.datetimebox.defaults,{currentText:$.fn.datebox.defaults.currentText,closeText:$.fn.datebox.defaults.closeText,okText:$.fn.datebox.defaults.okText})}if($.fn.datetimespinner){$.fn.datetimespinner.defaults.selections=[[0,4],[5,7],[8,10],[11,13],[14,16],[17,19]]}