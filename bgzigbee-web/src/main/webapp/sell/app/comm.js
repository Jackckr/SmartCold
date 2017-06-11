var curr_time = new Date(), timefile, objtree,objTable,tablesize, stablesize,admin=null;
$.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
    var admin = data.entity; 
    if (admin == null || admin.id == 0) {var url = "http://" + location.host + "/login.html"; top.location.href = url;  }
});

var tool={
    col_format:function(val){ if(val==null){val=new Date();} return new Date(val).Format("yyyy-MM-dd hh:mm:ss");},//格式化时间
    col_isred:function(value ,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已读"></span>':'<span class="icon-tb icon-offline" title="未读"></span>';},
    col_isdeal:function(value,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已处理"></span>':'<span class="icon-tb icon-offline" title="未处理"></span>';},
};
function alert_infomsg(msg){ $.messager.alert('提示', msg, 'info');}
function msgShow(title, msgString, msgType) { $.messager.alert(title, msgString, msgType);}
function initTree(url,onSelect){objtree=$('#objtree').tree({url:url,method:'post',animate:true,lines:true, onSelect:onSelect});};
function reloaddata(){ objTable.datagrid("reload");};
function reloaddata(queryParams){objTable.datagrid( { queryParams:queryParams });};
function onLoadError(){objTable.datagrid('loadData',{total:0,rows:[]});};
function getTableChecked(){ return objTable.datagrid('getChecked');}
function getTableCheckedID(){ var userID =[],checkedItems = objTable.datagrid('getChecked'); $.each(checkedItems, function (index, item) { userID.push(item.id); }); return userID;}
function getFormData(id){var vo ={},parnArray = $(id).serializeArray();$.each(parnArray,function(index,item){ vo[item.name] = item.value; }); return vo;}

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
      columns:col,
      onLoadError:onLoadError,
      onDblClickRow:onDblClickRow
   });
   if(fottol){
       objTable.datagrid().datagrid('getPager').pagination(fottol);	// get the pager of datagrid
   }
}
/*
* 扩展校验规则
* */
$.extend($.fn.validatebox.defaults.rules, {
    idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    length: { validator: function (value, param) {
        var len = $.trim(value).length;
        return len >= param[0] && len <= param[1];
    },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码
        validator: function (value) {
            return /^((\d2,3 )|(\d{3}\-))?(0\d2,3 |0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            return /^(13|14|15|17|18)\d{9}$/i.test(value);
        },
        message: '手机号码格式不正确'
    },
    intOrFloat: {// 验证整数或小数
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数 可正负数
        validator: function (value) {
            //return /^[+]?[1-9]+\d*$/i.test(value);


            return /^([+]?[0-9])|([-]?[0-9])+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message: '年龄必须是0到120之间的整数'
    },
    chinese: {// 验证中文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真
        validator: function (value) {
            //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
            return /^((\d2,3 )|(\d{3}\-))?(0\d2,3 |0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码
        validator: function (value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    date: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            //格式yyyy-MM-dd或yyyy-M-d
            return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
        },
        message: '清输入合适的日期格式'
    },
    msn: {
        validator: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    pwd: {
        validator: function (value) {

            return /^\w{6,17}$/.test(value);
        },
        message: '正确格式为：长度在6-18之间，只能包含字符、数字和下划线'
    },
    same: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            } else {
                return true;
            }
        },
        message: '两次输入的密码不一致！'
    }
});


//日期——多语言
if(Date.prototype.Format==undefined){Date.prototype.Format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(fmt))fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var k in o)if(new RegExp("("+k+")").test(fmt))fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));return fmt;};};
if($.fn.pagination){$.fn.pagination.defaults.beforePageText='第';$.fn.pagination.defaults.afterPageText='共{pages}页';$.fn.pagination.defaults.displayMsg='当前显示{from}到{to}条记录,共{total}条记录';}if($.fn.datagrid){$.fn.datagrid.defaults.loadMsg='正在处理，请稍待。。。'}if($.fn.treegrid&&$.fn.datagrid){$.fn.treegrid.defaults.loadMsg=$.fn.datagrid.defaults.loadMsg}if($.messager){$.messager.defaults.ok='确定';$.messager.defaults.cancel='取消'}$.map(['validatebox','textbox','filebox','searchbox','combo','combobox','combogrid','combotree','datebox','datetimebox','numberbox','spinner','numberspinner','timespinner','datetimespinner'],function(plugin){if($.fn[plugin]){$.fn[plugin].defaults.missingMessage='该输入项为必输项'}});if($.fn.validatebox){$.fn.validatebox.defaults.rules.email.message='请输入有效的电子邮件地址';$.fn.validatebox.defaults.rules.url.message='请输入有效的URL地址';$.fn.validatebox.defaults.rules.length.message='输入内容长度必须介于{0}和{1}之间';$.fn.validatebox.defaults.rules.remote.message='该用户名已存在！';}if($.fn.calendar){$.fn.calendar.defaults.weeks=['日','一','二','三','四','五','六'];$.fn.calendar.defaults.months=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']}if($.fn.datebox){$.fn.datebox.defaults.currentText='今天';$.fn.datebox.defaults.closeText='关闭';$.fn.datebox.defaults.okText='确定';$.fn.datebox.defaults.formatter=function(date){var y=date.getFullYear();var m=date.getMonth()+1;var d=date.getDate();return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)};$.fn.datebox.defaults.parser=function(s){if(!s)return new Date();var ss=s.split('-');var y=parseInt(ss[0],10);var m=parseInt(ss[1],10);var d=parseInt(ss[2],10);if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){return new Date(y,m-1,d)}else{return new Date()}}}if($.fn.datetimebox&&$.fn.datebox){$.extend($.fn.datetimebox.defaults,{currentText:$.fn.datebox.defaults.currentText,closeText:$.fn.datebox.defaults.closeText,okText:$.fn.datebox.defaults.okText})}if($.fn.datetimespinner){$.fn.datetimespinner.defaults.selections=[[0,4],[5,7],[8,10],[11,13],[14,16],[17,19]]}