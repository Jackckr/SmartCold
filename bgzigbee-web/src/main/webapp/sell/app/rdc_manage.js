/*过滤参数*/
var queryParams = {audit: null, keyword: null};
var honorPicsArr=[];
var storagePicsArr=[];
var honorOriginalLength=0;
var storageOriginalLength=0;
var ids="";
var saveRdcName="";


var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";


/*设置图片*/
function setPic() {
    for(var i=honorPicsArr.length-1;i>=honorOriginalLength;i--){
        var oFile = honorPicsArr[i];
        var oImage = document.getElementById('honorPic'+i);
        eval("var oImage"+i+"=oImage;var oReader"+i+" = new FileReader();oReader"+i+".onload = function(e) {oImage"+i+".src = e.target.result;};oReader"+i+".readAsDataURL(oFile);");
    }
    for(var j=storagePicsArr.length-1;j>=storageOriginalLength;j--){
        var file = storagePicsArr[j];
        var image = document.getElementById('storagePic'+j);
        eval("var image"+j+"=image;var oReader"+j+" = new FileReader();oReader"+j+".onload = function(e) {image"+j+".src = e.target.result;};oReader"+j+".readAsDataURL(file);");
    }
}

function getRdcAudit(value) {
    if (value == 0)
        return '待审核';
    else if (value == 1) {
        return '通过';
    } else if (value == 2) {
        return '已认证';
    } else if (value == -1) {
        return '未通过';
    }
}
/*加载操作按钮*/
function cellStyler(value, row) {
    return '<button class="btn" onclick="ck(' + row.id + ')">修改</button><button class="btn" onclick="sh(' + row.id + ',\'' + row.name + '\',' + row.audit + ')">审核</button><button class="btn btn-info" onclick="stand(' + row.id + ',\'' + row.name + '\',' + row.istemperaturestandard + ')">达标</button>';
}
/*初始化表格*/
function init_table() {
    var col = [[
        {field: 'ck', checkbox: true},
        {field: 'id', title: 'ID', sortable: true},
        {field: 'name', title: '冷库名称', width: 80, align: 'center', sortable: true},
        {field: 'username', title: '添加人', width: 80, align: 'center', sortable: true},
        {field: 'cellphone', title: '联系方式', width: 80, align: 'center', sortable: true},
        {field: 'addtime', title: '添加时间', width: 40, align: 'center', sortable: true, formatter: tool.col_format},
        {field: 'audit', title: '状态', width: 40, align: 'center', sortable: true, formatter: getRdcAudit},
        {field: 'hand', title: '操作', width: 100, align: 'center', formatter: cellStyler}
    ]];
    initTable("冷库管理","icon-cold", "POST", "../../i/rdc/getRdcDTOByPage", queryParams,"#div_filteri",null, col,true, onDblClickRow);


}
//双击编辑用户信息
function onDblClickRow(index, field) {
    ck(field.id);
}

/*显示已选图片*/
function showSelectPic() {
    var honorPicImg="";
    var filesImg="";
    for(var i=0;i<honorOriginalLength;i++){
        honorPicImg+="<div class='imgBox'><img onclick='showimg(this,\""+honorPicsArr[i].location+"\")' src='"+honorPicsArr[i].location+"'><i class='imgClose' onclick='deleteImg("+i+",1,"+honorPicsArr[i].id+")'>&times;</i></div>";
    }
    for(var j=0;j<storageOriginalLength;j++){
        filesImg+="<div class='imgBox'><img onclick='showimg(this,\""+storagePicsArr[j].location+"\")' src='"+storagePicsArr[j].location+"'><i class='imgClose' onclick='deleteImg("+j+",2,"+storagePicsArr[j].id+")'>&times;</i></div>";
    }
    if(honorPicsArr.length!=honorOriginalLength){
        for(var i=honorPicsArr.length-1;i>=honorOriginalLength;i--){
            honorPicImg+="<div class='imgBox'><img id='honorPic"+i+"' onclick='showimg(this)'><i class='imgClose' onclick='deleteImg("+i+",1)'>&times;</i></div>";
        }
    }
    if(storagePicsArr.length!=storageOriginalLength){
        for(var j=storagePicsArr.length-1;j>=storageOriginalLength;j--){
            filesImg+="<div class='imgBox'><img id='storagePic"+j+"' onclick='showimg(this)'><i class='imgClose' onclick='deleteImg("+j+",2)'>&times;</i></div>";
        }
    }
    $("#filesImg").empty().append(filesImg);
    $("#honorfilesImg").empty().append(honorPicImg);
    setPic();
}

