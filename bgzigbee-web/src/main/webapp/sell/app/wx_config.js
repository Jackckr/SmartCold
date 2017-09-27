var  params={keyword:null};
var  userToRdcParams={userid:null};
var  rdcToParams={wxuserid:null};
var  companyToParams={companyId:null};
var roleFlag=1;//标记当前角色1.平台用户2.微信用户
var saveUser={"id":null,"username":null};
var saveRdc={"id":null,"rdcName":null};
var saverCompany={"id":null,"companyName":null};

/*初始化表格*/
function newInitTable(title,iconCls,method,url,queryParams,toptol,fottol,col,isautosize,onDblClickRow,tableId){
    if(isautosize){ tablesize= stablesize = parseInt((($(tableId).height() -80) / 26));	}
    if(tablesize<10){tablesize=stablesize=10;}
    objTable=$(tableId).datagrid({
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
/*清空搜索框*/
function cleanSearch() {
    params.keyword="";
    $("#fddata").textbox("setValue","");
}
/*隐藏中右窗口*/
function hideWindow() {
    $("#objTable1-dg,#objTable2-dg").hide();
}
/*显示中右窗口*/
function showWindow() {
    $("#objTable1-dg,#objTable2-dg").show();
}



/*左微信用户操作按钮载入*/
function userStyler(value,row){
    return '<button class="btn" onclick="userToRdc('+ row.id+',\''+row.username+'\')">微信用户关联</button>';
}
/*左冷库操作按钮载入*/
function rdcStyler(value,row){
    return '<button class="btn" onclick="rdcToUser('+ row.id+',\''+row.nickname+'\')">平台用户关联</button>';
}

/*中微信用户冷库解绑操作按钮*/
function userRdcUnbindStyler(value,row) {
    return '<button class="btn btn-delete" onclick="userRdcUnbind('+row.userid+','+ row.wxuserid+',\''+row.username+'\',\''+row.nickname+'\')">解绑</button>';
}

/*右微信用户绑定冷库操作按钮载入*/
function userToRdcStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+saveUser.id+','+ row.id+',\''+saveUser.username+'\',\''+row.nickname+'\')">绑定</button>';
}
/*右微信用户绑定平台用户操作按钮载入*/
function rdcToUserStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+ row.id+','+saveRdc.id+',\''+row.username+'\',\''+saveRdc.rdcName+'\')">绑定</button>';
}



/*初始化用户表*/
function init_user(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'username',title:'用户名', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/user/getUserList", params,searchTol,null, col,true, userOnDblClickRow,tableId);
}
/*初始化微信用户表*/
function init_rdc(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'nickname',title:'微信昵称', width: 80, align: 'center',sortable:true},
        {field:'openid',title:'openID', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/wxUser/getUserByFilter", params,searchTol,null, col,true, rdcOnDblClickRow,tableId);
}


/*初始化微信用户冷库关联表*/
function init_userToRdc(title, tol, tableId,url,params) {
    var col=[[
        {field:'userid',title:'平台Id',sortable:true},
        {field:'username',title:'用户名', width: 80, align: 'center',sortable:true},
        {field:'wxuserid',title:'微信id', width: 80, align: 'center',sortable:true},
        {field:'nickname',title:'微信昵称', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", url, params,null,null, col,true, null,tableId);
}

/*微信用户双击事件*/
function userOnDblClickRow(index,field){

}
/*冷库双击事件*/
function rdcOnDblClickRow(index,field){

}
/*集团双击事件*/
function companyOnDblClickRow(index,field){

}



/*切换微信用户表*/
function changeUserTable(){
    cleanSearch();
    hideWindow();
    init_user("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeUserTable()'>平台用户</button><button style='margin-left: 10px' onclick='changeRdcTable()'>微信用户</button>",userStyler,"#objTable","#div_filteri");
    roleFlag=1;
}
/*切换微信用户表*/
function changeRdcTable(){
    cleanSearch();
    hideWindow();
    init_rdc("<button style='margin-left: 10px' onclick='changeUserTable()'>平台用户</button><button onclick='changeRdcTable()' style='background-color: #00a0e9;color: white;margin-left: 10px'>微信用户</button>",rdcStyler,"#objTable","#div_filteri");
    roleFlag=2;
}

/*平台用户关联微信用户*/
function userToRdc(id,username) {
    cleanSearch();
    showWindow();
    saveUser.id=id;
    saveUser.username=username;
    userToRdcParams.userid=id;
    init_userToRdc("平台用户\""+username+"\"所关联的微信用户",userRdcUnbindStyler,"#objTable1","../../i/useropenid/getUserByFilter",userToRdcParams);
    init_rdc("请选择关联的冷库",userToRdcStyler,"#objTable2","#div_filteri");
}

/*冷库关联微信用户*/
function rdcToUser(id, nickname) {
    cleanSearch();
    showWindow();
    saveRdc.id=id;
    saveRdc.rdcName=nickname;
    rdcToParams.wxuserid=id;
    init_userToRdc("微信用户\""+nickname+"\"所关联的平台用户",userRdcUnbindStyler,"#objTable1","../../i/useropenid/getUserByFilter",rdcToParams);
    init_user("请选择关联的平台用户",rdcToUserStyler,"#objTable2","#div_filteri");
}


/*微信用户绑定平台用户*/
function userBindRdc(userId,rdcId,username,rdcName) {
    $.messager.confirm('提示','确认平台用户\"'+username+'\"和微信用户\"'+rdcName+'\"绑定?',function(r){
        if (r){
            $.ajax({
                url:"/i/useropenid/addConfig",
                type:"POST",
                data:{"userid":userId,"wxuserid":rdcId},
                success:function (data) {
                    $.messager.alert('提示',data.message,'info');
                    roleFlag==1?userToRdc(userId,username):rdcToUser(rdcId,rdcName);
                }
            });
        }
    });
}
/*微信用户冷库解绑*/
function userRdcUnbind(userId,rdcId,username,rdcName){
    $.messager.confirm('提示','确认平台用户\"'+username+'\"和微信用户\"'+rdcName+'\"解绑?',function(r){
        if (r){
            $.ajax({
                url:"/i/useropenid/delConfig",
                type:"POST",
                data:{"userid":userId,"wxuserid":rdcId},
                success:function (data) {
                    $.messager.alert('提示',data.message,'info');
                    roleFlag==1?userToRdc(userId,username):rdcToUser(rdcId,rdcName);
                }
            });
        }
    });
}






//初始化数据
$().ready(function() {
    init_user("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeUserTable()'>平台用户</button><button onclick='changeRdcTable()' style='margin-left: 10px'>微信用户</button>",userStyler,"#objTable","#div_filteri");
    $('#fddata').searchbox({searcher:function(value){
        params.keyword=value;
        reloaddata(params);
    }});
});
