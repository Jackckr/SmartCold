var  params={keyword:null};
var  userToRdcParams={userId:null};
var  rdcToParams={rdcId:null};
var  companyToParams={companyId:null};
var roleFlag=1;//标记当前角色1.门店2.用户3.集团
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



/*左用户操作按钮载入*/
function userStyler(value,row){
    return '<button class="btn" onclick="userToRdc('+ row.id+',\''+row.username+'\')">门店关联</button><button class="btn btn-delete" onclick="userToCompany('+ row.id+',\''+row.username+'\')">集团关联</button>';
}
/*左门店操作按钮载入*/
function rdcStyler(value,row){
    return '<button class="btn" onclick="rdcToUser('+ row.id+',\''+row.name+'\')">用户关联</button><button class="btn btn-delete" onclick="rdcToCompany('+ row.id+',\''+row.name+'\')">集团关联</button>';
}
/*左集团操作按钮载入*/
function companyStyler(value,row){
    return '<button class="btn" onclick="companyToRdc('+ row.id+',\''+row.name+'\')">门店关联</button><button class="btn btn-delete" onclick="companyToUser('+ row.id+',\''+row.name+'\')">用户关联</button>';
}
/*中用户门店解绑操作按钮*/
function userRdcUnbindStyler(value,row) {
    return '<button class="btn btn-delete" onclick="userRdcUnbind('+row.userid+','+ row.rdcid+',\''+row.user.username+'\',\''+row.rdc.name+'\')">解绑</button>';
}
/*中用户集团解绑操作按钮*/
function userCompanyUnbindStyler(value, row) {
    return '<button class="btn btn-delete" onclick="userCompanyUnbind('+row.userid+','+ row.companyid+',\''+row.user.username+'\',\''+row.company.name+'\')">解绑</button>';
}
/*中门店集团解绑操作按钮*/
function rdcCompanyUnbindStyler(value, row) {
    return '<button class="btn btn-delete" onclick="rdcCompanyUnbind('+row.rdcid+','+ row.companyid+',\''+row.rdc.name+'\',\''+row.company.name+'\')">解绑</button>';
}
/*右用户绑定门店操作按钮载入*/
function userToRdcStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+saveUser.id+','+ row.id+',\''+saveUser.username+'\',\''+row.name+'\')">绑定</button>';
}
/*右门店绑定用户操作按钮载入*/
function rdcToUserStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+ row.id+','+saveRdc.id+',\''+row.username+'\',\''+saveRdc.rdcName+'\')">绑定</button>';
}
/*右用户绑定集团操作按钮载入*/
function userToCompanyStyler(value, row) {
    return '<button class="btn" onclick="userBindCompany('+saveUser.id+','+ row.id+',\''+saveUser.username+'\',\''+row.name+'\')">绑定</button>';
}
/*右门店绑定集团操作按钮载入*/
function rdcToCompanyStyler(value, row) {
    return '<button class="btn" onclick="rdcBindCompany('+saveRdc.id+','+ row.id+',\''+saveRdc.rdcName+'\',\''+row.name+'\')">绑定</button>';
}
/*右集团绑定用户操作按钮载入*/
function companyToUserStyler(value, row) {
    return '<button class="btn" onclick="userBindCompany('+row.id+','+ saverCompany.id+',\''+row.username+'\',\''+saverCompany.companyName+'\')">绑定</button>';
}
/*右集团绑定门店操作按钮载入*/
function companyToRdcStyler(value, row) {
    return '<button class="btn" onclick="rdcBindCompany('+row.id+','+ saverCompany.id+',\''+row.name+'\',\''+saverCompany.companyName+'\')">绑定</button>';
}





