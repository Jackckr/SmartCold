﻿function SelCity(obj,e,province) {
    var ths = obj;
    var dal = '<div class="_citys"><span title="关闭" id="cColse" >×</span><ul id="_citysheng" class="_citys0"><li class="citySel">省份</li><li>城市</li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div></div>';
    Iput.show({ id: ths, event: e, content: dal,width:"470"});
    $("#cColse").click(function () {
        Iput.colse();
        $("#city").siblings('i').html('&#xe62d;');
    });
    var tb_province = [];
    var b = province;
    
    for (var i = 0;i<b.length;  i++) {
    	 tb_province.push('<a data-level="0" data-id="' + b[i]['provinceId'] + '" data-name="' + b[i]['provinceName'] + '">' + b[i]['provinceName'] + '</a>');
    }
    $("#_citys0").append(tb_province.join(""));
    
    if(window.localStorage.appLocalprovince){
    	 $("#_citys0 a[data-id="+window.localStorage.appLocalprovince+"]").addClass("citysselect");//设置默认样式
    }
    $("#_citys0 a").click(function () {
       $("#_citys0 a").removeClass("heprselect");
    	    $(this).addClass("heprselect");
    	    window.localStorage.appLocalprovince=$(this).data('id');
	        $.get(ER.root+"/i/city/findCitysByProvinceId.json",{provinceID: $(this).data('id')}, function(data) {
	            var g = '';
	            for (var j = 0; j<data.length; j++) {
	                g += '<a data-level="1" data-id="' + data[j]['cityID'] + '" data-name="' + data[j]['cityName'] + '" title="' + data[j]['cityName'] + '">' + data[j]['cityName'] + '</a>';
	            }
	            $("#_citysheng li").removeClass("citySel");
	            $("#_citysheng li:eq(1)").addClass("citySel");

	        $("#_citys1 a").remove();
	        $("#_citys1").append(g);
	        if(  window.localStorage.appLocalCity ){
	        	 $("#_citys1 a[data-id="+JSON.parse(window.localStorage.appLocalCity).cityID+"]").addClass("citysselect");//设置默认样式
	        }
	        $("._citys1").hide();
	        $("._citys1:eq(1)").show();
	        $("#_citys0 a,#_citys1 a").removeClass("AreaS");
	        $(this).addClass("AreaS");
	        var lev = $(this).data("name");
	        ths.value = $(this).data("name");
	        if (document.getElementById("hcity") == null) {
	            var hcitys = $('<input>', {
	                type: 'hidden',
	                name: "hcity",
	                "data-id": $(this).data("id"),
	                id: "hcity",
	                val: lev
	            });
	            $(ths).after(hcitys);
	        }
	        else {
	            $("#hcity").val(lev);
	            $("#hcity").attr("data-id", $(this).data("id"));
	        }
	        $("#_citys1 a").click(function () {
	            $("#_citys1 a").removeClass("AreaS");
	            $(this).addClass("AreaS");
	            var lev =  $(this).data("name");
	            if (document.getElementById("hproper") == null) {
	                var hcitys = $('<input>', {
	                    type: 'hidden',
	                    name: "hproper",
	                    "data-id": $(this).data("id"),
	                    id: "hproper",
	                    val: lev
	                });
	                $(ths).after(hcitys);
	            }
	            else {
	                $("#hproper").attr("data-id", $(this).data("id"));
	                $("#hproper").val(lev);
	            }
	            var bc = $("#hcity").val();
	            ths.value = bc+ "-" + $(this).data("name");
	
//	            var ar = getArea($(this));
	            $("._citys1").hide();
	            $("._citys1:eq(2)").show();
	                        
	            var bp = $("#hproper").val();
	            ths.innerHTML=bp;
	            Iput.colse();
	            $("#city").siblings('i').html('&#xe62d;');
	            window.localStorage.appLocalCity =JSON.stringify({cityID:$(this).data("id"),cityName:bp});
	        });
        
        
        
        });//初始化城市
       // return;
    });
    $("#_citysheng li").click(function () {
        $("#_citysheng li").removeClass("citySel");
        $(this).addClass("citySel");
        var s = $("#_citysheng li").index(this);
        $("._citys1").hide();
        $("._citys1:eq(" + s + ")").show();
    });
}

function getCity(obj) {
    var c = obj.data('id');
    var e = province;
    var f;
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['id'] == parseInt(c)) {
            f = e[i]['city'];
            break
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }
    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(1)").addClass("citySel");
    return g;
}
function getArea(obj) {
    var c = obj.data('id');
    var e = area;
    var f = [];
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['pid'] == parseInt(c)) {
            f.push(e[i]);
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }

    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(2)").addClass("citySel");
    return g;
}