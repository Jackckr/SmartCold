function gordcdile(sharid){window.location.href ="view/colddetail.html?id="+sharid; };
function goshadile(sharid){window.location.href ="view/storehousedetail.html?id="+sharid; };
function gordclist(){window.location.href =encodeURI("view/coldlist.html?key="+$("#searchdiv").val()) ;};
function gosharlist(){window.location.href ="view/coldlist.html?key="+$("#searchdiv").val(); };
$().ready(function() { 
	var province=null,shear=false;
	function initdata(){
		$.getJSON(ER.root+'/i/city/findProvinceList',function(data){
			province=data;
		});//
	};
	function seachList(em){
		var key= $(em).val();
		if(key!=""){
			$("#defseachdata").hide();
			$("#cuttseachdata").show();
			$.ajax({
	              type: "POST",
	              url:ER.root+"/i/UtilController/searchdata",
	              data:{keyword:key},//
	              success: function(data) {
	            	 $("#shearlist ul,#rdclist ul,#shartitle,#rdctitle").empty();
	                 if(data.success){
	                	 $("#nochdata").hide();
	                	 var vo=data.entity;
	                	 var rdcList=vo.rdcList;
	                	 var sharList=vo.sharList;
	                	 if(rdcList){
	     	   	         	  var html=[];var   rdcsList = rdcList.list;//
	     	   	         	  $("#rdctitle").html("冷库("+key+")信息 共 "+rdcList.total+"条");
	     	   	              $.each(rdcsList, function(index, item) {html.push("<li id="+item.id+" onclick='gordcdile("+item.id+")'>"+item.name+"</li>"); });
	     	   	              $("#rdclist ul").append(html.join(""));
	     	   	              $("#rdclist").show();
	                	 }
	                	 if(sharList){
	     	   	         	  var html=[];var   rdcsList = sharList.list;//
	     	   	         	  $("#shartitle").html("共享("+key+")信息 共 "+sharList.total+"条");
	     	   	              $.each(rdcsList, function(index, item) {html.push("<li id="+item.id+" onclick='goshadile("+item.id+")'>"+item.title+"</li>"); });
	     	   	              $("#shearlist ul").append(html.join(""));
	     	   	              $("#shearlist").show();
	                	 }
	                 }else{
	                	 $("#nochdata").show();
	                 }
	              }
	          });
		}else{
		    $("#shearlist ul,#rdclist ul,#shartitle,#rdctitle").empty();
			$("#defseachdata").show();
			$("#cuttseachdata").hide();
		}
	}
	function initevg(){
		 $("#searchdiv").keyup(function(event){
			seachList(this)
		 });
		 $("#city").click(function (e) {
			SelCity(this,e,province);
			$("#city").siblings('i').html('&#xe62e;');
		 });
		 $("#hf_back").click(function(){
				shear=false;
				$("#shearlist ul,#rdclist ul,#shartitle,#rdctitle").empty();
				$("#searchdiv").val("");
				$("#seachdata,#hf_back").hide();
				$("#maindiv,#hf_addres,#defseachdata").show();
		  });
		  $("#searchdiv").focus(function(){
			if(!shear){
				shear=true;
				$("#maindiv,#hf_addres").hide();
				$("#seachdata,#hf_back").show();
		   }
		});
		
	};
	initdata();
	initevg();
});

	



