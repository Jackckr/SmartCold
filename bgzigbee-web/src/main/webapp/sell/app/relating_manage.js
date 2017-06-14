var  userParams={keyword:null};
var  rdcParams={keyword:null};
var  companyParams={keyword:null};
var  userToRdcParams={userId:null};
var  rdcToParams={rdcId:null};
var  companyToParams={companyId:null};
var roleFlag=1;//标记当前角色1.冷库2.用户3.集团
var saveUserId="";
var saveRdcId="";
var saverCompanyId="";

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
        onLoadError:onLoadError,
        onDblClickRow:onDblClickRow
    });
    if(fottol){
        objTable.datagrid().datagrid('getPager').pagination(fottol);	// get the pager of datagrid
    }
}

/*左用户操作按钮载入*/
function userStyler(value,row){
    return '<button class="btn" onclick="userToRdc('+ row.id+',\''+row.username+'\')">冷库关联</button><button class="btn btn-delete" onclick="userToCompany('+ row.id+',\''+row.username+'\')">集团关联</button>';
}
/*左冷库操作按钮载入*/
function rdcStyler(value,row){
    return '<button class="btn" onclick="rdcToUser('+ row.id+',\''+row.name+'\')">用户关联</button><button class="btn btn-delete" onclick="rdcToCompany('+ row.id+',\''+row.name+'\')">集团关联</button>';
}
/*左集团操作按钮载入*/
function companyStyler(value,row){
    return '<button class="btn" onclick="companyToRdc('+ row.id+',\''+row.name+'\')">冷库关联</button><button class="btn btn-delete" onclick="companyToUser('+ row.id+',\''+row.name+'\')">用户关联</button>';
}
/*中用户冷库解绑操作按钮*/
function userRdcUnbindStyler(value,row) {
    return '<button class="btn btn-delete" onclick="userRdcUnbind('+row.userid+','+ row.rdcid+')">解绑</button>';
}
/*中用户集团解绑操作按钮*/
function userCompanyUnbindStyler(value, row) {
    return '<button class="btn btn-delete" onclick="userCompanyUnbind('+row.userid+','+ row.companyid+')">解绑</button>';
}
/*中冷库集团解绑操作按钮*/
function rdcCompanyUnbindStyler(value, row) {
    return '<button class="btn btn-delete" onclick="rdcCompanyUnbind('+row.rdcid+','+ row.companyid+')">解绑</button>';
}
/*右用户绑定冷库操作按钮载入*/
function userToRdcStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+saveUserId+','+ row.id+')">绑定</button>';
}
/*右冷库绑定用户操作按钮载入*/
function rdcToUserStyler(value,row){
    return '<button class="btn" onclick="userBindRdc('+ row.id+','+saveRdcId+')">绑定</button>';
}
/*右用户绑定集团操作按钮载入*/
function userToCompanyStyler(value, row) {
    return '<button class="btn" onclick="userBindCompany('+saveUserId+','+ row.id+')">绑定</button>';
}
/*右冷库绑定集团操作按钮载入*/
function rdcToCompanyStyler(value, row) {
    return '<button class="btn" onclick="rdcBindCompany('+saveRdcId+','+ row.id+')">绑定</button>';
}
/*右集团绑定用户操作按钮载入*/
function companyToUserStyler(value, row) {
    return '<button class="btn" onclick="userBindCompany('+row.id+','+ saverCompanyId+')">绑定</button>';
}
/*右集团绑定冷库操作按钮载入*/
function companyToRdcStyler(value, row) {
    return '<button class="btn" onclick="rdcBindCompany('+row.id+','+ saverCompanyId+')">绑定</button>';
}





