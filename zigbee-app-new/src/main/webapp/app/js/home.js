$().ready(function () {
    checkLocal();
    localStorage.removeItem('isStand');
    localStorage.removeItem('gowhere');
    localStorage.removeItem('oURL');
    localStorage.removeItem('goIndex');
    localStorage.removeItem('rdcId');
    localStorage.removeItem('moreId');
    localStorage.removeItem('match');
    localStorage.removeItem('RDC');
    localStorage.removeItem('cityShow');
    var province = null, sccsize = 0, shear = false;
    if (window.localStorage.appLocalCity) {
        document.getElementById("city").innerHTML = JSON.parse(window.localStorage.appLocalCity).cityName;
    } else {
        function myFun(result) {
            var cityName = "上海";
            if (result && result.name) {
                cityName = result.name;
            }
            $.get(ER.root + '/i/city/findCityByName', {"CityName": cityName}, function (data) {
                if (data != null && data != undefined && data != "") {
                    document.getElementById("city").innerHTML = data.cityName;
                    window.localStorage.appLocalCity = JSON.stringify(data);
                }
                else {
                    document.getElementById("city").innerHTML = "上海";
                    window.localStorage.appLocalCity = '{"cityID":1,"cityName":"上海"}';//设置默认城市
                }
            });//
        }

        var myCity = new BMap.LocalCity();
        myCity.get(myFun);
    }

    function initdata() {
        if (localStorage.home_ProvinceList) {
            province = JSON.parse(localStorage.home_ProvinceList);
        } else {
            $.getJSON(ER.root + '/i/city/findProvinceList', function (data) {
                province = data;
                localStorage.home_ProvinceList = JSON.stringify(data);
            });//footer
        }

    };

    function initevg() {
        $("#city").click(function (e) {
            if (province) {
                SelCity(this, e, province);
                $("#city").siblings('i').html('&#xe604;');
            }
        });
    };
    initdata();
    initevg();
    localStorage.removeItem("list_cache_coldlist");
});
function checkUserType() {//gds
    if (user == null) {
        location.href = "view/login.html"
    } else {
        $.ajax({
            type: "GET",
            url: ER.coldroot + '/i/user/getUserAuthen',
            data: {userId: user.id, type: user.type},
            success: function (data) {
                var oStatus = data.status;
                if (oStatus == 0) {//进入360
                    if (user.type == 1) {//货主--温度版
                        location.href = "temp/cold360.html"
                    } else if (user.type == 2) {//维修商--维修版
                        location.href = "maintaince/cold360.html"
                    } else {//库主--360所有版本
                        location.href = "view/cold360.html"
                    }
                } else if (oStatus == 2) {//角色认证
                    location.href = "view/coldRole.html"
                } else if (oStatus == 3) {//审核中
                    location.href = "view/audit.html"
                }
            }
        });
    }
}

	



