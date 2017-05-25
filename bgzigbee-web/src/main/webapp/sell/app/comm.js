var curr_time = new Date(); 
var timefile, objtree,objTable,tablesize, stablesize; 
if(Date.prototype.Format==undefined){
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
}

var tool={
		col_format:function(val){return new Date(val).Format("yyyy-MM-dd hh:mm:ss");},//格式化时间
		geimgttit:function(tit,img){return '<div class="panel-icon" style="width:auto;"><img src="'+img+'" height="18px" width="auto"></div><h3 style="margin:0px 0px 5px 28px;">'+tit+'</h3>'; },
		gecssttit:function(tit,imgcss){return '<div class="panel-icon '+imgcss+' " style="height: 20px; width: 20px;"></div><h3 style="margin:0px 0px 5px 28px;">'+tit+'</h3>'; },
		col_isred:function(value ,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已读"></span>':'<span class="icon-tb icon-offline" title="未读"></span>';},
        col_isdeal:function(value,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已处理"></span>':'<span class="icon-tb icon-offline" title="未处理"></span>';},
};



function initTree(url,onSelect){objtree=$('#objtree').tree({url:url,method:'post',animate:true,lines:true, onSelect:onSelect});};
function reloaddata(){objTable.datagrid("reload");};
function reloaddata(queryParams){objTable.datagrid( { queryParams:queryParams });};
function onLoadError(){objTable.datagrid('loadData',{total:0,rows:[]});};
function initTable(title,iconCls,method,url,queryParams,toptol,fottol,col,isautosize,onDblClickRow){
         	if(isautosize){ tablesize= stablesize = parseInt((($("#objTable").height() -80) / 26));	}
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
			  toolbar:toptol,
//			  footer:fottol,
			  columns:col,
		      onLoadError:onLoadError,
		      onDblClickRow:onDblClickRow
		   });
		   if(fottol){
			   var pager = objTable.datagrid().datagrid('getPager');	// get the pager of datagrid
				pager.pagination(fottol);		
		   }  
		     
}




//多语言
if($.fn.pagination){$.fn.pagination.defaults.beforePageText='第';$.fn.pagination.defaults.afterPageText='共{pages}页';$.fn.pagination.defaults.displayMsg='当前显示{from}到{to}条记录,共{total}条记录';}if($.fn.datagrid){$.fn.datagrid.defaults.loadMsg='正在处理，请稍待。。。'}if($.fn.treegrid&&$.fn.datagrid){$.fn.treegrid.defaults.loadMsg=$.fn.datagrid.defaults.loadMsg}if($.messager){$.messager.defaults.ok='确定';$.messager.defaults.cancel='取消'}$.map(['validatebox','textbox','filebox','searchbox','combo','combobox','combogrid','combotree','datebox','datetimebox','numberbox','spinner','numberspinner','timespinner','datetimespinner'],function(plugin){if($.fn[plugin]){$.fn[plugin].defaults.missingMessage='该输入项为必输项'}});if($.fn.validatebox){$.fn.validatebox.defaults.rules.email.message='请输入有效的电子邮件地址';$.fn.validatebox.defaults.rules.url.message='请输入有效的URL地址';$.fn.validatebox.defaults.rules.length.message='输入内容长度必须介于{0}和{1}之间';$.fn.validatebox.defaults.rules.remote.message='请修正该字段'}if($.fn.calendar){$.fn.calendar.defaults.weeks=['日','一','二','三','四','五','六'];$.fn.calendar.defaults.months=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']}if($.fn.datebox){$.fn.datebox.defaults.currentText='今天';$.fn.datebox.defaults.closeText='关闭';$.fn.datebox.defaults.okText='确定';$.fn.datebox.defaults.formatter=function(date){var y=date.getFullYear();var m=date.getMonth()+1;var d=date.getDate();return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)};$.fn.datebox.defaults.parser=function(s){if(!s)return new Date();var ss=s.split('-');var y=parseInt(ss[0],10);var m=parseInt(ss[1],10);var d=parseInt(ss[2],10);if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){return new Date(y,m-1,d)}else{return new Date()}}}if($.fn.datetimebox&&$.fn.datebox){$.extend($.fn.datetimebox.defaults,{currentText:$.fn.datebox.defaults.currentText,closeText:$.fn.datebox.defaults.closeText,okText:$.fn.datebox.defaults.okText})}if($.fn.datetimespinner){$.fn.datetimespinner.defaults.selections=[[0,4],[5,7],[8,10],[11,13],[14,16],[17,19]]}