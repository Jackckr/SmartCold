var  queryParams={urlindex:1,portinedx:1};
if ($.ajax) {jQuery.ajaxSetup({xhrFields:{withCredentials:true,contentType: "application/json; charset=utf-8"}});}//支持ajax跨域
var serurlmode=['http://139.196.41.18/','http://139.224.16.238/'],
serportmode=["i/util/getDFSData","i/util/getZSData","i/util/getZsDevStatus?type=1","i/util/getZsDevStatus?type=2","i/util/getZsDevStatus?type=3"];
var serverMode=[{val:0,text:"服务器1"},{val:1,text:"服务器2"}],
serverport=[{text:"温度监控",val:0},{text:"开门监控",val:1}];


function cellStyler(value,row,index){
	switch (queryParams.portinedx) {
	case 1:
	case 4:
		if (value < 4){
			return 'background-color:#ffee00;color:red;';
		}
		break;
	case 3:
		if (value < -90){
			return 'background-color:#ffee00;color:red;';
		}
		break;

	default:
		break;
	}
	return null;
	
}
function init_table(){
	var col=[[ 
	      	   {field:'ck',checkbox:true},
	      	   {field:'id',title:'任务编号',width:5,sortable:true},   
	      	   {field:'name',title:'任务名称',width:5,sortable:true},   
	           {field:'level',title:'级别',width:5,align:'center',sortable:true},   
	           {field:'count', title:'阈值',width:5,align:'center',sortable:true},   
	           {field:'is', title:'状态',width:5,align:'center',sortable:true},   
	           {field:'', title:'添加时间',width:5,align:'center',sortable:true},   
	           {field:'CU', title:'目标时间',width:5,align:'center',sortable:true},   
	           {field:'AI', title:'',width:5,align:'center',sortable:true},   
	           {field:'BI', title:'BI',width:5,align:'center',sortable:true},   
	           {field:'CI', title:'CI',width:5,align:'center',sortable:true},   
	           {field:'PWC', title:'PWC',width:5,align:'center',sortable:true},   
	           {field:'DU', title:'DU',width:5,align:'center',sortable:true,styler:cellStyler},   
	           {field:'BSI', title:'BSI',width:5,align:'center',sortable:true},   
	           {field:'MSI', title:'MSI',width:5,align:'center',sortable:true},   
	           {field:'time',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format},   
	        ]];
	  initTable("接口数据查询","dev_port", "POST", null, null,"#div_filteri",null, col,true, onDblClickRow);
}

function onDblClickRow(index,data){}


function chref(){
	var isrefdata=$("#txt_refdata:checked").val()?true:false;if(isrefdata){$("#showtime").show();
	if(reftime==undefined){
		refdata();
	}
	}else{$("#showtime").hide();resttime();}
}
function loaddata(){
	getdata();
}



var resttime=function(){if(reftime){clearInterval(reftime);}cuindex=30;};

var refdata=function(){
	 reftime=setInterval(function () {
		 		 if(cuindex>0){ 
		 			cuindex--;
		 		 }else{
		 			getdata();
		 			 cuindex=30; 
		 		  }
		 		em_diftime.html(cuindex);
		 	 }, 1000);
};
 
function getdata(){
	   $.ajax({ url:servermode[queryParams.urlindex]+serportmode[queryParams.portinedx],type: 'POST', success: function(data) { 
		   if(data==null||data==""){
			   clearTable();
			   return;
		   }
		   var rowdata={};//{ “total”:”30″,rows:[] }
		   if(queryParams.portinedx==0){
			   var tempdata=JSON.parse(data);
			   var infos=tempdata.infos;
			   rowdata.total=infos.length;
			   rowdata.rows=infos;
		   }else if(queryParams.portinedx==1){
			   var temp=[];
			   if(data.length>0){
				   $.each(data, function(i, vo){
				        var tempdata=JSON.parse(vo);
				        $.each(tempdata, function(i, vo){
				        	if(i==0){
				        		vo.datas.bj=1;
				        	}else{
				        		vo.datas.bj=0;
				        	}
				           vo.datas.devid=vo.devid;
				           vo.datas.time =new Date(vo.datas.time*1000);//   getLocalTime( vo.datas.time);
						   temp.push(vo.datas);
						});
					});
			   }
			   rowdata.total=temp.length;
			   rowdata.rows=temp;
		   }else{
			   var temp=[];
			   $.each(data, function(i, vo){
				   temp.push(vo);
			   });
			   rowdata.total=temp.length;
			   rowdata.rows=temp;
			   
		   }
		   objTable.datagrid("loadData",rowdata);
		   
		}
});
	
}
//初始化数据
$().ready(function() {
    init_table();
    objTable.datagrid({ pagination:false});
    $("#sel_serveradder").combobox({data:serverMode,value:1,  onChange:function(val){ queryParams.urlindex= val;  getdata();}});
    $("#sp_sel_serverport").combobox({data:serverport,value:1,  onChange:function(val){ }});
   
});//初始化数据
