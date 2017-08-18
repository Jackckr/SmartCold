var goodsPics = [];
var goodsOriginalLent = 0;
var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
var flag = 0;//0---不关联冷库，1---关联冷库
var ajaxCount = 0;
/*============================================================关联冷库发布==========================================================================*/
/*获取关联的冷库列表*/
function getRdcList() {
    if (!window.lkuser) {
        return false;
    }
    $.ajax({
        url: "/i/ShareRdcController/getRdcByUid",
        type: "post",
        data: {uid: window.lkuser.id},
        success: function (data) {
            var rdcs = data.data;
            if (rdcs.length == 0) {
                return false;
            }
            var rdcUl = [];
            $.each(rdcs, function (index, rdc) {
                rdcUl.push('<ul class="clearfix"><li><img src="' + rdc.logo + '" alt=""></li><li>' + rdc.name + '</li><li><i class="iconfont orange">&#xe61c;</i>' + rdc.address + '</li><li><button class="oBtn" onclick="aboutRdcRelease(' + rdc.rdcID + ')">发布</button></li></ul>');
            });
            $("#rdcList").empty().append(rdcUl.join(''));
        }
    });
}

/*初始化rdc详情*/
function initRdcInfo(rdcId, share) {
    if (checkLogin()) {
        $.ajax({
            url: "/i/ShareRdcController/getRdcByUid",
            type: "get",
            data: {rdcId: rdcId, uid: window.lkuser.id},
            success: function (data) {
                var rdc = data.data[0];
                if(rdc){
                    var filesArr = [];
                    $("#rdcName").html(rdc.name + '<span><i class="iconfont orange">&#xe61c;</i>' + rdc.address + '</span>');
                    if (rdc.files) {
                        $.each(rdc.files, function (index, file) {
                            filesArr.push('<li><img src="' + file + '" alt=""></li>');
                        });
                        $("#infoImg").append(filesArr.join(''));
                    } else {
                        $("#infoImg").hide();
                    }
                    $("#haveProvinceid").val(rdc.provinceid);
                    $("#haveCityid").val(rdc.cityid);
                    $("#detlAddress").val(rdc.address);
                    $("#rdcID").val(rdc.rdcID);
                    showImg();
                    ajaxCount++;
                    initBaseData(share);
                }else{
                    layer.alert('关联冷库已被删除，此条数据已经失效~',function () {
                        window.history.back()
                    })
                }

            }
        });
    }
}
/*提交添加发布信息*/
function addHaveCold() {
    var ii = layer.load();
    var serializeArray = $("#haveCodeForm").serializeArray();
    var vo = {};
    $.each(serializeArray, function (index, val) {
        vo[val.name] = val.value;
    });
    if (vo.publishunit == 1) {
        vo.unit = '元/Kg';
    }
    if (checkSubmitInfo(vo)) {
        vo['username'] = window.lkuser.username;
        vo['uid'] = window.lkuser.id;
        var formData = new FormData();
        formData.append('data', JSON.stringify(vo));
        $.each(goodsPics, function (index, file) {
            if (index >= goodsOriginalLent) {
                formData.append('file' + index, file);
            }
        });
        $.ajax({
            url: "/i/ShareRdcController/shareFreeRelease", type: "post", processData: false, contentType: false,
            data: formData, success: function (data) {
                layer.close(ii);
                if (data.success) {
                    layer.alert(data.message, {icon: 1}, function () {
                        if (sessionStorage.submitRdcStatus == 1) {
                            window.localStorage.liIndex = 3;
                            window.location.href = "usercenter.html#goods";
                        } else {
                            if (vo.typeCode == 1) {
                                window.localStorage.shareIndex = 2;
                                window.location.href = "rdcmatch.html#flag=2&dataType=1&typeCode=1&pageNum=1&pageSize=10";
                            } else {
                                window.localStorage.shareIndex = 3;
                                window.location.href = "rdcmatch.html#flag=3&dataType=1&typeCode=2&pageNum=1&pageSize=10";
                            }
                        }
                    });
                } else {
                    layer.alert(data.message, {icon: 2});
                }
            }
        });
    } else {
        layer.close(ii);
    }
}
/*===============================================================不关联冷库==========================================================================*/
/*初始化不关联冷库*/
function initNoHaveData(share) {
    var provinceList = [];
    $.ajax({
        url: "/i/city/findProvinceList", type: "get", success: function (data) {
            $.each(data, function (index, val) {
                provinceList.push('<option value="' + val.provinceId + '">' + val.provinceName + '</option>');
            });
            $("#provinceid").empty().append(provinceList.join(''));
            getCitys($("#provinceid"), share);
            initBaseData(share);
        }
    });
}
/*获得城市列表*/
function getCitys(mark, share) {
    var cityList = [];
    $.ajax({
        url: "/i/city/findCitysByProvinceId",
        async: false,
        type: "get",
        data: {"provinceID": $(mark).val()},
        success: function (data) {
            $.each(data, function (index, val) {
                cityList.push('<option value="' + val.cityID + '">' + val.cityName + '</option>');
            });
            $("#cityid").empty().append(cityList.join(''));
            if (sessionStorage.submitRdcStatus == 1 && share && flag == 0) {
                $("#cityid").val(share.cityid);
            }
            if (sessionStorage.submitRdcStatus == 1 && share && ajaxCount == 1 && flag == 0) {
                ajaxCount = 0;
                getDataToForm($("#noCodeForm [name]").not("[name=publishunit]"), share);
                getCitys($("#provinceid"), share);
                $("#noCodeForm [name=publishunit][value=" + share.publishunit + "]").attr("checked", "checked");
            } else {
                ajaxCount++;
            }
        }
    });
}
function addNoCold() {
    var ii = layer.load();
    var serializeArray = $("#noCodeForm").serializeArray();
    var vo = {};
    $.each(serializeArray, function (index, val) {
        vo[val.name] = val.value;
    });
    if (vo.publishunit == 1) {
        vo.unit = '元/Kg';
    }
    if (checkSubmitInfo(vo)) {
        vo['username'] = window.lkuser.username;
        vo['uid'] = window.lkuser.id;
        vo['detlAddress'] = $("#provinceid option[value=" + vo.provinceid + "]").html() + "-" + $("#cityid option[value=" + vo.cityid + "]").html();
        var formData = new FormData();
        formData.append('data', JSON.stringify(vo));
        $.each(goodsPics, function (index, file) {
            if (index >= goodsOriginalLent) {
                formData.append('file' + index, file);
            }
        });
        $.ajax({
            url: "/i/ShareRdcController/shareFreeRelease", type: "post", processData: false, contentType: false,
            data: formData, success: function (data) {
                layer.close(ii);
                if (data.success) {
                    layer.alert(data.message, {icon: 1}, function () {
                        if (sessionStorage.submitRdcStatus == 1) {
                            window.localStorage.liIndex = 3;
                            window.location.href = "usercenter.html#goods";
                        } else {
                            if (vo.typeCode == 1) {
                                window.location.href = "rdcmatch.html#flag=2&dataType=1&typeCode=1&pageNum=1&pageSize=10";
                            } else {
                                window.location.href = "rdcmatch.html#flag=3&dataType=1&typeCode=2&pageNum=1&pageSize=10";
                            }
                        }
                    });
                } else {
                    layer.alert(data.message, {icon: 2});
                }
            }
        });
    } else {
        layer.close(ii);
    }
}
/*================================================================修改===============================================================================*/
/*初始化修改信息详情*/
function initUpdateData(id) {
    $.ajax({
        url: "/i/ShareRdcController/getSEByIDForEdit", type: "get", data: {id: id}, success: function (data) {
            var shared = data.entity;
            $("#saleGoodsFlag").html('修改出售货品');
            $("#applyGoodsFlag").html('修改求购货品');
            if (shared.fileList) {
                goodsOriginalLent = shared.fileList.length;
            }
            $.each(shared.fileList, function (index, file) {
                goodsPics.push(file);
            });
            if (shared.rdcID == 0 || shared.rdcID == "" || !shared.rdcID) {
                noRdcRelease(shared);
                /*setTimeout(function () {
                 getDataToForm($("#noCodeForm [name]").not("[name=publishunit]"),shared);
                 getCitys($("#provinceid"));
                 $("#noCodeForm [name=publishunit][value="+shared.publishunit+"]").attr("checked","checked");
                 setTimeout(function () {
                 $("#cityid").val(shared.cityid);
                 },40);
                 },40);*/
                $("#noCodeForm").append('<input type="hidden" name="id" value="' + id + '"/>');
            } else {
                aboutRdcRelease(shared.rdcID, shared);
                /*setTimeout(function () {
                 getDataToForm($("#haveCodeForm [name]").not("[name=publishunit]"),shared);
                 },80);*/
                //$("#haveCodeForm [name=publishunit][value="+shared.publishunit+"]").attr("checked","checked");
                $("#haveCodeForm").append('<input type="hidden" name="id" value="' + id + '"/>');
            }
            showSelectPics();
        }
    });
}

