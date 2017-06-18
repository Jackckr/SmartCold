var oldrdc=undefined, queryParams = {page: null, rows: null, keyword: null};
function opendevdialog(){$('#dev_replaceForm').form('clear');$('#dev_replacedialog').dialog('open');}
function doSearch(value){objtree.tree({url:'../../i/rdc/getRdcTree?keyword='+value,method:'post'});}
function onSelect(node){if(node.id!=oldrdc){oldrdc=node.id;queryParams.rdcId=oldrdc;objTable.datagrid( {url:url, queryParams:queryParams });}}

function onDblClickRow(index, row){
	
	
	
}
function col_cellStyler(){
	
	
}
function replace_dev(){//更换设备
	var repldefvrom=$('#dev_replaceForm');
	if (! repldefvrom.form('validate')) {  return;}
    $.messager.confirm('警告', '确认替换设备?', function(r){if (r){
    	$('#userdialog').dialog({closed: false});
    	$.messager.progress({title:'Please waiting',msg:'Loading data...'});
    	var data=repldefvrom.serialize();
        $.ajax({type: 'POST', url: '../../i/deviceObjectMapping/replacedev',data:data,success: function(data) { 
        	    $.messager.progress('close');
        	    alert_infomsg(data.message);
    	}});
	}});
}


function init_table() {
	
	  var tool  = [{text:'清除无效设备',iconCls:'dev_del',handler:opendevdialog},{text:'更换设备',iconCls:'dev_replace',handler:opendevdialog},{text:'刷新',iconCls:'pagination-load',handler:reloaddata}];
	
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'deviceid', title: '设备编号', width: 80, align: 'center', sortable: true},
        {field: 'type', title: '设备类型', width: 80, align: 'center', sortable: true},
        {field: 'DU', title: '电压', width: 80, align: 'center', sortable: true},
        {field: 'BSI', title: '信号强度', width: 80, align: 'center', sortable: true},
        {field: 'state', title: '状态', width: 80, align: 'center', sortable: true},
        {field: 'joinst', title: '关联状态', width: 80, align: 'center', sortable: true},
        {field: 'addTime', title: '添加时间', width: 80, align: 'center', sortable: true},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: col_cellStyler}
    ]];
    
  
    
   objTable=$('#objTable').datagrid({
        title:"设备管理",
        iconCls: "dev_mang",
        method:"POST",
        queryParams:queryParams,
        fit:true,
        fitColumns:true,
        remoteSort: false,
        striped:true,
        rownumbers:true,
        toolbar:tool,
        columns:col,
        onLoadError:clearTable,
        onDblClickRow:onDblClickRow
     });
}


$().ready(function () {
	init_table();
	initTree('../../i/rdc/getRdcTree', onSelect);
	$("#_easyui_textbox_input1").keyup(function(){doSearch(this.value);});
});
