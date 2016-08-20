$().ready(function() { 
	var province=null;
	function initdata(){
		$.getJSON(ER.root+'/i/city/findProvinceList',function(data){
			province=data;
		});//
	};
	function seachList(em){
		
		
		
	}
	function initevg(){
		 $("#city").click(function (e) {
			SelCity(this,e,province);
			$("#city").siblings('i').html('&#xe62e;');
		});
	};
	initdata();
	initevg();
});

	



