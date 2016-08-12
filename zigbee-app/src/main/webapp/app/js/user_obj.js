var mode = [ [ 'rdcID', "rdcID", "orderID" ],[ "确定要删除该冷库吗？", "确定要删除该数据吗？", "确定要删除该订单信息吗？" ] ,["colddetail.html?id=","colddetail.html?id=","orderdetail.html?id="]];
var urlset = [
		[ "editkutable.html?id=", "/i/rdc/deleteByRdcID","/i/rdc/findRDCDTOByUserId" ],// type=0:我的冷库 
		[ "editkutable.html?id=", "/i/ShareRdcController/delShareInfoByUid","/i/ShareRdcController/getSEListByUID" ],//1：我的发布//
		[ "orderdetail.html?id=", "/i/orders/deleteByOrderID","/i/orders/findOrdersByUserId" ]  //2:我的订单 3：我的点评
		
		];										
var isLoadRB = false, maxSize = 10, totalPages = currentPage = 1; // 当前页
var editinfo = function(id) {
	location.href = urlset[type][0] + id;
};
var detailinfo = function(id) {
	location.href = mode[2][type] + id;
};
var delrdc = function(id, em) {
	if (confirm(mode[1][type])) {
		var data = {
			"rdcID" : id,
			"orderID" : id,
			id : id,
			uid : window.user.id
		};
		$.ajax({
			url : ER.root + urlset[type][1],
			type : "post",
			data : data,
			success : function(data) {
				if (data.status == 0 || data.success) {
					$(em).parents('li').remove();
				} else {
					alert("删除失败！请稍后重试！");
				}
			}
		});
	}
};
var setuserinfo = function() {
	if (window.user) {
		var html = "<div class='img fl'><img src='" + window.user.avatar
				+ "'/></div><div class='name'><p class='nameinfo'>"
				+ window.user.nickname
				+ "</p><p class='position'><i class='iconfont'>&#xe66e;</i>"
				+ window.user.address + "</p></div>";
		$("#user_info").html(html);
	}
};
var initevg = function() {
	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight > scrollHeight - 30) {
			if (isLoadRB == false && currentPage < totalPages) {
				getPageData();
			}
		}
		;
	});
};
var gethtml = function(obj) {
	switch (type) {
	case 0:
		return [
				"<li class='clearfix' ><div  onclick='detailinfo("+ obj.id+")' class='clearfix'><div class='img fl'><img src='",obj.logo, "'/></div><p class='company'>", obj.name,
				"</p><p class='position'><i class='iconfont'>&#xe66e;</i>",
				obj.address,
				"</p></div><p class='btnGroup'><button onclick='editinfo(", obj.id,
				")'>修改</button><button onclick='delrdc(", obj.id,
				",this);'>删除</button></p></li>" ].join("");
		break;
	case 1:
		return [
				"<li class='clearfix' ><div  onclick='detailinfo("+ obj.id+")' class='clearfix'><div class='img fl'  onclick='detailinfo("+ obj.id+")'><img src='",
				obj.logo, "'/></div><p class='company'>", obj.title,
				"</p><p class='position'>", obj.typeText,
				"</p></div><p class='btnGroup'><button onclick='editinfo(", obj.id,
				")'>修改</button><button onclick='delrdc(", obj.id,
				",this);'>删除</button></p></li>" ].join("");
	default:
	case 2:
		return ["<li class='clearfix'><div  onclick='detailinfo("+ obj.orders.id+")' class='clearfix'><div class='img fl' ><img src='"
				, obj.logo
				, "'/></div><p class='company'>订单编号："
				, obj.orders.orderid
				, "</p><p class='position'>订单名称："
				, obj.orders.ordername
				, "</p></div><p class='btnGroup'><button onclick='editinfo("
				, obj.orders.id
				, ")'>查看</button><button onclick='delrdc("
				, obj.orders.id + ",this);'>删除</button></p></li>"].join("");
		break;
	}

};
var getPageData = function() {// 启用无限加载
	isLoadRB = true;//
	var _filter = {
		pageNum : currentPage,
		pageSize : maxSize,
		userID : window.user.id
	};
	$.get(ER.root + urlset[type][2], _filter, function(data) {
		if (data.success && data.data.length > 0) {
			totalPages = data.totalPages;
			currentPage++;
			var html = [];
			var rdcsList = data.data;//
			$.each(rdcsList, function(index, item) {
				html.push(gethtml(item));
			});
			$("#ul_rdcsL_list").append(html.join(""));
			$(".nodata").hide();
		} else {
			$(".nodata").show();
		}
		isLoadRB = false;
	});
};

function initdata() {
	setuserinfo();
	getPageData();
	initevg();
}
