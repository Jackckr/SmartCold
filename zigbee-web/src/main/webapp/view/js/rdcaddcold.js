var honorPicsArr=[];
var storagePicsArr=[];
var standPic=[];
var auditPic=[];
var honorPicsArrOriginal=0;
var storagePicsArrOriginal=0;
var auditPicOriginal=0;
var standPicOriginal=0;
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
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
        storagePicImg.push('<li class="imgBox"><img src="'+arr[i]+'" alt=""><i onclick="del'+imgId+'('+i+')">&times;</i></li>');
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
function delstorage(index) {
    storagePicsArr.splice(index,1);
    showSelectPics(storagePicsArr,storagePicsArrOriginal,"storage",$("#storagePics"));
}
function delhonor(index) {
    honorPicsArr.splice(index,1);
    showSelectPics(honorPicsArr,honorPicsArrOriginal,"honor",$("#honorPics"));
}
function delaudit(index) {
    auditPic.splice(index,1);
    showSelectPics(auditPic,auditPicOriginal,"audit",$("#auditPic"));
}
function delstandard(index) {
    standPic.splice(index,1);
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
        formdata.append("user",JSON.stringify(window.sessionStorage.user));
        $.ajax({
            url: "/i/rdc/newAddRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                layer.close(ii);
                layer.alert(data.message, {icon: 1});
                window.location.href="/view/html/rdclist.html";
            }
        });
    }else {
        layer.close(ii);
    }
}
/*获得所有的省市*/
function getProvinceList() {
    var provinceList=[];
    $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            provinceList.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
        });
        $("#provinceId").empty().append(provinceList.join(''));
    }});
}
/*通过省市id获得城市*/
function getCityListByProId() {
    var cityList=[];
    var proId;
    $("#provinceId").val()?proId=$("#provinceId").val():proId=1;
    $.ajax({url:"/i/city/findCitysByProvinceId",type:"get",data:{"provinceID":proId},success:function (data) {
        data.forEach(function (val, index) {
            cityList.push('<option value="'+val.cityID+'">'+val.cityName+'</option>');
        });
        $("#cityId").empty().append(cityList.join(''));
    }});
}
/*检查冷库名字是否重复*/
var addRdcFlag = true;
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
        || vo.manageType.trim() == "" || vo.storageType.trim() == "" || vo.temperType.trim() == "" || vo.phoneNum.trim() == ""|| !vo.openLIne) {
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
$(function () {
    getProvinceList();
    getCityListByProId();
    $("#provinceId").bind("change",getCityListByProId);
    $("#name").bind("blur",checkRdcName);
});
