var rentRdcPics=[];
var rentRdcOriginalLent=0;
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";

/*冷库出租图change*/
function rentRdcPicChange(e) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(); return;
        }else if(files[i].size > 10485760){
            layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics();return;
        }else if(rentRdcPics.length>=10) {
            layer.alert('冷库出租图片最多10张！', {icon: 2});showSelectPics();return;
        }
        rentRdcPics.push(files[i]);
    }
    showSelectPics();
}

/*显示已选图片*/
function showSelectPics() {
    var storagePicImg=[];
    for(var i=0;i<rentRdcOriginalLent;i++){
        storagePicImg.push('<li class="imgBox"><img src="'+rentRdcPics[i].location+'" alt=""><i onclick="delrentRdcPic('+i+','+rentRdcPics[i].id+',\''+rentRdcPics[i].location+'\')">&times;</i></li>');
    }
    if(rentRdcPics.length!=rentRdcOriginalLent){
        for(var i=rentRdcOriginalLent;i<rentRdcPics.length;i++){
            storagePicImg.push('<li class="imgBox"><img id=rentRdcPic'+i+' alt=""><i onclick="delrentRdcPic('+i+')">&times;</i></li>');
        }
    }
    $("#storagePics").empty().append(storagePicImg.join(''));
    for(var i=rentRdcOriginalLent;i<rentRdcPics.length;i++){
        var oFile = rentRdcPics[i];
        var oImage = document.getElementById('rentRdcPic'+i);
        eval("var oImage"+i+"=oImage;var oReader"+i+" = new FileReader();oReader"+i+".onload = function(e) {oImage"+i+".src = e.target.result;};oReader"+i+".readAsDataURL(oFile);");
    }
}
/*删除显示图片*/
function delrentRdcPic(index,id,location) {
    if(index+1>rentRdcOriginalLent){
        rentRdcPics.splice(index,1);
        showSelectPics();
    }else {
        layer.confirm('删除图片后不可恢复，确认?', {
            btn: ['确认','取消'], //按钮
            shade: false //不显示遮罩
        }, function(e){
            rentRdcPics.splice(index,1);
            if(id&&location){
                rentRdcOriginalLent--;
                $.ajax({url:"/i/rdc/deleteStoragePic",type:"post",data:{id:id,location:location},success:function (data) {
                }});
            }
            showSelectPics();
            layer.close(e);
        });
    }
}

/*初始化rdc详情*/
function initRdcInfo(rdcId) {
    if(checkLogin()){
        $.ajax({url:"/i/ShareRdcController/getRdcByUid",type:"get",data:{rdcId:rdcId,uid:window.lkuser.id},success:function (data) {
            var rdc=data.data[0];
            var filesArr=[];
            $("#rdcName").html(rdc.name+'<span><i class="iconfont orange">&#xe61c;</i>'+rdc.address+'</span>');
            $.each(rdc.files,function (index, file) {
                filesArr.push('<li><img src="'+file+'" alt=""></li>');
            });
            $("#provinceid").val(rdc.provinceid);
            $("#cityid").val(rdc.cityid);
            $("#codeLave1").val(rdc.codeLave1);
            $("#detlAddress").val(rdc.address);
            $("#rdcID").val(rdc.rdcID);
            $("#rdcSqm").val(rdc.rdcSqm);
            $("#infoImg").append(filesArr.join(''));
            showImg();
        }});
        var tempType=[];
        $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
            $.each(data,function (index, val) {
                tempType.push('<option value="'+val.id+'">'+val.type+'</option>');
            });
            $("#codeLave2").empty().append(tempType.join(''));
        }});
        $("#telephone").val(window.lkuser.telephone);
    }
}

/*提交添加出租冷库信息*/
function submitAdd() {
    var ii = layer.load();
    var serializeArray = $("#submitRdc").serializeArray();
    var vo={};
    $.each(serializeArray,function (index, val) {
        vo[val.name]=val.value;
    });
    if(checkSubmitInfo(vo)){
        vo['username']=window.lkuser.username;
        var formData = new FormData();
        formData.append('data',JSON.stringify(vo));
        $.each(rentRdcPics,function (index, file) {
            if(index>=rentRdcOriginalLent){
                formData.append('file'+index,file);
            }
        });
        formData.append('uid',window.lkuser.id);
        $.ajax({url:"/i/ShareRdcController/shareFreeRelease",type:"post",processData: false, contentType: false,
            data:formData,success:function (data) {
            layer.close(ii);
            if(data.success){
                layer.alert(data.message, {icon: 1},function () {
                    window.location.href = "rdcmatch.html";
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
    if(vo.title.trim()==""||vo.codeLave2.trim()==""||vo.sqm.trim()==""||vo.unitPrice.trim()==""||
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
    if(parseFloat(vo.sqm.trim())>parseFloat(vo.rdcSqm.trim())){
        layer.alert('出租面积不能大于冷库总面积~', {icon: 2});
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


/*获取关联的冷库列表*/
function getRdcList() {
    if(!window.lkuser){$("#rdcList").attr('class','rdcList hide');
        $("#noRdc").attr('class','noRdc');return false;}
    $.ajax({url:"/i/ShareRdcController/getRdcByUid",type:"post",data:{uid:window.lkuser.id},success:function (data) {
         var rdcs=data.data;
         if(rdcs.length==0){$("#rdcList").attr('class','rdcList hide');
             $("#noRdc").attr('class','noRdc');return false;}
         var rdcUl=[];
         $.each(rdcs,function (index, rdc) {
             rdcUl.push('<ul class="clearfix"><li><img src="'+rdc.logo+'" alt=""></li><li>'+rdc.name+'</li><li><i class="iconfont orange">&#xe61c;</i>'+rdc.address+'</li><li><button class="oBtn" onclick="aboutRdcRelease('+rdc.rdcID+')">发布</button></li></ul>');
         });
         $("#rdcList").empty().append(rdcUl.join(''));
        $("#rdcList").attr('class','rdcList');
        $("#noRdc").attr('class','noRdc hide');
    }});
}

/*初始化修改信息*/
function initUpdateInfo(id) {
    $.ajax({url:"/i/ShareRdcController/getSEByIDForEdit",type:"get",data:{id:id},success:function (data) {
        var share=data.entity;
        initRdcInfo(share.rdcID);
        getDataToForm($("#submitRdc [name]"),share);
        rentRdcOriginalLent=share.fileList.length;
        $.each(share.fileList,function (index, file) {
            rentRdcPics.push(file);
        });
        showSelectPics();
    }});
}

/*触发发布信息页*/
function aboutRdcRelease(id){
    if(sessionStorage.submitRdcStatus==0){//添加
        $('.aboutRdc').children('.rentRdc').hide().parent('.aboutRdc').siblings('.rdcAdd').show();
        initRdcInfo(id);
    }else {//修改
        $('.aboutRdc').children('.rentRdc').hide().parent('.aboutRdc').siblings('.rdcAdd').show();
        $("#pageFlag").html('修改出租冷库');
        $("#submitRdc").append('<input type="hidden" name="id" value="'+id+'"/>');
        initUpdateInfo(id);
    }
}

/*图片放大特效*/
function showImg() {
    layui.use(['form', 'layedit', 'laydate'], function() {
        var form = layui.form() , layer = layui.layer , laydate = layui.laydate;
        layer.photos({
            photos: '#infoImg'
            //,anim:3//0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    });
}

$(function () {
    if(checkLogin()){
        getRdcList();
        if(sessionStorage.submitRdcStatus==1){
            var urlParam = getUrlParam("shareId");
            aboutRdcRelease(urlParam);
        }
    }
});






