var  queryParams={urlindex:1,portinedx:1};
var servermode=['http://139.196.41.18/','http://139.224.16.238/'],serportmode=["i/util/getDFSData","i/util/getZSData","i/util/getZsDevStatus?type=1","i/util/getZsDevStatus?type=2","i/util/getZsDevStatus?type=3"];
var serverMode=[{val:0,text:"服务器1"},{val:1,text:"服务器2"}],serverport=[{text:"洲斯数据接口",val:1},{text:"洲斯AP状态",val:2},{text:"洲斯DEV信号状态",val:3},{text:"洲斯DEV电池状态",val:4}];
if(parent.sysuser.type>1){serverport.unshift(	{text:"丹弗斯数据接口",val:0});}
var col1=[[ 
      	   {field:'ck',checkbox:true},
           {field:'tagname',title:'采集名称',width:5,align:'center',sortable:true},   
           {field:'currentvalue', title:'采集值',width:5,align:'center',sortable:true},   
           {field:'lasttime',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format}
        ]]
	,col2=[[ 
	      	   {field:'ck',checkbox:true},
	      	   {field:'apid',title:'apid',width:5,sortable:true},   
	      	   {field:'devid',title:'devid',width:5,sortable:true},   
	           {field:'Temp',title:'Temp',width:5,align:'center',sortable:true},   
	           {field:'Switch', title:'Switch',width:5,align:'center',sortable:true},   
	           {field:'AU', title:'AU',width:5,align:'center',sortable:true},   
	           {field:'BU', title:'BU',width:5,align:'center',sortable:true},   
	           {field:'CU', title:'CU',width:5,align:'center',sortable:true},   
	           {field:'AI', title:'AI',width:5,align:'center',sortable:true},   
	           {field:'BI', title:'BI',width:5,align:'center',sortable:true},   
	           {field:'CI', title:'CI',width:5,align:'center',sortable:true},   
	           {field:'PWC', title:'PWC',width:5,align:'center',sortable:true},   
	           {field:'DU', title:'DU',width:5,align:'center',sortable:true,styler:cellStyler},   
	           {field:'BSI', title:'BSI',width:5,align:'center',sortable:true},   
	           {field:'MSI', title:'MSI',width:5,align:'center',sortable:true},   
	           {field:'time',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format},   
	        ]]
     ,col3=[[ 
              	   {field:'ck',checkbox:true},
              	   {field:'apid',title:'apid',width:5,sortable:true},   
              	   {field:'deviceid',title:'deviceid',width:5,sortable:true},   
                   {field:'key',title:'key',width:5,align:'center',sortable:true},   
                   {field:'value', title:'value',width:5,align:'center',sortable:true,styler:cellStyler},   
                   {field:'time',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format},   
         ]];
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
	  initTable("接口数据查询","dev_port", "POST", null, null,"#div_filteri",null, col2,true, onDblClickRow);
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
    $("#sel_serverport").combobox({data:serverport,value:1,   onChange:function(val){
    	queryParams.portinedx=val;  
    	if(val==0){
    		 objTable.datagrid({columns:col1 });
    	}else if(val==1){ 
    		 objTable.datagrid({columns:col2 });
    	}else {
    		 objTable.datagrid({columns:col3 });
    	}
    	getdata();
    }});
   
});//初始化数据
