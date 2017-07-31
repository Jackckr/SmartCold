var goodsPics=[];
var goodsOriginalLent=0;
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
var flag=0;//0---不关联冷库，1---关联冷库
/*============================================================关联冷库发布==========================================================================*/
/*获取关联的冷库列表*/
function getRdcList() {
    if(!window.lkuser){return false;}
    $.ajax({url:"/i/ShareRdcController/getRdcByUid",type:"post",data:{uid:window.lkuser.id},success:function (data) {
        var rdcs=data.data;
        if(rdcs.length==0){return false;}
        var rdcUl=[];
        $.each(rdcs,function (index, rdc) {
            rdcUl.push('<ul class="clearfix"><li><img src="'+rdc.logo+'" alt=""></li><li>'+rdc.name+'</li><li><i class="iconfont orange">&#xe61c;</i>'+rdc.address+'</li><li><button class="oBtn" onclick="aboutRdcRelease('+rdc.rdcID+')">发布</button></li></ul>');
        });
        $("#rdcList").empty().append(rdcUl.join(''));
    }});
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
            $("#haveProvinceid").val(rdc.provinceid);
            $("#haveCityid").val(rdc.cityid);
            $("#detlAddress").val(rdc.address);
            $("#rdcID").val(rdc.rdcID);
            $("#infoImg").append(filesArr.join(''));
            showImg();
            initBaseData();
        }});
    }
}
/*提交添加发布信息*/
function addHaveCold() {
    var ii = layer.load();
    var serializeArray = $("#haveCodeForm").serializeArray();
    var vo={};
    $.each(serializeArray,function (index, val) {
        vo[val.name]=val.value;
    });
    if(vo.publishunit==1){
        vo.unit='元/Kg';
    }
    if(checkSubmitInfo(vo)){
        vo['username']=window.lkuser.username;
        vo['uid']=window.lkuser.id;
        var formData = new FormData();
        formData.append('data',JSON.stringify(vo));
        $.each(goodsPics,function (index, file) {
            formData.append('file'+index,file);
        });
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
/*===============================================================不关联冷库==========================================================================*/
/*初始化不关联冷库*/
function initNoHaveData() {
    var provinceList=[];
    $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
        $.each(data,function (index, val) {
            provinceList.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
        });
        $("#provinceid").empty().append(provinceList.join(''));
        getCitys($("#provinceid"));
    }});
    initBaseData();
}
/*获得城市列表*/
function getCitys(mark) {
    var cityList=[];
    $.ajax({url:"/i/city/findCitysByProvinceId",async: false,type:"get",data:{"provinceID":$(mark).val()},success:function (data) {
        $.each(data,function (index, val) {
            cityList.push('<option value="'+val.cityID+'">'+val.cityName+'</option>');
        });
        $("#cityid").empty().append(cityList.join(''));
    }});
}
function addNoCold() {
    var ii = layer.load();
    var serializeArray = $("#noCodeForm").serializeArray();
    var vo={};
    $.each(serializeArray,function (index, val) {
        vo[val.name]=val.value;
    });
    if(vo.publishunit==1){
        vo.unit='元/Kg';
    }
    if(checkSubmitInfo(vo)){
        vo['username']=window.lkuser.username;
        vo['uid']=window.lkuser.id;
        var formData = new FormData();
        formData.append('data',JSON.stringify(vo));
        $.each(goodsPics,function (index, file) {
            formData.append('file'+index,file);
        });
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



/*===============================================================公用方法===========================================================================*/
/*验证提交信息*/
function checkSubmitInfo(vo) {
    if(vo.title.trim()==""||vo.sqm.trim()==""||vo.unitPrice.trim()==""||
        vo.validStartTime.trim()==""||vo.validEndTime.trim()==""||vo.telephone.trim()==""){
        layer.alert('请完善冷库信息！', {icon: 2});
        return false;
    }
    if(vo.title.trim().length<6||vo.title.trim().length>24){
        layer.alert('标题必须在6~24个字符之间~', {icon: 2});
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
    if(!areaRex.test(vo.sqm.trim())){
        layer.alert('货品数量输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
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

/*初始化基本数据*/
function initBaseData() {
    var goodsType=[];
    $.ajax({url:"/i/ShareRdcController/getGDFilterData",type:"get",success:function (data) {
        $.each(data.entity.gt,function (index, val) {
            goodsType.push('<option value="'+val.type_code+'">'+val.type_name+'</option>');
        });
        flag==0?$("#noCategory").empty().append(goodsType.join('')):$("#haveCategory").empty().append(goodsType.join(''));
    }});
    $("input[name=telephone]").val(window.lkuser.telephone);
}

/*冷库出租图change*/
function rentRdcPicChange(e) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为'+ msg +'的图片~！', {icon: 2}); showSelectPics(); return;
        }else if(files[i].size > 10485760){
            layer.alert('最大只能上传10M的图片！', {icon: 2});showSelectPics();return;
        }else if(goodsPics.length>=10) {
            layer.alert('冷库出租图片最多10张！', {icon: 2});showSelectPics();return;
        }
        goodsPics.push(files[i]);
    }
    showSelectPics();
}

/*显示已选图片*/
function showSelectPics() {
    var storagePicImg=[];
    for(var i=0;i<goodsOriginalLent;i++){
        storagePicImg.push('<li class="imgBox"><img src="'+goodsPics[i].location+'" alt=""><i onclick="delgoodsPic('+i+','+goodsPics[i].id+')">&times;</i></li>');
    }
    if(goodsPics.length!=goodsOriginalLent){
        for(var i=goodsOriginalLent;i<goodsPics.length;i++){
            storagePicImg.push('<li class="imgBox"><img id=rentRdcPic'+i+' alt=""><i onclick="delgoodsPic('+i+')">&times;</i></li>');
        }
    }
    flag==0?$("#noStoragePics").empty().append(storagePicImg.join('')):$("#haveStoragePics").empty().append(storagePicImg.join(''));
    for(var i=goodsOriginalLent;i<goodsPics.length;i++){
        var oFile = goodsPics[i];
        var oImage = document.getElementById('rentRdcPic'+i);
        eval("var oImage"+i+"=oImage;var oReader"+i+" = new FileReader();oReader"+i+".onload = function(e) {oImage"+i+".src = e.target.result;};oReader"+i+".readAsDataURL(oFile);");
    }
}

/*删除显示图片*/
function delgoodsPic(index,id) {
    if(index+1>goodsOriginalLent){
        goodsPics.splice(index,1);
        showSelectPics();
    }else {
        layer.confirm('删除图片后不可恢复，确认?', {
            btn: ['确认','取消'], //按钮
            shade: false //不显示遮罩
        }, function(e){
            goodsPics.splice(index,1);
            if(id){
                goodsOriginalLent--;
                $.ajax({url:"/i/rdc/deleteStoragePic",type:"post",data:{belongid:2132,category:'sharePic',id:213213,location:'http',name:'213',type:'123123'},success:function (data) {

                }});
            }
            showSelectPics();
            layer.close(e);
        });
    }
}
/*方法轮播图*/
function showImg() {
    layui.use(['form', 'layedit', 'laydate'], function() {
        var form = layui.form() , layer = layui.layer , laydate = layui.laydate;
        layer.photos({
            photos: '#infoImg'
            //,anim:3//0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    });
}


function aboutRdcRelease(rdcId){//关联库发布
    flag=1;
    initRdcInfo(rdcId);
    $('.haveCold').show().siblings('.noCold').hide();//关联库表单展示//不关链库表单隐藏
    $('.aboutRdc').children('.rentRdc').hide();
    $('.aboutRdc').children('.orange').children('button').hide();
}
function noRdcRelease(){//不关联库发布
    flag=0;
    initNoHaveData();
    $('.haveCold').hide().siblings('.noCold').show();
    $('.aboutRdc').children('.rentRdc').hide();
    $('.aboutRdc').children('.orange').children('button').hide();
}


$(function () {
    getRdcList();
});


