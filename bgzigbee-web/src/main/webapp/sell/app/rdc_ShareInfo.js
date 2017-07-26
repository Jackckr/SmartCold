var  queryParams={type:null,stauts:null,startTime:null, endTime:null,keyword:null},slrdc=undefined;
/*转换时间格式的方法*/
function isStauts(value) { return value==1?"有效": "无效";}
function getRdcAttr(value) {  if (value){ return value.name; }else {  return "暂无"; }}
function formatDate(date) { var d = new Date(date);return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();}
function cellStyler(value,row){ return '<button class="btn" onclick="ck('+ row.id+')">查看</button><button class="btn btn-delete" onclick="dl('+ row.id+')">删除</button>';}
function init_table(){
    var col=[[
        { field:'ck',checkbox:true},
        {field:'id',title:'ID',sortable:true},
        {field:'title',title:'标题',width:80,align:'center',sortable:true},
//      {field:'rdcEntity',title:'冷库名称',width:80,sortable:true,formatter:getRdcAttr},
        {field:'note',title:'内容',width:80,align:'center',sortable:true},
        {field:'stauts',title:'状态',width:80,align:'center',sortable:true,formatter:isStauts},
        {field:'typeText',title:'共享类型',width:40,align:'center',sortable:true},
        {field:'telephone',title:'联系电话',width:40,align:'center',sortable:true},
//      {field:'detlAddress', title:'出发地-目的地',width:40,align:'center',sortable:true},
//      {field:'updatetime',title:'更新时间',width:40,align:'center',sortable:true,formatter:tool.col_format},
        {field:'hand',title:'操作',width:100,align:'center',formatter:cellStyler}
    ]];
    initTable("冷库信息共享","icon-msgType", "POST", "../../i/rdcShareInfo/getRdcShareInfo", queryParams,"#div_filteri",null, col,true, onDblClickRow);

}
function myformatter(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
function myparser(s){
	if (!s) return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0],10);
	var m = parseInt(ss[1],10);
	var d = parseInt(ss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
		return new Date(y,m-1,d);
	} else {
		return new Date();
	}
}
function onDblClickRow(index,field){ ck(field.id);}
function startTime(date){ queryParams.startTime=formatDate(date); reloaddata(queryParams);}
function endTime(date){queryParams.endTime=formatDate(date); reloaddata(queryParams);}
function chanrdc(keyword){ $.ajax({type: 'get',url: '/i/rdc/findRdcList',data: {rows: 20,keyword:keyword},success: function (data) {$("#sel_rdc_slid").combobox("loadData", data);}});}
function initTempTpe(keyword){ $.ajax({type: 'get',url: '/i/rdc/findAllTemperType',data: {rows: 20,keyword:keyword},success: function (data) {$("#sel_temperType_slid").combobox("loadData", data);}});}
function searchData() {  queryParams.startTime=$("#startTime").val(); queryParams.endTime=$("#endTime").val(); queryParams.type=$("#sel_type option:selected").val(); queryParams.stauts=$("#sel_stauts option:selected").val();queryParams.keyword=$("#search").val(); reloaddata(queryParams);}
//1.发布冷库===================================================================================
function initrdclist(){
	chanrdc();initTempTpe();//-- 租期1.1个月以下2.1~3 3.3~6 4.6~9 5.一年以上 6.两年以上 7.三年以上 8.五年以上
	$('#addstorageShareInfodialog').dialog('open');
}
function add_storageSharinfo(){
	 var vo ={}, formdata = new FormData(),input = $("input[type='file']"), parnArray = $("#addstorageForm").serializeArray();
     $.each(input,function(index,item){  for (var i = 0; i < item.files.length; i++) { formdata.append('fileData['+i+']',item.files[0]); }});
     $.each(parnArray,function(index,item){  vo[item.name] = item.value; });
     if(vo.rdcId!=slrdc.id){ $.messager.alert('错误', '请选择完整的冷库信息！', 'error'); return;}
     vo.detlAddress=slrdc.address;
     vo.provinceid=slrdc.provinceid;
     vo.cityId= slrdc.cityId;
     vo.uid= slrdc.userId;
     if(!vo.uid){vo.uid=1;};
     formdata.append("data",JSON.stringify(vo));
     $.ajax({
           url: "../../i/rdcShareInfo/shareFreeRelease",
           data: formdata,
           processData: false,
           contentType: false,
           type: 'POST',
           success: function(data){
        	   $("#addstorageForm").clear();
        	   $('#addstorageShareInfodialog').dialog('close');
        	   $.messager.alert('', '删除冷库共享信息失败！', 'error');
              
           }
      });
	
}

//===================================================================================
/*批量删除*/
function delRdcShares() {
    var rdcShares = getTableCheckedID();
    if (rdcShares.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + rdcShares.length + '</er>条冷库共享信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '/i/rdcShareInfo/delRdcShareInfoByIds',
                    traditional: true,
                    data: {'rdcShares': rdcShares},
                    success: function (data) {
                        if (data.status == 0) { reloaddata(); } else { $.messager.alert('错误', '删除冷库共享信息失败！', 'error'); }
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除冷库共享信息', '您还没有选择冷库共享信息哦', 'info');
    }
}
/*查看冷库共享详细信息*/
function ck(id) {
    $.ajax({
        url:"/i/rdcShareInfo/getRdcShareInfoById",
        type:"post",
        data:{"id":id},
        dataType:"json",
        success:function (data) {
            $("#share_title").html(data.title!=undefined?data.title:"");
            $("#share_coldName").html(data.rdcEntity!=undefined?data.rdcEntity.name:"");
            $("#share_type").html(data.typeText!=undefined?data.typeText:"");
            $("#validStartTime").html(data.validStartTime!=undefined?data.validStartTime:"");
            $("#validEndTime").html(data.validEndTime!=undefined?data.validEndTime:"");
            $("#share_address").html(data.detlAddress!=undefined?data.detlAddress:"");
            $("#share_filings").html(data.bookings!=undefined?data.bookings:"");
            $("#share_phone").html(data.telephone!=undefined?data.telephone:"");
            $("#share_note").html(data.note!=undefined?data.note:"");
        }
    });
    $('#showShareInfo').dialog('open');
}
function dl(id) {
    var flag = confirm("确认删除？");
    if(!flag){return;}
    $.ajax({  url:"/i/rdcShareInfo/delRdcShareInfoById",type:"post", data:{"id":id},  success:function () { 
      reloaddata(queryParams); 
    } });
}
//初始化数据
$().ready(function() {
    init_table();
    initrdclist();
    $('#sel_type').combobox({onChange:function(val){ queryParams.type=val;  reloaddata(queryParams);}});
    $('#sel_stauts').combobox({onChange:function(val){ queryParams.stauts=val;  reloaddata(queryParams);}});
    $('#fddata').searchbox({searcher:function(value){queryParams.keyword=value;  reloaddata(queryParams);}});
    $('#sel_rdc_slid').combobox({valueField: 'id',textField: 'name',onSelect:function(record){slrdc=record; }});
    $('#sel_temperType_slid').combobox({valueField: 'id',textField: 'type',onSelect:function(record){this.dataval= record.id}});

    
});//初始化数据