var honorPicsArr=[];
var storagePicsArr=[];
var standPic=[];
var auditPic=[];
var honorPicsArrOriginal=0;
var storagePicsArrOriginal=0;
var auditPicOriginal=0;
var standPicOriginal=0;
var addRdcFlag = true;
var delIds=[];
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
checkLogin();
/*冷库图片change*/
function storagePicChange(e) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics")); return;
        }else if(files[i].size > 10485760){
            layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));return;
        }else if(storagePicsArr.length>=5) {
            layer.alert('冷库图片最多5张！', {icon: 2});showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));return;
        }
        storagePicsArr.push(files[i]);
    }
    showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));
}
/*资质荣誉图change*/
function honorPicChange(e) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics")); return;
        }else if(files[i].size > 10485760){
            layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));return;
        }else if(honorPicsArr.length>=8) {
            layer.alert('冷库图片最多8张！', {icon: 2});showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));return;
        }
        honorPicsArr.push(files[i]);
    }
    showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));
}
/*认证图片change*/
function auditPicChange(e) {
    if (!rFilter.test(e.files[0].type)) {
        layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(auditPic,auditPicOriginal,"audit",$("#auditPic")); return;
    }else if(e.files[0].size > 10485760){
        layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics(auditPic,auditPicOriginal,"audit",$("#auditPic"));return;
    }
    auditPic[0]=e.files[0];
    showSelectPics(auditPic,auditPicOriginal,"audit",$("#auditPic"));
}
/*达标图片change*/
function standPicChange(e) {
    if (!rFilter.test(e.files[0].type)) {
        layer.alert('格式错误~请选择格式为' + msg + '的图片~！', {icon: 2}); showSelectPics(standPic,standPicOriginal,"standard",$("#standardPic")); return;
    }else if(e.files[0].size > 10485760){
        layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics(standPic,standPicOriginal,"standard",$("#standardPic"));return;
    }
    standPic[0]=e.files[0];
    showSelectPics(standPic,standPicOriginal,"standard",$("#standardPic"));
}
/*显示已选图片*/
function showSelectPics(arr,Original,imgId,mark) {
    var storagePicImg=[];
    for(var i=0;i<Original;i++){
        storagePicImg.push('<li class="imgBox"><img src="'+arr[i].location+'" alt=""><i onclick="del'+imgId+'('+i+','+arr[i].id+')">&times;</i></li>');
    }
    if(arr.length!=Original){
        for(var i=Original;i<arr.length;i++){
            storagePicImg.push('<li class="imgBox"><img id="'+imgId+i+'" alt=""><i onclick="del'+imgId+'('+i+')">&times;</i></li>');
        }
    }
    mark.empty().append(storagePicImg.join(''));
    for(var i=Original;i<arr.length;i++){
        var oFile = arr[i];
        var oImage = document.getElementById(imgId+i);
        eval("var oImage"+i+"=oImage;var oReader"+i+" = new FileReader();oReader"+i+".onload = function(e) {oImage"+i+".src = e.target.result;};oReader"+i+".readAsDataURL(oFile);");
    }
}
/*删除显示图片*/
function delstorage(index,id) {
    storagePicsArr.splice(index,1);
    if(id){delIds.push(id);storagePicsArrOriginal--;}
    showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));
}
function delhonor(index,id) {
    honorPicsArr.splice(index,1);
    if(id){delIds.push(id);honorPicsArrOriginal--;}
    showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));
}
function delaudit() {
    auditPic.splice(0,1);
    showSelectPics(auditPic,auditPicOriginal,"audit",$("#auditPic"));
}
function delstandard() {
    standPic.splice(0,1);
    showSelectPics(standPic,standPicOriginal,"standard",$("#standardPic"));
}
/*提交冷库信息*/
function addColdSubmit() {
    var ii = layer.load();
    var parnArray = $("#submitRdc").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(vo);
    if(flag){
        var formdata = new FormData();
        $.each(storagePicsArr, function (index, item) {
            formdata.append('file' + index, item);
        });
        $.each(honorPicsArr, function (index, item) {
            formdata.append('honor' + index, item);
        });
        $.each(standPic, function (index, item) {
            formdata.append('standPic', item);
        });
        $.each(auditPic, function (index, item) {
            formdata.append('auditPic', item);
        });


        formdata.append("empStr", JSON.stringify(vo));
        formdata.append("user",JSON.stringify(window.lkuser));
        $.ajax({
            url: "/i/rdc/newAddRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                layer.close(ii);
                layer.alert(data.message, {icon: 1},function () {
                    window.location.href="/view/html/rdclist.html";
                });
            }
        });
    }else {
        layer.close(ii);
    }
}
/*获得修改冷库信息*/
function getFormValue(rdcId) {
    $("#submitTitle").html("修改冷库 (带*为必填项)");
    $("#submitButton").empty().append('<td colspan="2"><button class="oBtn" onclick="updateColdSubmit()">提交</button></td>');
    $("#submitRdc").append('<input type="hidden" name="rdcId" value="'+rdcId+'"/>');
    $.ajax({url:"/i/rdc/findRDCDTOByRDCId",type:"get",data:{"rdcID":rdcId},success:function (data) {
        var rdc=data[0];
        initCityList(rdc.provinceId);
        getDataToForm($("#submitRdc [name]").not("[name=openLIne],[name=isJoinStand]"),rdc);
        if(rdc.openLIne){$("#submitRdc input[name=openLIne][value='"+rdc.openLIne+"']").attr("checked","checked");}
        if(rdc.isJoinStand){$("#submitRdc input[name=isJoinStand][value='"+rdc.isJoinStand+"']").attr("checked","checked");}
        if(rdc.isJoinStand==1){$("#li1").show()}
        if(rdc.isJoinStand==2){$("#li2").show()}
        if (rdc.audit==2){$("#coldAudit").hide();}
        if (rdc.istemperaturestandard==1){$("#tempStandDiv,#tempStandUl").hide();}
        if(rdc.lihuoRoom==1){$("#lihuoAreaTr").show();}
        storagePicsArrOriginal=rdc.storagePics.length;
        honorPicsArrOriginal=rdc.honorPics.length;
        $.each(rdc.storagePics,function (index, item) {
            storagePicsArr.push(item);
        });
        $.each(rdc.honorPics,function (index, item) {
            honorPicsArr.push(item);
        });
        showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));
        showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));
    }});
}
/*提交修改冷库信息*/
function updateColdSubmit() {
    var ii = layer.load();
    var parnArray = $("#submitRdc").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(vo);
    if(flag){
        var formdata = new FormData();
        $.each(storagePicsArr, function (index, item) {
            formdata.append('file' + index, item);
        });
        $.each(honorPicsArr, function (index, item) {
            formdata.append('honor' + index, item);
        });
        $.each(standPic, function (index, item) {
            formdata.append('standPic', item);
        });
        $.each(auditPic, function (index, item) {
            formdata.append('auditPic', item);
        });
        formdata.append("empStr", JSON.stringify(vo));
        formdata.append("user",JSON.stringify(window.lkuser));
        formdata.append("delIds",delIds.join());
        $.ajax({
            url: "/i/rdc/newUpdateRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                layer.close(ii);
                layer.alert(data.message, {icon: 1},function () {
                    window.location.href="/view/html/rdclist.html";
                });
            }
        });
    }else {
        layer.close(ii);
    }
}

