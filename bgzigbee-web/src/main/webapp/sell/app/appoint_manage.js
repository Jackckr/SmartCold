var queryParams = {page: null, rows: null,status:null},slappion=[];
//======================================================================格式化col=======================================================

function del_apoint(){//删除
	var userIDs =  getTableCheckedID();
    if (userIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>'+userIDs.length+'</er>条预约信息吗?', function (r) {
            if (r) { 
            	$.ajax({  type: 'POST', url: '../../i/appointment/delByIds',traditional:true,data: { ids: userIDs },success: function (data) { 
            		if(data){
            			reloaddata();
            		}else{
            			$.messager.alert('错误', '删除失败！', 'error'); 
              } }}); }
        });
    } else {  
    	$.messager.alert('提示', '请选择操作的项目', 'info'); 
    }
};
function exq_apoint(isclick){
	if(!isclick){
		slappion= getTableCheckedID();
	}
    if (slappion.length > 0) {
    	$('#opoint_dialog').dialog('open');
    } else {  
    	$.messager.alert('提示', '请选择操作的项目', 'info'); 
    }
};
function upst_option(){//
	var data={ids:slappion,status:$("#opoint_dialog input[name='status']:checked").val(),commit:$("#txt_commit").val()};
    $.ajax({type: 'POST', url: '../../i/appointment/updatByIds',data:data,traditional:true,success: function(data) { 
        	$('#opoint_dialog').dialog({closed: true});
        	slappion.slice();
        	reloaddata();
		}
    });
	
}
function onDblClickRow(index, field) {
	slappion=[field.id];
	exq_apoint(true);
}//双击编辑用户信息


//======================================================================格式化col=======================================================
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'userName', title: '客户名称', width: 80, align: 'center', sortable: true},
        {field: 'telephone', title: '手机号', width: 80, align: 'center', sortable: true},
        {field: 'corporateName', title: '公司名称', width: 80, align: 'center', sortable: true},
        {field: 'note', title: '客户备注', width: 80, align: 'center', sortable: true},
        {field: 'comit', title: '处理备注', width: 80, align: 'center', sortable: true},
        {field: 'status', title: '状态', width: 100, align: 'center', formatter: tool.col_isdeal},
        {field: 'addTime', title: '添加时间', width: 80, align: 'center', sortable: true, formatter: tool.col_format}
    ]];
    initTable("预约演示", "icon-yy", "POST", "../../i/appointment/getList", queryParams, '#appion_filter', null, col, true, onDblClickRow);
//    objTable.datagrid({singleSelect: true});//设置为单选
}

//======================================================================初始化数据=======================================================
//初始化数据
$().ready(function () {
  init_table();
  $('#sel_appion_type').combobox({  onChange:function(val){ queryParams.status=val;  reloaddata(queryParams);}  }); 
});
//======================================================================初始化数据=======================================================


