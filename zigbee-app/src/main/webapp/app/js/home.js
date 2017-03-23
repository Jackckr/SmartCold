function gordcdile(sharid){window.location.href ="view/colddetail.html?id="+sharid; };
function goshadile(sharid){window.location.href ="view/storehousedetail.html?id="+sharid; };
function gordclist() {var key=$("#searchdiv").val().trim();   window.localStorage.setItem("shdatakey", key); $("#searchdiv").val("");  window.location.href ="view/coldlist.html?key="+key;};
function gosharlist(){var key=$("#searchdiv").val().trim();   window.localStorage.setItem("shdatakey", key); $("#searchdiv").val("");  window.location.href ="view/coldlist.html?key="+key;   };
function goshkeylist(em){var key=$(em).attr("value");  window.localStorage.setItem("shdatakey", key); $("#searchdiv").val("");  window.location.href ="view/searchList.html?key="+key;};
$().ready(function() { 
	var province=null,sccsize=0,shear=false;
	if(window.localStorage.appLocalCity ){
    	 document.getElementById ("city").innerHTML =JSON.parse(window.localStorage.appLocalCity).cityName;
    }else{
    	  function myFun(result) {
    	        var cityName = "上海";
    	        if (result && result.name) { cityName = result.name;  }
    	        $.get(ER.root+'/i/city/findCityByName', { "CityName": cityName}, function(data) {
    	        	if(data!=null&&data!=undefined&&data!=""){
    	        	    document.getElementById ("city").innerHTML = data.cityName;
    	        	 	 window.localStorage.appLocalCity =JSON.stringify(data);
    	        	    }
    	        	else{
    	        		document.getElementById ("city").innerHTML = "上海";
    	        	    window.localStorage.appLocalCity='{"cityID":1,"cityName":"上海"}';//设置默认城市
    	        	}
    			});//
    	    }
    	    var myCity = new BMap.LocalCity();
    	    myCity.get(myFun);
    }
	function initdata(){
		if(localStorage.home_ProvinceList){
			province=JSON.parse(localStorage.home_ProvinceList);
		}else{
			$.getJSON(ER.root+'/i/city/findProvinceList',function(data){
				province=data;
				localStorage.home_ProvinceList=JSON.stringify(data);
			});//footer
		}
		
	};
	function  getSHHistory(){//获得搜索记录
		var hist=util.getCookie("mianshdt");
		if(hist){
		 var histlist=JSON.parse(hist);
		   var html=[]; 
		   $.each(histlist, function(index, item) {
               html.push('<li onclick="goshkeylist(this)" value='+item.key+'><span>'+item.key+'</span>&nbsp;(<span id="num">'+item.sccsize+'</span>)</li>');			   
		   });
		   $("#ul_hoist").html(html.join(''));
		}
	}
	function addshhist(key){//添加历史纪录
		key=key.trim();
		var hist=util.getCookie("mianshdt");
		var histjson=[];
		 if(hist){var i=-1; histjson=JSON.parse(hist);if(hist.indexOf(":\""+key+"\",")){$.each(histjson, function(index, item) {if(item.key==key){i=index; return false; }});if(i!=-1){ histjson.splice(i,1); }}if(histjson.length>=10){histjson.pop();}};
		histjson.unshift({'key':key,'sccsize':sccsize});
	    var	histdata=JSON.stringify(histjson);
	    util.setCookie("mianshdt",histdata,"d7");//保存7天
	    window.localStorage.setItem("shdatakey", key);
	}
	function initevg(){
		 $("#searchdiv").keyup(function(event){seachList(this);});
		 $("#del_hist").click(function (e) {$("#ul_hoist").empty();  util.delCookie("mianshdt"); });
		 $("#city").click(function (e) {if(province){SelCity(this,e,province);$("#city").siblings('i').html('&#xe62e;');} });
		$("#searchdivi").click(function() {
			var key = $("#searchdiv").val().trim();
			$("#searchdiv").val("");
			if(key != ""){
				addshhist(key);
				window.location.href = "view/searchList.html";
			}else{
				alert("请输入你要搜索的内容~")
			}			
		});
		$("#searchdiv").focus(function(){ _sysconfig.resize=false;if(!shear){shear=true;getSHHistory(); $("#maindiv,#hf_addres,#footer").hide();$("#seachdata,#hf_back").show();}});
		 $("#hf_back").click(function(){ _sysconfig.resize=true;shear=false;$("#shearlist ul,#rdclist ul,#shartitle,#rdctitle").empty();$("#searchdiv").val("");$("#seachdata,#hf_back").hide();$("#maindiv,#hf_addres,#defseachdata,#footer").show();});
	};
	initdata();
	initevg();
	function seachList(em){
		var key= $(em).val().trim();
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
	                	 sccsize=0;
	                	 if(rdcList){
	     	   	         	  var html=[];var   rdcsList = rdcList.list;//
	     	   	         	sccsize+=rdcList.total;
	     	   	         	  $("#rdctitle").html("冷库("+key+")信息 共 "+rdcList.total+"条");
	     	   	              $.each(rdcsList, function(index, item) {html.push("<li class='omg' id="+item.id+" onclick='gordcdile("+item.id+")'><i class='iconfont'>&#xe62f;</i>"+item.name+"</li>"); });
	     	   	              $("#rdclist ul").append(html.join(""));
	     	   	              $("#rdclist").show();
	                	 }
	                	 if(sharList){
	                		  sccsize+=sharList.total;
	     	   	         	  var html=[];var   rdcsList = sharList.list;//
	     	   	         	  $("#shartitle").html("共享("+key+")信息 共 "+sharList.total+"条");
	     	   	              $.each(rdcsList, function(index, item) {html.push("<li class='omg' id="+item.id+" onclick='goshadile("+item.id+")'><i class='iconfont'>&#xe62f;</i>"+item.title+"</li>"); });
	     	   	              $("#shearlist ul").append(html.join(""));
	     	   	              $("#shearlist").show();
	                	 }
	                 }else{
	                	 sccsize=0;
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
});
localStorage.removeItem("list_cache_coldlist");


	