// 获取冷库经营类型
function getStorageManage() {
    var manageList=[];
    $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            manageList.push('<option value="'+val.id+'">'+val.type+'</option>');
        });
        $("#manageType").empty().append(manageList.join(''));
    }});
}

// 获取冷库结构类型
function getStructures() {
    var structures=[];
    $.ajax({url:"/i/rdc/findAllStorageStructureType",type:"get",success:function (data) {
        structures.push('<option value="0"></option>');
        supportForeach();
        data.forEach(function (val, index) {
            structures.push('<option value="'+val.id+'">'+val.type+'</option>');
        });
        $("#structure").empty().append(structures.join(''));
    }});
}

// 获取冷库温度类型
function getTemperTypes() {
    var temperTypes=[];
    $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            temperTypes.push('<option value="'+val.id+'">'+val.type+'</option>');
        });
        $("#temperType").empty().append(temperTypes.join(''));
    }});
}

// 获取商品存放类型
function getStorageTypes() {
    var storageTypes=[];
    $.ajax({url:"/i/rdc/findAllStorageType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            storageTypes.push('<option value="'+val.id+'">'+val.type+'</option>');
        });
        $("#storageType").empty().append(storageTypes.join(''));
    }});
}

// 制冷剂类型
function getStorageRefregs() {
    var storageRefregs=[];
    $.ajax({url:"/i/rdc/findAllStorageRefreg",type:"get",success:function (data) {
        storageRefregs.push('<option value="0"></option>');
        supportForeach();
        data.forEach(function (val, index) {
            storageRefregs.push('<option value="'+val.id+'">'+val.type+'</option>');
        });
        $("#storageRefreg").empty().append(storageRefregs.join(''));
    }});
}