/*图片选中*/
function picChange(e,flag) {
    var files = e.files;
    for(var i=0;i<files.length;i++){
        if (!rFilter.test(files[i].type)) {
        	alert_errmsg("格式错误~请选择格式为" + msg + "的图片~"); return;
        }else if(files[i].size > 10485760){
        	alert_errmsg("最大只能上传10M的图片"); return;
        }
        flag==1?honorPicsArr.push(files[i]):storagePicsArr.push(files[i]);
    }
    showSelectPic();
}
/*图片删除*/
function deleteImg(index,flag,delId){
    flag==1?honorPicsArr.splice(index,1):storagePicsArr.splice(index,1);
    if(index<honorOriginalLength && flag==1) { honorOriginalLength--;};
    if(index<storageOriginalLength && flag==2) { storageOriginalLength--;};
    if(delId){ids+=delId+",";}
    showSelectPic();
}

/*刷新*/
function refresh() {
    $('#fddata').searchbox('setValue', '');
    queryParams.keyword="";
    $("#sel_audit").combobox({value:"8"});
    queryParams.audit="";
    reloaddata();
}

/*冷库修改*/
function ck(id) {
    honorOriginalLength=0;
    storageOriginalLength=0;
    honorPicsArr=[];
    storagePicsArr=[];
    $("#showNameMessage").hide();
    $('#addColdForm').form('clear');
    $.ajax({
        url: "/i/rdc/findRDCDTOByRDCId",
        type: "get",
        data: {"rdcID": id},
        success: function (data) {
            var rdc = data[0];
            if(rdc==null){return;}
            saveRdcName=rdc.name;
            rdc.id=id;
            rdc.rdcId=id;
            if (rdc.remark == "undefined") {
                rdc.remark = "";
            };
            if (rdc.facility == "undefined") {
                rdc.facility = "";
            };
            $("#coldButton").html("修改冷库信息");
            $('#addCold').panel({title: "修改冷库"});
            if (rdc.honorPics){
                honorOriginalLength=rdc.honorPics.length;
                for(var i=0;i<rdc.honorPics.length;i++){
                    honorPicsArr.push(rdc.honorPics[i]);
                }
            }
            if(rdc.storagePics){
                storageOriginalLength=rdc.storagePics.length;
                for(var j=0;j<rdc.storagePics.length;j++){
                    storagePicsArr.push(rdc.storagePics[j]);
                }
            }
            showSelectPic();
            loadProvince();
            loadCityByProId(rdc.provinceId);
            $("#provinceId").combobox({value: rdc.provinceId});
            $("#cityId").combobox({value: rdc.cityId});
            $('#addColdForm').form('load',rdc);
            /*$("#arrangePicDiv").show();
            $("#honorfilesDiv").show();
            $("#filesDiv").show();*/
            $("#coldButton").attr("onclick", "doUpdateCold()");
            $('#addCold').dialog('open');
        }
    });
}
/*冷库审核*/
function rdc_upaudit() {
    $('#rdc_auditdialog').dialog({closed: true});
    $.ajax({
        url: "/i/rdc/changeAudit",
        type: "POST",
        traditional: true,
        data: {
            "rdcID": $("#rdc_auditForm input[name='id']").val(),
            "audit": $("#rdc_auditForm input[name='audit']:checked").val()
        }
    });
    reloaddata();
}
function sh(id, name, audit) {
    $("#rdc_auditForm").form('load', {
        id: id,
        audit: audit,
        rdcName: name
    });
    $('#rdc_auditdialog').dialog({closed: false});
}

function stand(id, name, stand) {
    $("#rdc_standForm").form('load', {
        id: id,
        stand: stand,
        rdcName: name
    });
    $('#rdc_standdialog').dialog({closed: false});
}

function rdc_upstand() {
    $('#rdc_standdialog').dialog({closed: true});
    $.ajax({
        url: "/i/rdc/changeStand",
        type: "POST",
        traditional: true,
        data: {
            "rdcID": $("#rdc_standForm input[name='id']").val(),
            "stand": $("#rdc_standForm input[name='stand']:checked").val()
        }
    });
    reloaddata();
}

