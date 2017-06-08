var onlyOpenTitle = "首页", areas = "Service", _menus, admin;
$.ajax({type: "GET",cache: false,dataType: 'json',url:"/i/admin/findAdmin",error: function(request) { },success: function(data) { admin = data.entity;if (admin == null || admin.id == 0) {var url = "http://" + location.host + "/login.html"; top.location.href = url;  } }});
function RemoveAccordion(){try{$("#menu .panel-title").each(function(){$("#menu").accordion("remove",$(this).text());	});}catch(e){}}//删除菜单
function find(menuid){var obj=null;$.each(_menus.menus,function(i,n){$.each(n.menus,function(j,o){if(o.menuid==menuid){obj=o}})});return obj}
function getIcon(menuid){var icon = 'icon ';$.each(_menus.menus, function(i, n) {$.each(n.menus, function(j, o) {if(o.menuid==menuid){icon += o.icon;} });});return icon;}
function addTab(subtitle,url,icon){if(!$('#tabs').tabs('exists',subtitle)){$('#tabs').tabs('add',{title:subtitle,content:createFrame(url),closable:true,icon:icon})}else{$('#tabs').tabs('select',subtitle);$('#mm-tabupdate').click()}tabClose()}
function tabClose(){$(".tabs-inner").dblclick(function(){var subtitle=$(this).children(".tabs-closable").text();$('#tabs').tabs('close',subtitle)});$("#tabs").bind('contextmenu',function(e){$('#mm').menu('show',{left:e.pageX,top:e.pageY});var subtitle=$(this).children(".tabs-closable").text();$('#mm').data("currtab",subtitle);$('#tabs').tabs('select',subtitle);return false})}
function createFrame(url) {if(url==null||url==""){return;} return '<iframe scrolling="no"  marginheight="0" marginwidth="0" frameborder="0"  src="/sell/viwe/' + url + '" style="width:100%;height:100%;"></iframe>';}
function tabCloseEven() { $('#mm').menu({ onClick: function (item) {closeTab(item.id); } }); return false;}//绑定右键菜单事件
function closeTab(action){var alltabs=$('#tabs').tabs('tabs');var currentTab=$('#tabs').tabs('getSelected');var allTabtitle=[];$.each(alltabs,function(i,n){allTabtitle.push($(n).panel('options').title)});switch(action){case"refresh":var iframe=$(currentTab.panel('options').content);var src=iframe.attr('src');$('#tabs').tabs('update',{tab:currentTab,options:{content:createFrame(src)}});break;case"close":var currtab_title=currentTab.panel('options').title;if(currtab_title!=onlyOpenTitle){$('#tabs').tabs('close',currtab_title)}else{msgShow("警告",'亲，'+onlyOpenTitle+'是无法关闭哦',"warning")}break;case"closeall":$.each(allTabtitle,function(i,n){if(n!=onlyOpenTitle){$('#tabs').tabs('close',n)}});break;case"closeother":var currtab_title=currentTab.panel('options').title;$.each(allTabtitle,function(i,n){if(n!=currtab_title&&n!=onlyOpenTitle){$('#tabs').tabs('close',n)}});break;case"closeright":var tabIndex=$('#tabs').tabs('getTabIndex',currentTab);if(tabIndex==alltabs.length-1){msgShow("警告",'亲，后边没有啦，无法关闭哦',"warning");return false}$.each(allTabtitle,function(i,n){if(i>tabIndex){if(n!=onlyOpenTitle){$('#tabs').tabs('close',n)}}});break;case"closeleft":var tabIndex=$('#tabs').tabs('getTabIndex',currentTab);if(tabIndex==1){msgShow("警告",'亲，前边那个上头有人，咱惹不起哦。 ^@^!!',"warning");return false}$.each(allTabtitle,function(i,n){if(i<tabIndex){if(n!=onlyOpenTitle){$('#tabs').tabs('close',n)}}});break;case"exit":$('#closeMenu').menu('hide');break}}
function Time(){t_div=document.getElementById('showtime');var now=new Date();var day="";if(now.getDay()==0)day=" 星期日";if(now.getDay()==1)day=" 星期一";if(now.getDay()==2)day=" 星期二";if(now.getDay()==3)day=" 星期三";if(now.getDay()==4)day=" 星期四";if(now.getDay()==5)day=" 星期五";if(now.getDay()==6)day=" 星期六";t_div.innerHTML=now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+" "+day;setTimeout(Time,1000)}
function InitLeftMenu(){var selectedPanelname='';$("#menu").accordion({animate:true,fit:true,border:false});$.each(usermenus,function(j,o){var menulist='<ul class="navlist">';if(o.child&&o.child.length>0){$.each(o.child,function(k,p){menulist+='<li><div><a ref="'+p.menuid+'" href="#" rel="'+p.url+'" ><span class="icon '+p.icon+'" > </span><span class="nav">'+p.menuname+'</span></a></div> </li>'})}menulist+='</ul>';$('#menu').accordion('add',{title:o.menuname,content:menulist,border:false,iconCls:'icon '+o.icon});if(j==0){selectedPanelname=o.menuname}});$('#menu').accordion('select',selectedPanelname);$('.navlist li a').click(function(){var tabTitle=$(this).children('.nav').text();var url=$(this).attr("rel");var icon=$(this).find('.icon').attr('class');addTab(tabTitle,url,icon);$('.navlist li div').removeClass("selected");$(this).parent().addClass("selected")}).hover(function(){$(this).parent().addClass("hover")},function(){$(this).parent().removeClass("hover")})}
function initusermenus(){
	//动态菜单

	

	InitLeftMenu();
}

//初始化数据
$().ready(function() {
	 

tabClose();
tabCloseEven();
Time();
$("#navmain li").first().addClass("active");
$('#navmain li').click(function () { $('#navmain li').removeClass("active"); $(this).addClass("active");RemoveAccordion(); InitLeftMenu(); });

   
});//初始化数据