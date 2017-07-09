if(!window.sessionStorage.asikey||parent==null||parent.sysuser==undefined||parent.sysuser.token==undefined){ $.messager.alert('警告','当前会话已失效！请重新登录！','error');parent.sysuser=undefined;window.sessionStorage.clear(); window.location.href = window.location.host+"/login.htm"; }else{sysuser=parent.sysuser;}
var  curr_time = new Date(), timefile, objtree,objTable,tablesize, stablesize,systoken=undefined,sys={imgrooturl:"http://139.196.189.93:8089/"};
var tool={
    col_format:function(val){ if(val==null){val=new Date();} return new Date(val).Format("yyyy-MM-dd hh:mm:ss");},//格式化时间
    col_img:function(val){return ['<image  class="icon-tb" src=',sys.imgrooturl+val,' onclick=showimg(this)>'].join(""); },//格式化时间
    col_state:function(value ,row,index){return value=="1"?'<span class="icon-tb icon-online" ></span>':'<span class="icon-tb icon-offline" ></span>';},
    col_isred:function(value ,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已读"></span>':'<span class="icon-tb icon-offline" title="未读"></span>';},
    col_isdeal:function(value,row,index){return value=="1"?'<span class="icon-tb icon-online" title="已处理"></span>':'<span class="icon-tb icon-offline" title="未处理"></span>';},
    setimg : function(em, imgid, callback) {
		var oFile = $(em)[0].files[0];
		var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
		var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
		if (!rFilter.test(oFile.type)) {
			layer.open({content : "格式错误~请选择格式为" + msg + "的图片~",btn : '确定'}); return;
		}else if(oFile.size > 10485760){
    		layer.open({content : "最大只能上传10M的图片",btn : '确定'}); return;
		}
		var oImage = document.getElementById(imgid);
		var oReader = new FileReader();
		oReader.onload = function(e) {oImage.src = e.target.result;};  oReader.readAsDataURL(oFile);
		if (callback != null) {callback();}
	},
};



function alert_infomsg(msg){ $.messager.alert('提示', msg, 'info');}
function alert_errmsg(msg){ $.messager.alert('错误', msg, 'error');}
function msgShow(title, msgString, msgType) { $.messager.alert(title, msgString, msgType);}
function initTree(url,onSelect){objtree=$('#objtree').tree({url:url,method:'post',animate:true,lines:true, onSelect:onSelect});};
function reloaddata(){ objTable.datagrid("reload");};
function reloaddata(queryParams){objTable.datagrid( { queryParams:queryParams });};
function clearTable(){	objTable.datagrid("loadData",{ total:0,rows:[]});}
function getTableChecked(){ return objTable.datagrid('getChecked');}
function getTableCheckedID(){ var userID =[],checkedItems = objTable.datagrid('getChecked'); $.each(checkedItems, function (index, item) { userID.push(item.id); }); return userID;}
function getFormData(id){var vo ={},parnArray = $(id).serializeArray();$.each(parnArray,function(index,item){ vo[item.name] = item.value; }); return vo;}
function showimg(em,url){$(em).viewer();}
function chektoken(val){if(val.length==8||val.length==9){$.get("../../i/util/gettoke", { token: val },function(data){systoken=data;$("#txt_systokn").val(systoken);});}else{systoken=undefined;$("#txt_systokn").val("");}  }
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
      onLoadError:clearTable,
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
    },
    ckdevno: {
    	 validator: function (value) {
          return value.length==6||value.length==8;
         },
         message: '设备编号不正确！设备编码长度为6或者8位!'
    },
    cksystoken: {
   	 validator: function (value) {
         return value.length==32&&value==systoken;
        },
        message: '口令不正确！'
   }
});

//