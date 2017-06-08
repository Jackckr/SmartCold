
//查询模型
var userrole=3;
var reftime=null,cuindex=30,em_diftime=null, queryParams={}, timetypevl=[1,1,3,6,12,24];
function initsel_lister(){
	    em_diftime=$("#em_diftime");
	    var datatypeMode=[{val:"3",text:"DEV数据"},{val:"2",text:"DEV状态"},{val:"1",text:"AP状态"}];
	    var timetypeMode=[{val:1,text:"近一小时"},{val:2,text:"近3小时"},{val:3,text:"近6小时"},{val:4,text:"近一天"}];
	    var datastypeMode= [[],
	                        [{val:"",text:"==全部=="},{val:"'MSI'",text:"MSI"},{val:"'LAC'",text:"LAC"},{val:"'CID'",text:"CID"}],
	                        [{val:"",text:"==全部=="},{val:"'BSI'",text:"BSI"},{val:"'DU'",text:"DU"}],
	                        [{val:"",text:"==全部=="},{val:"'Temp'",text:"温度"},{val:"'Switch'",text:"门"},{val:"'AU','BU','CU'",text:"电压"},{val:"'AI','BI','CI'",text:"电流"},{val:"'PWC'",text:"电量"}]
	    ];
	  if(userrole>2){timetypeMode.push({val:5,text:"全部"});timetypeMode.push({val:6,text:"自定义"});}
	  $("#sel_type").combobox({data:datatypeMode,value:3,   onChange:function(type){ $("#sel_stype").combobox({data:datastypeMode[type],value:""});if(type==1){$("#sp_txt_devid").hide(); }else{$("#sp_txt_devid").show(); } }});
	  $("#sel_stype").combobox({data:datastypeMode[3],value:""});
	  $("#sel_time").combobox({data:timetypeMode,value:1,   onChange:function(time){if(time==6){$("#sp_sel_sltime").show();}else{$("#sp_sel_sltime").hide();} }});
}
function inittime(){
}


function init_table(){
	   var col=[[ 
	       	   {field:'ck',checkbox:true},
	       	   {field:'id',title:'ID',sortable:true},   
	       	   {field:'apid',title:'apid',width:5,sortable:true},   
	       	   {field:'deviceid',title:'deviceid',width:5,sortable:true},   
               {field:'key',title:'key',width:5,align:'center',sortable:true},   
               {field:'value', title:'value',width:5,align:'center',sortable:true},   
               {field:'time',title:'采集时间',width:10,align:'center',sortable:true,formatter:tool.col_format},   
               {field:'addtime',title:'上传时间',width:10,align:'center',sortable:true,formatter:tool.col_format},  
	         ]];
	  initTable("设备数据查询","dev_data", "POST", null, queryParams,"#div_filteri",null, col,true, onDblClickRow);
}

function onDblClickRow(index,data){}

function getNowFormatDate(date) {
    var seperator1 = "-",seperator2 = ":", month = date.getMonth() + 1, strDate = date.getDate();
    if (month >= 1 && month <= 9) {  month = "0" + month;  }
    if (strDate >= 0 && strDate <= 9) { strDate = "0" + strDate;  }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
}



function loaddata(){
	var stime=null,etime=null;queryParams=getFormData("#from_fillter");
	if(queryParams.dataType==1){//AP状态数据
		if(queryParams.apid==""){alert_infomsg("请输入apid!")   ;resttime();    return;}
	}else if(queryParams.dataType==2||queryParams.dataType==3){//DEV状态数据
		if(queryParams.apid==""&&queryParams.devid==""){alert_infomsg("请输入devid或者apid!"); resttime();   return;}
	}
	if(queryParams.time<5){
		etime= new Date(),etimes= etime.getTime(),stime=new Date(etimes-3600000*timetypevl[queryParams.time]);
		etime=	getNowFormatDate(etime),stime=	getNowFormatDate(stime);
	}else{
		if(queryParams.time==5){
			etime=stime=null;
		}else{
			etime=$('#end_time').val(),stime=$('#start_time').val();
		}
	}
	queryParams.startTime=stime;
	queryParams.endTime=etime;
	queryParams.desc=$("#txt_desc:checked").val()?true:false;
	queryParams.refdata=$("#txt_refdata:checked").val()?true:false;
	if(queryParams.refdata){ 
		refdata();
	}else{
		resttime();
	}
	objTable.datagrid( { url:'../../i/Data/findDEVDataByFilter',queryParams:queryParams });
}

function chref(){
	var isrefdata=$("#txt_refdata:checked").val()?true:false;if(isrefdata){$("#showtime").show();}else{$("#showtime").hide();}
}
var resttime=function(){
	if(reftime){clearInterval(reftime);}
	cuindex=30;
};
var refdata=function(){
	 reftime=setInterval(function () {
		 		 if(cuindex>0){ 
		 			cuindex--;
		 		 }else{
		 			objTable.datagrid( {queryParams:queryParams });
		 			 cuindex=30; 
		 		  }
		 		em_diftime.html(cuindex);
		 	 }, 1000);
};
//初始化数据
$().ready(function() {
	inittime();
	initsel_lister();
    init_table();
   
});//初始化数据