/*初始化用户表*/
function init_user(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'username',title:'用户名', width: 80, align: 'center',sortable:true},
        {field:'type',title:'用户类型', width: 80, align: 'center',sortable:true,formatter:getUserType},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/user/getUserList", userParams,searchTol,null, col,true, userOnDblClickRow,tableId);
}
/*初始化冷库表*/
function init_rdc(title,tol,tableId,searchTol){
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'name',title:'冷库名', width: 80, align: 'center',sortable:true},
        {field:'address',title:'冷库地址', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/rdc/getRdcDTOByPage", rdcParams,searchTol,null, col,true, rdcOnDblClickRow,tableId);
}
/*初始化集团表*/
function init_company(title,tol,tableId,searchTol) {
    var col=[[
        {field:'id',title:'ID',sortable:true},
        {field:'name',title:'集团名称', width: 80, align: 'center',sortable:true},
        {field:'address',title:'集团地址', width: 80, align: 'center',sortable:true},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", "../../i/company/getCompanyList", companyParams,searchTol,null, col,true, companyOnDblClickRow,tableId);
}
/*初始化用户冷库关联表*/
function init_userToRdc(title, tol, tableId,url,params) {
    var col=[[
        {field:'userid',title:'用户ID',sortable:true},
        {field:'user',title:'用户名', width: 80, align: 'center',sortable:true,formatter:getUserName},
        {field:'rdcid',title:'冷库ID', width: 80, align: 'center',sortable:true},
        {field:'rdc',title:'冷库名', width: 80, align: 'center',sortable:true,formatter:getRdcName},
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
/*初始化冷库集团关联表*/
function init_rdcToCompany(title, tol, tableId, url, params) {
    var col=[[
        {field:'companyid',title:'集团ID',sortable:true},
        {field:'company',title:'集团名', width: 80, align: 'center',sortable:true,formatter:getCompanyName},
        {field:'rdcid',title:'冷库ID', width: 80, align: 'center',sortable:true},
        {field:'rdc',title:'冷库名', width: 80, align: 'center',sortable:true,formatter:getRdcName},
        {field:'hand',title:'操作', width: 80, align: 'center',formatter:tol}
    ]];
    newInitTable(title,"icon-msgType", "POST", url, params,null,null, col,true, null,tableId);
}




/*用户双击事件*/
function userOnDblClickRow(index,field){

}
/*冷库双击事件*/
function rdcOnDblClickRow(index,field){

}
/*集团双击事件*/
function companyOnDblClickRow(index,field){

}



/*切换用户表*/
function changeUserTable(){
    init_user("<button style='margin-left: 10px' onclick='changeRdcTable()'>冷库</button><button onclick='changeUserTable()' style='background-color: #00a0e9;color: white;margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",userStyler,"#objTable","#div_filteri");
    roleFlag=2;
}
/*切换冷库表*/
function changeRdcTable(){
    init_rdc("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeRdcTable()'>冷库</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",rdcStyler,"#objTable","#div_filteri");
    roleFlag=1;
}
/*切换集团表*/
function changeCompanyTable(){
    init_company("<button style='margin-left: 10px' onclick='changeRdcTable()'>冷库</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='background-color: #00a0e9;color: white;margin-left: 10px'>集团</button>",companyStyler,"#objTable","#div_filteri");
    roleFlag=3;
}


/*获得用户具体类型*/
function getUserType(value) {
    if (value==0){
        return "冷库主";
    }else if (value==1){
        return "货主";
    }else if(value==2){
        return "维修商";
    }else {
        return "";
    }
}
/*获得冷库名*/
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



/*用户关联冷库*/
function userToRdc(id,username) {
    saveUserId=id;
    userToRdcParams.userId=id;
    init_rdc("请选择关联的冷库",userToRdcStyler,"#objTable2","#div_filteri");
    init_userToRdc("用户\""+username+"\"所关联的冷库",userRdcUnbindStyler,"#objTable1","../../i/rdcUser/getRdcUserByUserId",userToRdcParams);
}
/*用户关联集团*/
function userToCompany(id,username) {
    saveUserId=id;
    userToRdcParams.userId=id;
    init_company("请选择关联的集团",userToCompanyStyler,"#objTable2","#div_filteri");
    init_userToCompany("用户\""+username+"\"所关联的集团",userCompanyUnbindStyler,"#objTable1","../../i/companyUser/getByUserId",userToRdcParams);
}
/*冷库关联用户*/
function rdcToUser(id, rdcName) {
    saveRdcId=id;
    rdcToParams.rdcId=id;
    init_user("请选择关联的用户",rdcToUserStyler,"#objTable2","#div_filteri");
    init_userToRdc("冷库\""+rdcName+"\"所关联的用户",userRdcUnbindStyler,"#objTable1","../../i/rdcUser/getRdcUserByRdcId",rdcToParams);
}
/*冷库关联集团*/
function rdcToCompany(id, rdcName) {
    saveRdcId=id;
    rdcToParams.rdcId=id;
    init_company("请选择关联的集团",rdcToCompanyStyler,"#objTable2","#div_filteri");
    init_rdcToCompany("冷库\""+rdcName+"\"所关联的集团",rdcCompanyUnbindStyler,"#objTable1","../../i/companyRdc/getByRdcId",rdcToParams);
}
/*集团关联用户*/
function companyToUser(id, companyName) {
    saverCompanyId=id;
    companyToParams.companyId=id;
    init_user("请选择关联的用户",companyToUserStyler,"#objTable2","#div_filteri");
    init_userToCompany("集团\""+companyName+"\"所关联的用户",userCompanyUnbindStyler,"#objTable1","../../i/companyUser/getByCompanyId",companyToParams);
}
/*集团关联冷库*/
function companyToRdc(id, companyName) {
    saverCompanyId=id;
    companyToParams.companyId=id;
    init_rdc("请选择关联的冷库",companyToRdcStyler,"#objTable2","#div_filteri");
    init_rdcToCompany("集团\""+companyName+"\"所关联的冷库",rdcCompanyUnbindStyler,"#objTable1","../../i/companyRdc/getByCompanyId",companyToParams);
}





/*用户绑定冷库*/
function userBindRdc(userId,rdcId) {

}
/*用户冷库解绑*/
function userRdcUnbind(userId,rdcId){

}
/*用户绑定集团*/
function userBindCompany(userId,companyId) {

}
/*用户集团解绑*/
function userCompanyUnbind(userId,companyId) {

}
/*冷库绑定集团*/
function rdcBindCompany(rdcId, companyId) {

}
/*冷库集团解绑*/
function rdcCompanyUnbind(rdcId, companyId) {

}


//初始化数据
$().ready(function() {
    init_rdc("<button style='background-color: #00a0e9;color: white;margin-left: 10px' onclick='changeRdcTable()'>冷库</button><button onclick='changeUserTable()' style='margin-left: 10px'>用户</button><button onclick='changeCompanyTable()' style='margin-left: 10px'>集团</button>",rdcStyler,"#objTable","#div_filteri");
    $('#fddata').searchbox({searcher:function(value){
        if(roleFlag==1){
            rdcParams.keyword=value;
            reloaddata(rdcParams);
        }else if (roleFlag==2){
            userParams.keyword=value;
            reloaddata(userParams);
        }else {
            companyParams.keyword=value;
            reloaddata(companyParams);
        }
    }});
});