/*===============================================================公用方法===========================================================================*/
/*验证提交信息*/
function checkSubmitInfo(vo) {
    if (vo.title.trim() == "" || vo.sqm.trim() == "" || vo.unitPrice.trim() == "" ||
        vo.validStartTime.trim() == "" || vo.validEndTime.trim() == "" || vo.telephone.trim() == "") {
        layer.alert('请完善冷库信息！', {icon: 2});
        return false;
    }
    if (vo.title.trim().length < 6 || vo.title.trim().length > 24) {
        layer.alert('标题必须在6~24个字符之间~', {icon: 2});
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
    if (!areaRex.test(vo.sqm.trim())) {
        layer.alert('货品数量输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (!areaRex.test(vo.unitPrice.trim())) {
        layer.alert('单价输入有误！(小数点后最多保留两位，如：15.28)', {icon: 2});
        return false;
    }
    if (Date.parse(vo.validStartTime.trim().replace(/-/g, "/")) > Date.parse(vo.validEndTime.trim().replace(/-/g, "/"))) {
        layer.alert('开始时间和结束时间冲突，请更改~', {icon: 2});
        return false;
    }
    var phoneNumRex = /^1[34578]\d{9}$/;
    var cellPhoneRex = /^0{1}\d{2,3}-{1}\d{7,8}$/;
    if (!phoneNumRex.test(vo.telephone.trim()) && !cellPhoneRex.test(vo.telephone.trim())) {
        layer.alert('联系电话输入有误！(座机如021-62531528)', {icon: 2});
        return false;
    }
    return true;
}

/*初始化基本数据*/
function initBaseData(share) {
    var goodsType = [];
    $("input[name=telephone]").val(window.lkuser.telephone);
    $.ajax({
        url: "/i/ShareRdcController/getGDFilterData", type: "get", success: function (data) {
            $.each(data.entity.gt, function (index, val) {
                goodsType.push('<option value="' + val.type_code + '">' + val.type_name + '</option>');
            });
            flag == 0 ? $("#noCategory").empty().append(goodsType.join('')) : $("#haveCategory").empty().append(goodsType.join(''));
            if (sessionStorage.submitRdcStatus == 1 && share && ajaxCount == 1) {
                ajaxCount = 0;
                if (flag == 0) {
                    getDataToForm($("#noCodeForm [name]").not("[name=publishunit]"), share);
                    $("#noCodeForm [name=publishunit][value=" + share.publishunit + "]").attr("checked", "checked");
                    getCitys($("#provinceid"), share);
                } else {
                    getDataToForm($("#haveCodeForm [name]").not("[name=publishunit]"), share);
                    $("#haveCodeForm [name=publishunit][value=" + share.publishunit + "]").attr("checked", "checked");
                }
            } else {
                ajaxCount++;
            }
        }
    });

}

/*冷库出租图change*/
function rentRdcPicChange(e) {
    var files = e.files;
    for (var i = 0; i < files.length; i++) {
        if (!rFilter.test(files[i].type)) {
            layer.alert('格式错误~请选择格式为' + msg + '的图片~！', {icon: 2});
            showSelectPics();
            return;
        } else if (files[i].size > 10485760) {
            layer.alert('最大只能上传10M的图片！', {icon: 2});
            showSelectPics();
            return;
        } else if (goodsPics.length >= 10) {
            layer.alert('冷库出租图片最多10张！', {icon: 2});
            showSelectPics();
            return;
        }
        goodsPics.push(files[i]);
    }
    showSelectPics();
}

/*显示已选图片*/
function showSelectPics() {
    var storagePicImg = [];
    for (var i = 0; i < goodsOriginalLent; i++) {
        storagePicImg.push('<li class="imgBox"><img src="' + goodsPics[i].location + '" alt=""><i onclick="delgoodsPic(' + i + ',' + goodsPics[i].id + ',\'' + goodsPics[i].location + '\')">&times;</i></li>');
    }
    if (goodsPics.length != goodsOriginalLent) {
        for (var i = goodsOriginalLent; i < goodsPics.length; i++) {
            storagePicImg.push('<li class="imgBox"><img id=rentRdcPic' + i + ' alt=""><i onclick="delgoodsPic(' + i + ')">&times;</i></li>');
        }
    }
    flag == 0 ? $("#noStoragePics").empty().append(storagePicImg.join('')) : $("#haveStoragePics").empty().append(storagePicImg.join(''));
    for (var i = goodsOriginalLent; i < goodsPics.length; i++) {
        var oFile = goodsPics[i];
        var oImage = document.getElementById('rentRdcPic' + i);
        eval("var oImage" + i + "=oImage;var oReader" + i + " = new FileReader();oReader" + i + ".onload = function(e) {oImage" + i + ".src = e.target.result;};oReader" + i + ".readAsDataURL(oFile);");
    }
}

/*删除显示图片*/
function delgoodsPic(index, id, location) {
    if (index + 1 > goodsOriginalLent) {
        goodsPics.splice(index, 1);
        showSelectPics();
    } else {
        layer.confirm('删除图片后不可恢复，确认?', {
            btn: ['确认', '取消'], //按钮
            shade: false //不显示遮罩
        }, function (e) {
            goodsPics.splice(index, 1);
            if (id && location) {
                goodsOriginalLent--;
                $.ajax({
                    url: "/i/rdc/deleteStoragePic",
                    type: "post",
                    data: {id: id, location: location},
                    success: function (data) {
                    }
                });
            }
            showSelectPics();
            layer.close(e);
        });
    }
}
/*方法轮播图*/
function showImg() {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form(), layer = layui.layer, laydate = layui.laydate;
        layer.photos({
            photos: '#infoImg'
            //,anim:3//0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    });
}


function aboutRdcRelease(rdcId, share) {//关联库发布
    flag = 1;
    initRdcInfo(rdcId, share);
    $('.haveCold').show().siblings('.noCold').hide();//关联库表单展示//不关链库表单隐藏
    $('.aboutRdc').children('.rentRdc').hide();
    $('.aboutRdc').children('.orange').children('button').hide();
}
function noRdcRelease(share) {//不关联库发布
    flag = 0;
    initNoHaveData(share);
    $('.haveCold').hide().siblings('.noCold').show();
    $('.aboutRdc').children('.rentRdc').hide();
    $('.aboutRdc').children('.orange').children('button').hide();
}


$(function () {
    if (checkLogin()) {
        if (sessionStorage.submitRdcStatus == 0) {
            getRdcList();
        } else {
            var urlParam = getUrlParam('shareId');
            initUpdateData(urlParam);
        }
    }
});


