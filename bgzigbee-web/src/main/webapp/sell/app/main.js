var onlyOpenTitle = "首页", areas = "Service", _menus;
//动态菜单
var user={id:1,type:1,name:'lxj'};
var usermenus=[
          {"menuid": "1","icon": "icon-sys","menuname": "链库管理"
        	  ,"child": [
        	             {"menuid": "1_1","menuname": "用户管理","icon": "icon-user","url": "/sell/viwe/usermager.html"},
        	             {"menuid": "1_2","menuname": "冷库管理","icon": "icon-cold","url": "Login.html"},
        	             {"menuid": "1_3","menuname": "认证管理","icon": "icon-authe","url": "Login.html"},
        	             {"menuid": "1_4","menuname": "冷库配置","icon": "icon-coldcf","url": "Login.html"},
        	             {"menuid": "1_5","menuname": "共享管理","icon": "icon-role","url": "Login.html"},
        	             {"menuid": "1_6","menuname": "资讯管理","icon": "icon-role","url": "Login.html"}]
          } ,
          {
  			"menuid": "2",
  			"menuname": "设备管理",
  			"icon": "icon-add",
  			"url": "demo.html",
  			"child": [{"menuid": "2_0","menuname": "设备管理","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "2_1","menuname": "设备查询","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "2_4","menuname": "设备检测","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "2_3","menuname": "数据管理","icon": "icon-role","url": "Login.html"},
  			         ]
  		},
  		{
  			"menuid": "3",
  			"menuname": "冷库360管理",
  			"icon": "icon-add",
  			"url": "demo.html",
  			"child": [
  			          {"menuid": "3_0","menuname": "集团管理","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "3_1","menuname": "权限配置","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "3_2","menuname": "360配置","icon": "icon-role","url": "Login.html"},
  			          {"menuid": "3_3","menuname":"冷库报表","icon":"icon-role","url":"Login.html"},
  			          {"menuid": "3_4","menuname":"报警列表","icon":"icon-role","url":"Login.html"}
  			          ]
  		},
  		{
  			"menuid": "4",
  			"menuname": "网站统计",
  			"icon": "icon-add",
  			"url": "demo.html",
  			"child": [
						{"menuid":"4_0","menuname":"网站统计","icon":"icon-role","url":"Login.html"},
						{"menuid":"4_1","menuname":"操作日志","icon":"icon-role","url":"Login.html"}
  			          ]
  		},
  		{
  			"menuid": "5",
  			"menuname": "系统管理",
  			"icon": "icon-sys",
  			"url": "demo.html",
  			"child": [
                       {"menuid":"5_0","menuname":"系统消息","icon":"icon-role","url":"/sell/viwe/sysmessage.html"},
  			          ]
  		}
];


//删除菜单
function RemoveAccordion(){try{$("#menu .panel-title").each(function(){$("#menu").accordion("remove",$(this).text());	});}catch(e){}}

//初始化左侧
function InitLeftMenu() {
	var selectedPanelname = '';
    $("#menu").accordion({animate: true, fit: true, border: false });
	$.each(usermenus, function(j, o) {
		var menulist ='<ul class="navlist">';
		if(o.child && o.child.length>0)
		{
			$.each(o.child,function(k,p){
				menulist += '<li><div><a ref="'+p.menuid+'" href="#" rel="' + p.url + '" ><span class="icon '+p.icon+'" >&nbsp;</span><span class="nav">' + p.menuname + '</span></a></div> </li>';
			});
		}
		menulist += '</ul>';
		$('#menu').accordion('add', {
			title: o.menuname,
			content: menulist,
			border:false,
			iconCls: 'icon ' + o.icon
		});
		if(j==0){
			selectedPanelname =o.menuname;
		}
	});
	$('#menu').accordion('select',selectedPanelname);
    $('.navlist li a').click(function(){
		var tabTitle = $(this).children('.nav').text();
		var url = $(this).attr("rel");
		var menuid = $(this).attr("ref");
		var icon = $(this).find('.icon').attr('class');

		addTab(tabTitle,url,icon);
		$('.navlist li div').removeClass("selected");
		$(this).parent().addClass("selected");
	}).hover(function(){
		$(this).parent().addClass("hover");
	},function(){
		$(this).parent().removeClass("hover");
	});
}

//获取左侧导航的图标
function getIcon(menuid){
	var icon = 'icon ';
	$.each(_menus.menus, function(i, n) {
		 $.each(n.menus, function(j, o) {
		 	if(o.menuid==menuid){
				icon += o.icon;
			}
		 });
	});

	return icon;
}

function find(menuid){
	var obj=null;
	$.each(_menus.menus, function(i, n) {
		 $.each(n.menus, function(j, o) {
		 	if(o.menuid==menuid){
				obj = o;
			}
		 });
	});

	return obj;
}

function addTab(subtitle, url, icon) {
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            title: subtitle,
            content: createFrame(url),
            closable: true,
            icon: icon
        });
    } else {
        $('#tabs').tabs('select', subtitle);
        $('#mm-tabupdate').click();
    }
    tabClose();
}