/*添加冷库*/
function addCold() {
    honorPicsArr=[];
    storagePicsArr=[];
    honorOriginalLength=0;
    storageOriginalLength=0;
    saveRdcName="";
    $("#honorfilesImg").empty();
    $("#filesImg").empty();
    $("#showNameMessage").hide();
    $('#addColdForm').form('clear');
    loadProvince();
    $("#coldButton").html("添加冷库");
    $('#addCold').panel({title: "添加冷库"});
    $("#coldButton").attr("onclick", "addColdSubmit()");
    $('#addCold').dialog('open');
    $("#provinceId").combobox({value: ""});
    $("#cityId").combobox({value: ""});
    /*$("#arrangePicSpan").show();
    $("#honorfilesSpan").show();
    $("#filesSpan").show();
    $("#honorfilesDiv").hide();
    $("#arrangePicDiv").hide();
    $("#filesDiv").hide();*/
}
/*检查冷库名字是否重复*/
var addRdcFlag = true;
/*提交冷库验证方法*/
function coldValidation(vo) {
    if (!addRdcFlag) {
    	alert_errmsg("冷库名已存在!");
        return false;
    }
    if (honorPicsArr.length > 8) {
    	alert_errmsg("资质荣誉图,最多上传八张图片");
        return false;
    }
    if (storagePicsArr.length > 5) {
    	alert_errmsg("冷库图片,最多上传五张图片");
        return false;
    }
    if (vo.name.trim() == "" || vo.provinceId.trim() == "" || vo.cityId.trim() == "" || vo.address.trim() == "" || vo.area.trim() == ""
        || vo.manageType.trim() == "" || vo.storageType.trim() == "" || vo.temperType.trim() == "" || vo.phoneNum.trim() == "") {
    	alert_errmsg("请完善冷库信息！");
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
    var countRex = /^[0-9]\d*$/;
    if (!areaRex.test(vo.area)) {
    	alert_errmsg("面积输入有误！(小数点后最多保留两位，如：15.28)");
        return false;
    }
    if (vo.capacity1 != "" && !areaRex.test(vo.capacity1) || vo.capacity2 != "" && !areaRex.test(vo.capacity2) ||
        vo.capacity3 != "" && !areaRex.test(vo.capacity3) || vo.capacity4 != "" && !areaRex.test(vo.capacity4) ||
        vo.capacity5 != "" && !areaRex.test(vo.capacity5) || vo.height1 != "" && !areaRex.test(vo.height1) ||
        vo.height2 != "" && !areaRex.test(vo.height2) || vo.height3 != "" && !areaRex.test(vo.height3) ||
        vo.height4 != "" && !areaRex.test(vo.height4) || vo.height5 != "" && !areaRex.test(vo.height5)) {
    	alert_errmsg("冷库容积输入有误！(小数点后最多保留两位，如：15.28)");
        return false;
    }
    if (vo.coldTruck1 != "" && !countRex.test(vo.coldTruck1) || vo.coldTruck2 != "" && !countRex.test(vo.coldTruck2) ||
        vo.coldTruck3 != "" && !countRex.test(vo.coldTruck3) || vo.coldTruck4 != "" && !countRex.test(vo.coldTruck4)) {
    	alert_errmsg("冷藏车数量输入有误！");
        return false;
    }
    if (vo.lihuoArea != "" && !areaRex.test(vo.lihuoArea)) {
    	alert_errmsg("理货区面积输入有误！(小数点后最多保留两位，如：15.28)");
        return false;
    }
    var phoneNumRex = /^1[34578]\d{9}$/;
    if (!phoneNumRex.test(vo.phoneNum)) {
    	alert_errmsg("联系电话输入有误！");
        return false;
    }
    return true;
}
/*提交冷库信息*/
function addColdSubmit() {
    //var honorfiles = $("input[name=honorfiles]").prop("files");
    //var arrangePic = $("input[name=arrangePic]");
    //var files = $("input[name=files]").prop("files");
    $('#coldButton').linkbutton('disable');
    var parnArray = $("#addColdForm").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(vo);
    if (flag) {
        var formdata = new FormData();
        $.each(honorPicsArr, function (index, item) {
            formdata.append('honor' + index, item);
        });
        /*$.each(arrangePic, function (index, item) {
            formdata.append('arrangePics', item.files[0]);
        });*/
        $.each(storagePicsArr, function (index, item) {
            formdata.append('file' + index, item);
        });

        formdata.append("empStr", JSON.stringify(vo));
        $.ajax({
            url: "/i/rdc/addRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                $('#coldButton').linkbutton('enable');
            	alert_infomsg("添加成功！");
                $('#addCold').dialog('close');
                reloaddata();
            }
        });
    }else {
        $('#coldButton').linkbutton('enable');
    }
}
/*提交修改冷库信息*/
function doUpdateCold() {
    //var honorfiles = $("input[name=honorfiles]").prop("files");
    //var arrangePic = $("input[name=arrangePic]");
    //var files = $("input[name=files]").prop("files");
    $('#coldButton').linkbutton('disable');
    var parnArray = $("#addColdForm").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(vo);
  //  vo.rdcId = id;
    if (flag) {
        var formdata = new FormData();
        $.each(honorPicsArr, function (index, item) {
            if(honorOriginalLength<=index){
                formdata.append('honor' + index, item);
            }
        });
        /*$.each(arrangePic, function (index, item) {
            formdata.append('arrangePics', item.files[0]);
        });*/
        $.each(storagePicsArr, function (index, item) {
            if(storageOriginalLength<=index){
                formdata.append('file'+index, item);
            }
        });

        formdata.append("empStr", JSON.stringify(vo));
        formdata.append("ids",ids.substring(0,ids.length-1));
        ids="";
        $.ajax({
            url: "/i/rdc/newUpdateRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                $('#coldButton').linkbutton('enable');
            	alert_infomsg("修改成功！");
                $('#addCold').dialog('close');
                reloaddata();
            }
        });
    }else {
        $('#coldButton').linkbutton('enable');
    }
}
//批量删除冷库
function dl() {
    var rdcIDs = getTableCheckedID();
    if (rdcIDs.length > 0) {
        $.messager.confirm('删除确认', '你确认要<er>删除</er>这<er>' + rdcIDs.length + '</er>条冷库信息吗?', function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: '../../i/rdc/delByRdcIDs',
                    traditional: true,
                    data: {'rdcIDs': rdcIDs},
                    success: function (data) {
                        $.messager.alert('提示', data.message, 'info');
                        reloaddata();
                    }
                });
            }
        });
    } else {
        $.messager.alert('删除冷库', '您还没有选择冷库哦', 'info');
    }
}
/*加载省*/
function loadProvince() {
    $.ajax({
        url: "/i/city/findProvinceList",
        type: "get",
        success: function (data) {
            var option = "";
            for (var i = 0; i < data.length; i++) {
                option += "<option value='" + data[i].provinceId + "'>" + data[i].provinceName + "</option>";
            }
            $("#provinceId").empty().append(option);
            $("#provinceId").combobox({});

        }
    });
}
// 获取冷库经营类型
function getStorageManage() {
    var manageList=[];
    $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            manageList.push({"text": val.type, "value":val.id});
        });
        $("#manageType").combobox("loadData", manageList);
    }});
}