/*初始化用户表*/
function init_user(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'username',title:'用户名', width: 80, align: 'center',sortable:true},
        {field:'type',title:'用户类型', width: 80, align: 'center',sortable:true,formatter:getUserType},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/user/getUserList", params,searchTol,null, col,true, userOnDblClickRow,tableId);
}
/*初始化门店表*/
function init_rdc(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'name',title:'门店名', width: 80, align: 'center',sortable:true},
        {field:'address',title:'门店地址', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/rdc/getRdcDTOByPage", params,searchTol,null, col,true, rdcOnDblClickRow,tableId);
}
/*初始化集团表*/
function init_company(title,tol,tableId,searchTol) {
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'name',title:'集团名称', width: 80, align: 'center',sortable:true},
        {field:'address',title:'集团地址', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/company/getCompanyList", params,searchTol,null, col,true, companyOnDblClickRow,tableId);
}
/*初始化用户门店关联表*/
function init_userToRdc(title, tol, tableId,url,params) {
    var col=[[
        {field:'userid',title:'用户ID',sortable:true},
        {field:'user',title:'用户名', width: 80, align: 'center',sortable:true,formatter:getUserName},
        {field:'rdcid',title:'门店ID', width: 80, align: 'center',sortable:true},
        {field:'rdc',title:'门店名', width: 80, align: 'center',sortable:true,formatter:getRdcName},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", url, params,null,null, col,true, null,tableId);
}
/*初始化用户集团关联表*/
function init_userToCompany(title, tol, tableId,url,params) {
    var col=[[
        {field:'userid',title:'用户ID',sortable:true},
        {field:'user',title:'用户名', width: 80, align: 'center',sortable:true,formatter:getUserName},
        {field:'companyid',title:'集团ID', width: 80, align: 'center',sortable:true},
        {field:'company',title:'集团名称', width: 80, align: 'center',sortable:true,formatter:getCompanyName},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST",url , params,null,null, col,true, null,tableId);
}
/*初始化门店集团关联表*/
function init_rdcToCompany(title, tol, tableId, url, params) {
    var col=[[
        {field:'companyid',title:'集团ID',sortable:true},
        {field:'company',title:'集团名', width: 80, align: 'center',sortable:true,formatter:getCompanyName},
        {field:'rdcid',title:'门店ID', width: 80, align: 'center',sortable:true},
        {field:'rdc',title:'门店名', width: 80, align: 'center',sortable:true,formatter:getRdcName},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", url, params,null,null, col,true, null,tableId);
}




/*用户双击事件*/
function userOnDblClickRow(index,field){

}
/*门店双击事件*/
function rdcOnDblClickRow(index,field){

}
/*集团双击事件*/
function companyOnDblClickRow(index,field){

}



/*切换用户表*/
function changeUserTable(){
    cleanSearch();
    hideWindow();
    init_user("<button style='margin-left: 10px' onclick='changeRdcTable()'>门店</button><button onclick='changeUserTable()' style='background-color: #00a0e9;color: white;margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",userStyler,"#objTable","#div_filteri");
    roleFlag=2;
}
/*切换门店表*/
function changeRdcTable(){
    cleanSearch();
    hideWindow();
    init_rdc("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeRdcTable()'>门店</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",rdcStyler,"#objTable","#div_filteri");
    roleFlag=1;
}
/*切换集团表*/
function changeCompanyTable(){
    cleanSearch();
    hideWindow();
    init_company("<button style='margin-left: 10px' onclick='changeRdcTable()'>门店</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='background-color: #00a0e9;color: white;margin-left: 10px'>集团</button>",companyStyler,"#objTable","#div_filteri");
    roleFlag=3;
}


/*获得用户具体类型*/
function getUserType(value) {
    if (value==0){
        return "门店账号";
    }else if (value==1){
        return "区域经理";
    }else if(value==2){
        return "集团用户";
    }else {
        return "";
    }
}
/*获得门店名*/
function getRdcName(value) {
    return value.name;
}
/*获得用户名*/
function getUserName(value) {
    return value.username;
}
/*获得集团名*/
function getCompanyName(value) {
    return value.name;
}



/*用户关联门店*/
function userToRdc(id,username) {
    cleanSearch();
    showWindow();
    saveUser.id=id;
    saveUser.username=username;
    userToRdcParams.userId=id;
    init_userToRdc("用户\""+username+"\"所关联的门店",userRdcUnbindStyler,"#objTable1","../../i/rdcUser/getRdcUserByUserId",userToRdcParams);
    init_rdc("请选择关联的门店",userToRdcStyler,"#objTable2","#div_filteri");
}
/*用户关联集团*/
function userToCompany(id,username) {
    cleanSearch();
    showWindow();
    saveUser.id=id;
    saveUser.username=username;
    userToRdcParams.userId=id;
    init_userToCompany("用户\""+username+"\"所关联的集团",userCompanyUnbindStyler,"#objTable1","../../i/companyUser/getByUserId",userToRdcParams);
    init_company("请选择关联的集团",userToCompanyStyler,"#objTable2","#div_filteri");
}
/*门店关联用户*/
function rdcToUser(id, rdcName) {
    cleanSearch();
    showWindow();
    saveRdc.id=id;
    saveRdc.rdcName=rdcName;
    rdcToParams.rdcId=id;
    init_userToRdc("门店\""+rdcName+"\"所关联的用户",userRdcUnbindStyler,"#objTable1","../../i/rdcUser/getRdcUserByRdcId",rdcToParams);
    init_user("请选择关联的用户",rdcToUserStyler,"#objTable2","#div_filteri");
}
/*门店关联集团*/
function rdcToCompany(id, rdcName) {
    cleanSearch();
    showWindow();
    saveRdc.id=id;
    saveRdc.rdcName=rdcName;
    rdcToParams.rdcId=id;
    init_rdcToCompany("门店\""+rdcName+"\"所关联的集团",rdcCompanyUnbindStyler,"#objTable1","../../i/companyRdc/getByRdcId",rdcToParams);
    init_company("请选择关联的集团",rdcToCompanyStyler,"#objTable2","#div_filteri");
}
/*集团关联用户*/
function companyToUser(id, companyName) {
    cleanSearch();
    showWindow();
    saverCompany.id=id;
    saverCompany.companyName=companyName;
    companyToParams.companyId=id;
    init_userToCompany("集团\""+companyName+"\"所关联的用户",userCompanyUnbindStyler,"#objTable1","../../i/companyUser/getByCompanyId",companyToParams);
    init_user("请选择关联的用户",companyToUserStyler,"#objTable2","#div_filteri");
}
/*集团关联门店*/
function companyToRdc(id, companyName) {
    cleanSearch();
    showWindow();
    saverCompany.id=id;
    saverCompany.companyName=companyName;
    companyToParams.companyId=id;
    init_rdcToCompany("集团\""+companyName+"\"所关联的门店",rdcCompanyUnbindStyler,"#objTable1","../../i/companyRdc/getByCompanyId",companyToParams);
    init_rdc("请选择关联的门店",companyToRdcStyler,"#objTable2","#div_filteri");
}





/*用户绑定门店*/
function userBindRdc(userId,rdcId,username,rdcName) {
    $.messager.confirm('提示','确认和门店\''+rdcName+'\'绑定?',function(r){
        if (r){
            $.ajax({
                url:"/i/rdcUser/insertRdcUser",
                type:"POST",
                data:{"userId":userId,"rdcId":rdcId},
                success:function (data) {
                    $.messager.alert('提示',data.message,'info');
                    roleFlag==2?userToRdc(userId,username):rdcToUser(rdcId,rdcName);
                }
            });
        }
    });
}
/*用户门店解绑*/
function userRdcUnbind(userId,rdcId,username,rdcName){
    $.messager.confirm('提示','确认和门店\''+rdcName+'\'解绑?',function(r){
        if (r){
            $.ajax({
                url:"/i/rdcUser/delRdcUser",
                type:"POST",
                data:{"userId":userId,"rdcId":rdcId},
                success:function (data) {
                    $.messager.alert('提示',"解绑成功！",'info');
                    roleFlag==2?userToRdc(userId,username):rdcToUser(rdcId,rdcName);
                }
            });
        }
    });
}
/*用户绑定集团*/
function userBindCompany(userId,companyId,username,companyName) {
    $.messager.confirm('提示','确认将用户\"'+username+'\"成为集团\"'+companyName+'\"的集团用户?',function(r){
        if (r){
            $.ajax({
                url:"/i/company/addCompanyUser",
                type:"POST",
                data:{"userId":userId,"companyId":companyId},
                success:function (data) {
                    var message=data.status==1?"绑定失败！该用户已经绑定集团不得再次绑定":"绑定成功！\""+username+"\"已成为\""+companyName+"\"的集团用户！";
                    if (data.status==2){message="绑定失败！该用户和集团\""+companyName+"\"已成立绑定关系";}
                    $.messager.alert('提示',message,'info');
                    roleFlag==2?userToCompany(userId,username):companyToUser(companyId,companyName);
                }
            });
        }
    });
}
/*用户集团解绑*/
function userCompanyUnbind(userId,companyId,username,companyName) {
    $.messager.confirm('提示','确认将用户\"'+username+'\"和集团\"'+companyName+'\"解除绑定?',function(r){
        if (r){
            $.ajax({
                url:"/i/company/delCompanyUser",
                type:"POST",
                data:{"userId":userId,"companyId":companyId},
                success:function (data) {
                    $.messager.alert('提示',"解绑成功！",'info');
                    roleFlag==2?userToCompany(userId,username):companyToUser(companyId,companyName);
                }
            });
        }
    });
}
/*门店绑定集团*/
function rdcBindCompany(rdcId, companyId,rdcName,companyName) {
    $.messager.confirm('提示','确认将门店\"'+rdcName+'\"和集团\"'+companyName+'\"绑定?',function(r){
        if (r){
            $.ajax({
                url:"/i/company/addCompanyRdc",
                type:"POST",
                data:{"rdcId":rdcId,"companyId":companyId},
                success:function (data) {
                    var message=data.status==1?"绑定失败！该门店已经绑定集团不得再次绑定":"绑定成功！\""+rdcName+"\"已成为\""+companyName+"\"的集团用户！"
                    if (data.status==2){message="绑定失败！该门店和集团\""+companyName+"\"已成立绑定关系";}
                    $.messager.alert('提示',message,'info');
                    roleFlag==1?rdcToCompany(rdcId,rdcName):companyToRdc(companyId,companyName);
                }
            });
        }
    });
}
/*门店集团解绑*/
function rdcCompanyUnbind(rdcId, companyId,rdcName,companyName) {
    $.messager.confirm('提示','确认将门店\"'+rdcName+'\"和集团\"'+companyName+'\"解除绑定?',function(r){
        if (r){
            $.ajax({
                url:"/i/company/delCompanyRdc",
                type:"POST",
                data:{"rdcId":rdcId,"companyId":companyId},
                success:function (data) {
                    $.messager.alert('提示',"解绑成功！",'info');
                    roleFlag==1?rdcToCompany(rdcId,rdcName):companyToRdc(companyId,companyName);
                }
            });
        }
    });
}


//初始化数据
$().ready(function() {
    init_rdc("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeRdcTable()'>门店</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",rdcStyler,"#objTable","#div_filteri");
    $('#fddata').searchbox({searcher:function(value){
        params.keyword=value;
        reloaddata(params);
    }});
});