/*获得所有的省市*/
function getProvinceList() {
    var provinceList=[];
    $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            provinceList.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
        });
        $("#provinceId").empty().append(provinceList.join(''));
    }});
}
/*初始化城市列表*/
function initCityList(proId) {
    var cityList=[];
    $.ajax({url:"/i/city/findCitysByProvinceId",async: false,type:"get",data:{"provinceID":proId},success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            cityList.push('<option value="'+val.cityID+'">'+val.cityName+'</option>');
        });
        $("#cityId").empty().append(cityList.join(''));
    }});
}
/*通过省市id获得城市*/
function getCityListByProId(id) {
    var proId;
    $("#provinceId").val()?proId=$("#provinceId").val():proId=1;
    initCityList(proId);
}
/*提交冷库验证方法*/
function coldValidation(vo) {
    if (!addRdcFlag) {
        layer.alert('冷库名已存在！', {icon: 2});
        return false;
    }
    if (storagePicsArr.length<3) {
        layer.alert('冷库图片,最少上传三张图片！', {icon: 2});
        return false;
    }
    if (vo.name.trim() == "" || vo.provinceId.trim() == "" || vo.cityId.trim() == "" || vo.address.trim() == "" || vo.area.trim() == ""
        || vo.manageType.trim() == "" || vo.storageType.trim() == "" || vo.temperType.trim() == ""||vo.rentSqm.trim()==""||
        vo.height.trim()=="" || vo.phoneNum.trim() == ""|| !vo.openLIne) {
        layer.alert('请完善冷库信息！', {icon: 2});
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
    var countRex = /^[0-9]\d*$/;
    if (!areaRex.test(vo.area)) {
        layer.alert('面积输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (!areaRex.test(vo.rentSqm)) {
        layer.alert('可出租面积输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (!areaRex.test(vo.height)) {
        layer.alert('冷库净高度输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (vo.capacity1 != "" && !areaRex.test(vo.capacity1) || vo.capacity2 != "" && !areaRex.test(vo.capacity2) ||
        vo.capacity3 != "" && !areaRex.test(vo.capacity3) || vo.capacity4 != "" && !areaRex.test(vo.capacity4) ||
        vo.capacity5 != "" && !areaRex.test(vo.capacity5) || vo.height1 != "" && !areaRex.test(vo.height1) ||
        vo.height2 != "" && !areaRex.test(vo.height2) || vo.height3 != "" && !areaRex.test(vo.height3) ||
        vo.height4 != "" && !areaRex.test(vo.height4) || vo.height5 != "" && !areaRex.test(vo.height5)) {
        layer.alert('冷库容积输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (vo.coldTruck1 != "" && !countRex.test(vo.coldTruck1) || vo.coldTruck2 != "" && !countRex.test(vo.coldTruck2) ||
        vo.coldTruck3 != "" && !countRex.test(vo.coldTruck3) || vo.coldTruck4 != "" && !countRex.test(vo.coldTruck4)) {
        layer.alert('冷藏车数量输入有误！', {icon: 2});
        return false;
    }
    if (vo.lihuoArea != "" && !areaRex.test(vo.lihuoArea)) {
        layer.alert('理货区面积输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if(vo.area-vo.rentSqm<0){
        layer.alert('冷库的可出租面积不能大于冷库的总面积！', {icon: 2});
        return false;
    }
    if(vo.isJoinStand==1&&standPic.length<1){
        layer.alert('请上传冷库温度达标认证图！', {icon: 2});
        return false;
    }
    var phoneNumRex =  /^1[34578]\d{9}$/;
    var cellPhoneRex=/^0{1}\d{2,3}-{1}\d{7,8}$/;
    if (!phoneNumRex.test(vo.phoneNum)&&!cellPhoneRex.test(vo.phoneNum)) {
        layer.alert('联系电话输入有误！(座机如021-62531528)', {icon: 2});
        return false;
    }
    return true;
}
/*检验冷库名是否重复*/
function checkRdcName() {
    if ($(this).val()!= "") {
        $.ajax({
            url: "/i/rdc/checkName", type: "get", data: {"value": $(this).val()}, success: function (data) {
                addRdcFlag = data.isValid;
                if (!addRdcFlag) {
                    layer.tips('该冷库名已被使用，请更换！', '#name',{tips: [3, '#CC441D'], area: ['500px', 'auto'], time: 4000});
                }
            }
        });
    }
}
/*动态显示理货区面积*/
function changeIsLiHuoArea() {
    if($(this).val()==1){
        $("#lihuoAreaTr").show();
    }else {
        $("#lihuoAreaTr").hide();
        $("#lihuoArea").val("");
    }
}
$(function () {
    getStorageManage();
    getStructures();
    getTemperTypes();
    getStorageTypes();
    getStorageRefregs();
    getProvinceList();
    getCityListByProId();
    $("#provinceId").bind("change",getCityListByProId);
    $("#name").bind("blur",checkRdcName);
    $("#lihuoRoom").bind("change",changeIsLiHuoArea);
    if(sessionStorage.submitRdcStatus==1){
        getFormValue(getUrlParam("rdcId"));
    }
    $(".moreBtn").click(function () {
        var flag=$(".moreInfo").is(":hidden");
        $(this).html( flag ?  "收起--" : "更多信息+");
        $(".moreInfo").toggle();
    });
    $('.rdcImg').children('div').eq(0).children('label').click(function () {
        var oLabel = $(this).index();
        if(oLabel!=2){
            $(this).parent().siblings('ul').show().children('li').eq(oLabel).show().siblings('li').hide();
        }else{
            $(this).parent().siblings('ul').hide();
        }
    })
});
