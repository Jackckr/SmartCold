var  queryParams={urlindex:1,portinedx:1};
var servermode=['http://139.196.41.18/','http://139.224.16.238/'],serportmode=["i/util/getDFSData","i/util/getZSData","i/util/getZsDevStatus?type=1","i/util/getZsDevStatus?type=2","i/util/getZsDevStatus?type=3"];
var serverMode=[{val:0,text:"服务器1"},{val:1,text:"服务器2"}],serverport=[{text:"丹弗斯数据接口",val:0},{text:"洲斯数据接口",val:1},{text:"洲斯AP状态",val:2},{text:"洲斯DEV信号状态",val:3},{text:"洲斯DEV电池状态",val:4}];
var col1=[[ 
      	   {field:'ck',checkbox:true},
           {field:'tagname',title:'采集名称',width:5,align:'center',sortable:true},   
           {field:'currentvalue', title:'采集值',width:5,align:'center',sortable:true},   
           {field:'lasttime',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format}
        ]]
// objTable.datagrid({ fit:true,columns:col1,rowStyler: function(index,row){if (row.bj ==1){return 'background-color:#6293BB;color:#fff;font-weight:bold;';} }});
//{\"time\":1497430513,\"Temp\":3.76,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.07,\"BSI\":-96,\"apid\":\"00200003\",\"MSI\":24}
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
        ]],col3=[[ 
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
                ]];
function cellStyler(value,row,index){
	if (value < 4){
		return 'background-color:#ffee00;color:red;';
	}
}
function init_table(){
	  initTable("接口数据查询","dev_data", "POST", null, null,"#div_filteri",null, col2,true, onDblClickRow);
}

function onDblClickRow(index,data){}


function chref(){
	var isrefdata=$("#txt_refdata:checked").val()?true:false;if(isrefdata){$("#showtime").show();}else{$("#showtime").hide();}
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
		 			reloaddata();
		 			 cuindex=30; 
		 		  }
		 		em_diftime.html(cuindex);
		 	 }, 1000);
};
function getLocalTime(nS) {   return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17);}   
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
			   
			   
		   }
		   objTable.datagrid("loadData",rowdata);
		   
		}
});
	
}
//初始化数据
$().ready(function() {
    init_table();
    $("#sel_serveradder").combobox({data:serverMode,value:1,  onChange:function(val){ queryParams.urlindex= val; }});
    $("#sel_serverport").combobox({data:serverport,value:1,   onChange:function(val){
    	queryParams.portinedx=val;  
    	if(val==0){
    		 objTable.datagrid({ fit:true,columns:col1 });
    	}else if(val==2){ 
    		 objTable.datagrid({ fit:true,columns:col2 });
    	}else {
    		
    	}
    }});
   
});//初始化数据