// 获取冷库结构类型
function getStructures() {
    var structures=[];
    $.ajax({url:"/i/rdc/findAllStorageStructureType",type:"get",success:function (data) {
        structures.push({"text": "", "value":0});
        data.forEach(function (val, index) {
            structures.push({"text": val.type, "value":val.id});
        });
        $("#structure").combobox("loadData", structures);
    }});
}

// 获取冷库温度类型
function getTemperTypes() {
    var temperTypes=[];
    $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            temperTypes.push({"text": val.type, "value":val.id});
        });
        $("#temperType").combobox("loadData", temperTypes);
    }});
}

// 获取商品存放类型
function getStorageTypes() {
    var storageTypes=[];
    $.ajax({url:"/i/rdc/findAllStorageType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            storageTypes.push({"text": val.type, "value":val.id});
        });
        $("#storageType").empty().combobox("loadData", storageTypes);
    }});
}

// 制冷剂类型
function getStorageRefregs() {
    var storageRefregs=[];
    $.ajax({url:"/i/rdc/findAllStorageRefreg",type:"get",success:function (data) {
        storageRefregs.push({"text": "", "value":0});
        data.forEach(function (val, index) {
            storageRefregs.push({"text": val.type, "value":val.id});
        });
        $("#storageRefreg").empty().combobox("loadData", storageRefregs);
    }});
}

/*通过省id加载市*/
function loadCityByProId(id) {
    $.ajax({
        url: "/i/city/findCitysByProvinceId",
        data: {"provinceID": id},
        type: "get",
        success: function (data) {
            var option = "";
            for (var i = 0; i < data.length; i++) {
                option += "<option value='" + data[i].cityID + "'>" + data[i].cityName + "</option>";
            }
            $("#cityId").empty().append(option);
            $("#cityId").combobox({});
        }
    });
}
//初始化数据
var saveProvince="";
$().ready(function () {
    getStorageManage();
    getStructures();
    getTemperTypes();
    getStorageTypes();
    getStorageRefregs();
    init_table();
    $(".combo").click(function(){
        $(this).prev().combobox("showPanel");
    })
    parent.sysuser.role==3?$("#delButton").show():$("#delButton").hide()
    $('#sel_audit').combobox({onChange:function(val){ queryParams.audit=val;  reloaddata(queryParams);}});
    $('#fddata').searchbox({searcher:function(value){queryParams.keyword=value;  reloaddata(queryParams);}});
    $("#name").blur(function () {
        var rdcName = $("#name").val();
        if(saveRdcName==rdcName){
            $("#showNameMessage").hide();
            return;
        }
        if (rdcName != "") {
            $.ajax({
                url: "/i/rdc/checkName", type: "get", data: {"value": rdcName}, success: function (data) {
                    addRdcFlag = data.isValid;
                    if (addRdcFlag) {
                        $("#showNameMessage").hide();
                    } else {
                        $("#showNameMessage").show();
                    }
                }
            });
        }
    });
    $("#provinceId").combobox({
        onSelect: function (record) {
            if(saveProvince==""){
                saveProvince=record.value;
            }
            loadCityByProId(record.value);
            if(saveProvince!=record.value){
                $("#cityId").combobox({value:""});
                saveProvince=record.value;
            }
        }
    });
});//初始化数据