function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('close', subtitle);
    });
    /*为选项卡绑定右键*/
    $("#tabs").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });

        var subtitle = $(this).children(".tabs-closable").text();

        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}

function createFrame(url) {
    return '<iframe scrolling="no"  marginheight="0" marginwidth="0" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
}
//绑定右键菜单事件
function tabCloseEven() {
    $('#mm').menu({
        onClick: function (item) {
            closeTab(item.id);
        }
    });
    return false;
}

function closeTab(action) {
    var alltabs = $('#tabs').tabs('tabs');
    var currentTab = $('#tabs').tabs('getSelected');
    var allTabtitle = [];
    $.each(alltabs, function (i, n) {
        allTabtitle.push($(n).panel('options').title);
    });

    switch (action) {
        case "refresh":
            var iframe = $(currentTab.panel('options').content);
            var src = iframe.attr('src');
            $('#tabs').tabs('update', {
                tab: currentTab,
                options: {
                    content: createFrame(src)
                }
            });
            break;
        case "close":
            var currtab_title = currentTab.panel('options').title;
            if (currtab_title != onlyOpenTitle) {
                $('#tabs').tabs('close', currtab_title);
            } else {
                msgShow("警告", '亲，' + onlyOpenTitle + '是无法关闭哦', "warning");
            }
            break;
        case "closeall":
            $.each(allTabtitle, function (i, n) {
                if (n != onlyOpenTitle) {
                    $('#tabs').tabs('close', n);
                }
            });
            break;
        case "closeother":
            var currtab_title = currentTab.panel('options').title;
            $.each(allTabtitle, function (i, n) {
                if (n != currtab_title && n != onlyOpenTitle) {
                    $('#tabs').tabs('close', n);
                }
            });
            break;
        case "closeright":
            var tabIndex = $('#tabs').tabs('getTabIndex', currentTab);

            if (tabIndex == alltabs.length - 1) {
                msgShow("警告", '亲，后边没有啦，无法关闭哦', "warning");
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i > tabIndex) {
                    if (n != onlyOpenTitle) {
                        $('#tabs').tabs('close', n);
                    }
                }
            });

            break;
        case "closeleft":
            var tabIndex = $('#tabs').tabs('getTabIndex', currentTab);
            if (tabIndex == 1) {
                msgShow("警告", '亲，前边那个上头有人，咱惹不起哦。 ^@^!!', "warning");
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i < tabIndex) {
                    if (n != onlyOpenTitle) {
                        $('#tabs').tabs('close', n);
                    }
                }
            });

            break;
        case "exit":
            $('#closeMenu').menu('hide');
            break;
    }
}

//弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function msgShow(title, msgString, msgType) {
    $.messager.alert(title, msgString, msgType);
}

function Time() {
    t_div = document.getElementById('showtime');
    var now = new Date();
    var day;
    if (now.getDay() == 0) day = " 星期日";
    if (now.getDay() == 1) day = " 星期一";
    if (now.getDay() == 2) day = " 星期二";
    if (now.getDay() == 3) day = " 星期三";
    if (now.getDay() == 4) day = " 星期四";
    if (now.getDay() == 5) day = " 星期五";
    if (now.getDay() == 6) day = " 星期六";
    t_div.innerHTML = now.getFullYear()
+ "年" + (now.getMonth() + 1) + "月" + now.getDate()
+ "日&nbsp;" + now.getHours() + ":" + now.getMinutes()
+ ":" + now.getSeconds() + "&nbsp;" + day;
    setTimeout(Time, 1000);
}

$(function () {
    tabClose();
    tabCloseEven();
	Time();

	$("#navmain li").first().addClass("active");
    $('#navmain li').click(function () {
        $('#navmain li').removeClass("active");
        $(this).addClass("active");
		RemoveAccordion();
        InitLeftMenu();
    });
	InitLeftMenu();
})