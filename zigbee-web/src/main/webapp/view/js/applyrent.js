var appltRdcPics=[];
var applyRdcOriginalLent=0;
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";

/*提交添加求租冷库信息*/
function addApply() {
    var ii = layer.load();
    var serializeArray = $("#submitRdc").serializeArray();
    var vo={};
    $.each(serializeArray,function (index, val) {
       vo[val.name]=val.value;
    });
    vo['uid']=window.lkuser.id;
    vo['username']=window.lkuser.username;
    vo['detlAddress']=$("#provinceid option[value="+vo.provinceid+"]").html()+"-"+$("#cityid option[value="+vo.cityid+"]").html();
    if(checkSubmitInfo(vo)){
       var formData = new FormData();
       formData.append('data',JSON.stringify(vo));
        $.each(appltRdcPics,function (index, file) {
            if(index>=applyRdcOriginalLent){
                formData.append('file'+index,file);
            }
        });
       $.ajax({url:"/i/ShareRdcController/shareFreeRelease",type:"post",data:formData,processData:false,contentType:false,success:function (data) {
           layer.close(ii);
           if(data.success){
               layer.alert(data.message, {icon: 1},function () {
                   if(sessionStorage.submitRdcStatus==1){
                       window.localStorage.liIndex=2;
                       window.location.href ="usercenter.html#rent";
                   }else{
                       window.location.href = "rdcmatch.html#flag=1&dataType=3&typeCode=2&pageNum=1&pageSize=10";
                   }
               });
           }else {
               layer.alert(data.message, {icon: 2});
           }
       }});
    }else {
        layer.close(ii);
    }
}



/*验证提交信息*/
function checkSubmitInfo(vo) {
    if(vo.cityid.trim()==""||vo.provinceid.trim()==""||vo.codeLave4.trim()==""||vo.title.trim()==""||
        vo.codeLave2.trim()==""||vo.sqm.trim()==""||vo.unitPrice.trim()==""||
        vo.rentdate.trim()==""||vo.validStartTime.trim()==""||vo.validEndTime.trim()==""||vo.telephone.trim()==""){
        layer.alert('请完善冷库信息！', {icon: 2});
        return false;
    }
    if(vo.title.trim().length<6||vo.title.trim().length>24){
        layer.alert('标题必须在6~24个字符之间~', {icon: 2});
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
    if(!areaRex.test(vo.sqm.trim())){
        layer.alert('面积输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if(!areaRex.test(vo.unitPrice.trim())){
        layer.alert('单价输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (Date.parse(vo.validStartTime.trim().replace(/-/g, "/")) > Date.parse(vo.validEndTime.trim().replace(/-/g, "/"))) {
        layer.alert('开始时间和结束时间冲突，请更改~', {icon: 2});
        return false;
    }
    var phoneNumRex =  /^1[34578]\d{9}$/;
    var cellPhoneRex=/^0{1}\d{2,3}-{1}\d{7,8}$/;
    if (!phoneNumRex.test(vo.telephone.trim())&&!cellPhoneRex.test(vo.telephone.trim())) {
        layer.alert('联系电话输入有误！(座机如021-62531528)', {icon: 2});
        return false;
    }
    return true;
}


/*冷库出租图change*/
function rentRdcPicChange(e) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(); return;
        }else if(files[i].size > 10485760){
            layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics();return;
        }else if(appltRdcPics.length>=10) {
            layer.alert('冷库出租图片最多10张！', {icon: 2});showSelectPics();return;
        }
        appltRdcPics.push(files[i]);
    }
    showSelectPics();
}

/*显示已选图片*/
function showSelectPics() {
    var storagePicImg=[];
    for(var i=0;i<applyRdcOriginalLent;i++){
        storagePicImg.push('<li class="imgBox"><img src="'+appltRdcPics[i].location+'" alt=""><i onclick="delrentRdcPic('+i+','+appltRdcPics[i].id+',\''+appltRdcPics[i].location+'\')">&times;</i></li>');
    }
    if(appltRdcPics.length!=applyRdcOriginalLent){
        for(var i=applyRdcOriginalLent;i<appltRdcPics.length;i++){
            storagePicImg.push('<li class="imgBox"><img id=rentRdcPic'+i+' alt=""><i onclick="delrentRdcPic('+i+')">&times;</i></li>');
        }
    }
    $("#storagePics").empty().append(storagePicImg.join(''));
    for(var i=applyRdcOriginalLent;i<appltRdcPics.length;i++){
        var oFile = appltRdcPics[i];
        var oImage = document.getElementById('rentRdcPic'+i);
        eval("var oImage"+i+"=oImage;var oReader"+i+" = new FileReader();oReader"+i+".onload = function(e) {oImage"+i+".src = e.target.result;};oReader"+i+".readAsDataURL(oFile);");
    }
}

/*删除显示图片*/
function delrentRdcPic(index,id,location) {
    if(index+1>applyRdcOriginalLent){
        appltRdcPics.splice(index,1);
        showSelectPics();
    }else {
        layer.confirm('删除图片后不可恢复，确认?', {
            btn: ['确认','取消'], //按钮
            shade: false //不显示遮罩
        }, function(e){
            appltRdcPics.splice(index,1);
            if(id&&location){
                applyRdcOriginalLent--;
                $.ajax({url:"/i/rdc/deleteStoragePic",type:"post",data:{id:id,location:location},success:function (data) {
                }});
            }
            showSelectPics();
            layer.close(e);
        });
    }
}

/*初始化详情*/
function initRdcInfo() {
    if(checkLogin()){
        var tempType=[];
        var manageType=[];
        var provinceList=[];
        $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
            $.each(data,function (index, val) {
                tempType.push('<option value="'+val.id+'">'+val.type+'</option>');
            });
            $("#codeLave2").empty().append(tempType.join(''));
        }});
        $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
            $.each(data,function (index, val) {
                manageType.push('<option value="'+val.id+'">'+val.type+'</option>');
            });
            $("#codeLave1").empty().append(manageType.join(''));
        }});
        $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
            $.each(data,function (index, val) {
                provinceList.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
            });
            $("#provinceid").empty().append(provinceList.join(''));
            getCitys($("#provinceid"));
        }});
        $("#telephone").val(window.lkuser.telephone);
    }
}

/*初始化修改信息详情*/
function initUpdateData(id) {
    $.ajax({url:"/i/ShareRdcController/getSEByIDForEdit",type:"get",data:{id:id},success:function (data) {
        var shared=data.entity;
        getDataToForm($("#submitRdc [name]"),shared);
        getCitys($("#provinceid"));
        setTimeout(function () {
            applyRdcOriginalLent=shared.fileList.length;
            $.each(shared.fileList,function (index, file) {
                appltRdcPics.push(file);
            });
            $("#cityid").val(shared.cityid);
            showSelectPics();
        },40);
    }});
}

function getCitys(mark) {
    var cityList=[];
    $.ajax({url:"/i/city/findCitysByProvinceId",async: false,type:"get",data:{"provinceID":$(mark).val()},success:function (data) {
        $.each(data,function (index, val) {
            cityList.push('<option value="'+val.cityID+'">'+val.cityName+'</option>');
        });
        $("#cityid").empty().append(cityList.join(''));
    }});
}

$(function () {
    if(checkLogin()){
        initRdcInfo();
        if(sessionStorage.submitRdcStatus==1){
            $('#applyFlag').html('修改求租冷库');
           var urlParam = getUrlParam('shareId');
            $("#submitRdc").append('<input type="hidden" name="id" value="'+urlParam+'"/>');
            setTimeout(initUpdateData(urlParam),40);
        }
    }
});