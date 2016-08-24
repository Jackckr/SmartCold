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
			$.ajax({
	              type: "POST",
	              url:ER.root+"/i/UtilController/searchdata",
	              data:{keyword:key},//
	              success: function(data) {
//	                 alert(d)
	              }
	          });
		}else{
			
		}
		  
	}
	function initevg(){
		$("#searchdiv").keydown(function(event){
			seachList(this)
		 });
		
		 $("#city").click(function (e) {
			SelCity(this,e,province);
			$("#city").siblings('i').html('&#xe62e;');
		});
		 $("#hf_back").click(function(){
				shear=false;
				$("#maindiv,#hf_addres").show();
				$("#seachdata,#hf_back").hide();
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

	



