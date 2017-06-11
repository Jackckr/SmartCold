/*过滤参数*/
var queryParams = {audit: null, keyword: null};

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
    return '<button class="btn" onclick="sh(' + row.id + ',\'' + row.name + '\',' + row.audit + ')">审核</button><button class="btn btn-info" onclick="rz(' + row.id + ')">认证</button>';
}
/*初始化表格*/
function init_table() {
    var tol = [
        {'iconCls': 'icon_rem', 'handler': '', 'text': '删除'},
        "-", {'iconCls': 'icon-reload', 'handler': 'reloaddata', 'text': '刷新'}, "-"];
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

function onDblClickRow(index, field) {
    ck(field);
}//双击编辑用户信息
/**
 * 动态组件 无需关心
 */
function crspsh() {
    $('.datagrid-toolbar').append("<div id=\"seache\"style=\"margin-top:-24px;float:right;margin-right:20px;\"><input id=\"fddata\"class=\"easyui-searchbox\" val=\"ml\" data-options=\"prompt:'请输入搜索条件...',searcher:finddatatb\"style=\"width:300px;display:inline;\"></input><div id=\"mm\"style=\"width:100px\" ></div></div>");
    var muits = new Array();
    var fields = $('#objTable').datagrid('getColumnFields');
    for (var i = 0; i < fields.length; i++) {
        var opts = $('#objTable').datagrid('getColumnOption', fields[i]);
        if (opts.field == 'ck' || opts.hidden || opts.field == 'hand') {
            continue;
        }
        muits.push("<div id='" + fields[i] + "' name='" + fields[i] + "'  onclick='chclip(this);' data-options=\"iconCls:'icon-" + fields[i] + "'\">" + opts.title + "</div>");
    }
    $('#mm').html(String.prototype.concat.apply("", muits));
    $('#fddata').searchbox({menu: '#mm'});
    $('#seache').appendTo('.datagrid-toolbar');
} //简单查询
function finddatatb(value, name) {
    if (value.trim() != "" && name != "") {
        objTable.datagrid('reload', {coleam: name, colval: name});
    }
} //简单查找数据
function chclip(em) {
    $("#seache input[placeholder='请输入搜索条件...']").hide();
    $("#seache span[class='textbox combo']").remove();
    $("#scvlcc").remove();
    $("#seache input[class='textbox-value']").attr("value", "");
    $("#seache input[class='textbox-value']").attr("name", em.id);
    if (em.id == "isread" || em.id == "state") {
        var id = "#ch" + em.id;
        var magrlef = '94px';
        var width = '180px';
        var html = '<select id="scvlcc"  style="width: ' + width + ' ;height:18px;"></select>';
        $("#seache input[placeholder='请输入搜索条件...']").after(html);
        $('#scvlcc').combo({editable: false});
        $("#scvlcc").next().css({'margin-left': magrlef, 'margin-right': '18px', 'padding-bottom': '2px'});
        $(id).appendTo($('#scvlcc').combo('panel'));
        $(id + ' span').click(function () {
            $('#scvlcc').combo('setValue', $(this).attr("value")).combo('setText', $(this).text()).combo('hidePanel');
            $("#seache input[class='textbox-value']").attr("name", em.id);
            $("#seache input[class='textbox-value']").attr("value", $(this).attr("value"));
        });
        setTimeout(function () {
            $("span[class='textbox combo']").find("input[type='text']").css({'margin-left': '0px'});
        }, 0);
    } else {
        $("#seache input[placeholder='请输入搜索条件...']").show();
    }
}
function searchData() {
    queryParams.audit = $("#sel_audit option:selected").val();
    queryParams.keyword = $("#search").val();
    reloaddata(queryParams);
}
/*冷库修改*/
function ck(id) {
    $("#showNameMessage").hide();
    $('#addColdForm').form('clear');
    $.ajax({
        url: "/i/rdc/findRDCDTOByRDCId",
        type: "get",
        data: {"rdcID": id.id},
        success: function (data) {
            var rdc = data[0];
            loadProvince();
            loadCityByProId(rdc.provinceId);
            $("#name").textbox("setValue", rdc.name);
            $("#provinceId").combobox({value: rdc.provinceId});
            $("#cityId").combobox({value: rdc.cityId});
            $("#manageType").combobox({value: rdc.manageType});
            $("#address").textbox("setValue", rdc.address);
            $("#area").textbox("setValue", rdc.area);
            $("#storageType").combobox({value: rdc.storageType});
            $("#temperType").combobox({value: rdc.temperType});
            $("#structure").combobox({value: rdc.structure});
            $("#lihuoRoom").combobox({value: rdc.lihuoRoom});
            $("#platform").combobox({value: rdc.platform});
            $("#storageRefreg").combobox({value: rdc.storageRefreg});
            $("#lihuoTemperCtr").combobox({value: rdc.lihuoTemperCtr});
            $("#temperRecord").combobox({value: rdc.temperRecord});
            $("#coldTruck1").textbox("setValue", rdc.coldTruck1);
            $("#coldTruck2").textbox("setValue", rdc.coldTruck2);
            $("#coldTruck3").textbox("setValue", rdc.coldTruck3);
            $("#coldTruck4").textbox("setValue", rdc.coldTruck4);
            $("#phoneNum").textbox("setValue", rdc.phoneNum);
            if (rdc.remark == "undefined") {
                rdc.remark = "";
            }
            $("#remark").textbox("setValue", rdc.remark);
            $("#capacity1").textbox("setValue", rdc.capacity1);
            $("#capacity2").textbox("setValue", rdc.capacity2);
            $("#capacity3").textbox("setValue", rdc.capacity3);
            $("#capacity4").textbox("setValue", rdc.capacity4);
            $("#capacity5").textbox("setValue", rdc.capacity5);
            $("#height1").textbox("setValue", rdc.height1);
            $("#height2").textbox("setValue", rdc.height2);
            $("#height3").textbox("setValue", rdc.height3);
            $("#height4").textbox("setValue", rdc.height4);
            $("#height5").textbox("setValue", rdc.height5);
            if (rdc.facility == "undefined") {
                rdc.facility = "";
            }
            $("#facility").textbox("setValue", rdc.facility);
            $("#lihuoArea").textbox("setValue", rdc.lihuoArea);
            $("#coldButton").html("修改冷库信息");
            var honorPicImg="";
            var filesImg="";
            var arrangePicImg="";
            if(rdc.arrangePic){
                arrangePicImg="<img src='"+rdc.arrangePic.location+"' style='max-width: 100px;max-height: 100px;margin-left: 10px'>";
            }
            if (rdc.honorPics){
                for(var i=0;i<rdc.honorPics.length;i++){
                    honorPicImg+="<img src='"+rdc.honorPics[i].location+"' style='max-width: 100px;max-height: 100px;margin-left: 10px'>";
                }
            }
            if(rdc.files){
                for(var j=0;j<rdc.files.length;j++){
                    filesImg+="<img src='"+rdc.files[j].location+"' style='max-width: 100px;max-height: 100px;margin-left: 10px'>";
                }
            }
            $("#arrangePicSpan").hide();
            $("#honorfilesSpan").hide();
            $("#filesSpan").hide();
            $("#arrangePicDiv").show();
            $("#honorfilesDiv").show();
            $("#filesDiv").show();
            $("#arrangePicImg").empty().append(arrangePicImg);
            $("#honorfilesImg").empty().append(honorPicImg);
            $("#filesImg").empty().append(filesImg);
            $("#coldButton").attr("onclick", "doUpdateCold(" + id.id + ")");
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

/*添加冷库*/
function addCold() {
    $("#showNameMessage").hide();
    $('#addColdForm').form('clear');
    loadProvince();
    $("#coldButton").html("添加冷库");
    $('#addCold').dialog('open');
    $("#provinceId").combobox({value: ""});
    $("#cityId").combobox({value: ""});
    $("#arrangePicSpan").show();
    $("#honorfilesSpan").show();
    $("#filesSpan").show();
    $("#honorfilesDiv").hide();
    $("#arrangePicDiv").hide();
    $("#filesDiv").hide();
}
/*检查冷库名字是否重复*/
var addRdcFlag = true;
/*提交冷库验证方法*/
function coldValidation(honorfiles, files, vo) {
    if (!addRdcFlag) {
        alert("冷库名已存在!请更换!");
        return false;
    }
    if (honorfiles.length > 5) {
        alert("资质荣誉图,最多上传五张图片");
        return false;
    }
    if (files.length > 8) {
        alert("冷库图片,最多上传八张图片");
        return false;
    }
    if (vo.name.trim() == "" || vo.provinceId.trim() == "" || vo.cityId.trim() == "" || vo.address.trim() == "" || vo.area.trim() == ""
        || vo.manageType.trim() == "" || vo.storageType.trim() == "" || vo.temperType.trim() == "" || vo.phoneNum.trim() == "") {
        alert("请完善冷库信息！");
        return false;
    }
    var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,10}$/;
    var countRex = /^[0-9]\d*$/;
    if (!areaRex.test(vo.area)) {
        alert("面积输入有误！");
        return false;
    }
    if (vo.capacity1 != "" && !areaRex.test(vo.capacity1) || vo.capacity2 != "" && !areaRex.test(vo.capacity2) ||
        vo.capacity3 != "" && !areaRex.test(vo.capacity3) || vo.capacity4 != "" && !areaRex.test(vo.capacity4) ||
        vo.capacity5 != "" && !areaRex.test(vo.capacity5) || vo.height1 != "" && !areaRex.test(vo.height1) ||
        vo.height2 != "" && !areaRex.test(vo.height2) || vo.height3 != "" && !areaRex.test(vo.height3) ||
        vo.height4 != "" && !areaRex.test(vo.height4) || vo.height5 != "" && !areaRex.test(vo.height5)) {
        alert("冷库容积输入有误！");
        return false;
    }
    if (vo.coldTruck1 != "" && !countRex.test(vo.coldTruck1) || vo.coldTruck2 != "" && !countRex.test(vo.coldTruck2) ||
        vo.coldTruck3 != "" && !countRex.test(vo.coldTruck3) || vo.coldTruck4 != "" && !countRex.test(vo.coldTruck4)) {
        alert("冷藏车数量输入有误！");
        return false;
    }
    if (vo.lihuoArea != "" && !areaRex.test(vo.lihuoArea)) {
        alert("理货区面积输入有误！");
        return false;
    }
    var phoneNumRex = /^1[34578]\d{9}$/;
    if (!phoneNumRex.test(vo.phoneNum)) {
        alert("联系电话输入有误！");
        return false;
    }
    return true;
}
/*提交冷库信息*/
function addColdSubmit() {
    var honorfiles = $("input[name=honorfiles]").prop("files");
    var arrangePic = $("input[name=arrangePic]");
    var files = $("input[name=files]").prop("files");
    var parnArray = $("#addColdForm").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(honorfiles, files, vo);
    if (flag) {
        var formdata = new FormData();
        $.each(honorfiles, function (index, item) {
            formdata.append('honor' + index, item);
        });
        $.each(arrangePic, function (index, item) {
            formdata.append('arrangePics', item.files[0]);
        });
        $.each(files, function (index, item) {
            formdata.append('file' + (index + 1), item);
        });

        formdata.append("empStr", JSON.stringify(vo));
        $.ajax({
            url: "/i/rdc/addRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                alert("添加成功！");
                $('#addCold').dialog('close');
                reloaddata();
            }
        });
    }
}
/*提交修改冷库信息*/
function doUpdateCold(id) {
    var honorfiles = $("input[name=honorfiles]").prop("files");
    var arrangePic = $("input[name=arrangePic]");
    var files = $("input[name=files]").prop("files");
    var parnArray = $("#addColdForm").serializeArray();
    var vo = {};
    $.each(parnArray, function (index, item) {
        vo[item.name] = item.value;
    });
    var flag = coldValidation(honorfiles, files, vo);
    vo.rdcId = id;
    if (flag) {
        var formdata = new FormData();
        $.each(honorfiles, function (index, item) {
            formdata.append('honor' + index, item);
        });
        $.each(arrangePic, function (index, item) {
            formdata.append('arrangePics', item.files[0]);
        });
        $.each(files, function (index, item) {
            formdata.append('file' + (index + 1), item);
        });

        formdata.append("empStr", JSON.stringify(vo));
        $.ajax({
            url: "/i/rdc/updateRdc",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                alert("修改成功！");
                $('#addCold').dialog('close');
                reloaddata();
            }
        });
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
                    url: '../../i/rdc/deleteByRdcIDs',
                    traditional: true,
                    data: {'rdcIDs': rdcIDs},
                    success: function (data) {
                        if (data.status == 0) {
                            reloaddata();
                        } else {
                            $.messager.alert('错误', '删除冷库失败！', 'error');
                        }
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
    init_table();

    $("input", $("#name").next("span")).blur(function () {
        var rdcName = $("#name").val();
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