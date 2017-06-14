var odlmode=0, queryParams={urlindex:0,portinedx:0,url:'http://139.196.41.18/',port:'i/util/getDFSData'};
var servermode=['http://139.196.41.18/','http://139.224.16.238/'],serportmode=["i/util/getDFSData","i/util/getDFSData","i/util/getZsDevStatus?type=1","i/util/getZsDevStatus?type=2","i/util/getZsDevStatus?type=3"];
var serverMode=[{val:0,text:"1"},{val:1,text:"2"}],serverport=[{text:"丹弗斯数据接口",val:0},{text:"洲斯数据接口",val:1},{text:"洲斯AP状态",val:2},{text:"洲斯DEV信号状态",val:3},{text:"洲斯DEV电池状态",val:4}];
var col1=[[ 
      	   {field:'ck',checkbox:true},
           {field:'tagname',title:'采集名称',width:5,align:'center',sortable:true},   
           {field:'currentvalue', title:'采集值',width:5,align:'center',sortable:true},   
           {field:'lasttime',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format}
        ]]
,col2=[[ 
      	   {field:'ck',checkbox:true},
      	   {field:'apid',title:'apid',width:5,sortable:true},   
      	   {field:'deviceid',title:'deviceid',width:5,sortable:true},   
           {field:'key',title:'key',width:5,align:'center',sortable:true},   
           {field:'value', title:'value',width:5,align:'center',sortable:true},   
           {field:'time',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format},   
        ]];

function init_table(){
	  initTable("接口数据查询","dev_data", "POST", null, null,"#div_filteri",null, col1,true, onDblClickRow);
}

function onDblClickRow(index,data){}


function chref(){
	var isrefdata=$("#txt_refdata:checked").val()?true:false;if(isrefdata){$("#showtime").show();}else{$("#showtime").hide();}
}
function loaddata(){
	 objTable.datagrid( { url:queryParams.url+queryParams.port});
}



var resttime=function(){if(reftime){clearInterval(reftime);}cuindex=30;};
var refdata=function(){
	 reftime=setInterval(function () {
		 		 if(cuindex>0){ 
		 			cuindex--;
		 		 }else{
		 			reloaddata();
		 			 cuindex=30; 
		 		  }
		 		em_diftime.html(cuindex);
		 	 }, 1000);
};

function getdata(){
	   $.ajax({ url: queryParams.url+queryParams.port,type: 'POST', success: function(data) { 
		   var rowdata={};
		   if(queryParams.portinedx==0){
			   var data=data.infos;
		   }else{
			   
		   }
//		   objTable.datagrid("loadData",{ “total”:”30″,rows:[] });
		   
		}
});
	
}
//初始化数据
$().ready(function() {
    init_table();
    $("#sel_serveradder").combobox({data:serverMode,value:0,  onChange:function(val){ queryParams.url=servermode[val],queryParams.urlindex= val;  getdata();}});
    $("#sel_serverport").combobox({data:serverport,value:0,   onChange:function(val){
    	queryParams.port=serportmode[val],queryParams.portinedx=val;  
    	if(val==0){
    		if(odlmode!=0){  objTable.datagrid({columns:col1});}
    	}else{
    		if(odlmode==0){ objTable.datagrid({columns:col2});}
    	}
    	getdata();
    }});
   
});//初始化数据
