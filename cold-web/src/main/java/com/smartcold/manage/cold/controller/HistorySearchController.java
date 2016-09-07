package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.HistorySearchService;
import com.smartcold.manage.cold.util.ExportExcelUtil;

@Controller
@RequestMapping("/historySearch")
@ResponseBody
public class HistorySearchController {
	
	@Autowired
	HistorySearchService historySearchService;
	
	@RequestMapping("/findAllStorageKeys")
	public Object findAllStorageKeys(int rdcId){
		return historySearchService.getSearchItems(rdcId);
	}
	
	@RequestMapping("/findStorageKeysByFilter")
	public Object findStorageKeysByFilter(int rdcId,String types){
		return historySearchService.getSearchItems(rdcId,types);
	}
	
	@RequestMapping("/expHistoryData")
	public boolean expHistoryData(HttpServletRequest request,HttpServletResponse response,String filename,Integer rdcId,Integer [] itemids){
		  List<UserEntity> list = new ArrayList<UserEntity>();  
	        for (int i = 0; i < 50000; i++) {
	      	  UserEntity user = new UserEntity();  
	      	  user.setId(10000+i);
	      	  user.setUsername("XYZ"+i);
	      	  user.setPassword("pwd"+i);
	      	  user.setTelephone("135978113215");
	      	  user.setEmail(i+"@qq.com");
	      	  user.setRole(1);
	      	  list.add(user);  
	      	  System.err.println("创建第"+i+"条数据！");
			   }
	       String mode[][]={{"id","角色","用户名","密码","电话","邮箱"},{"id","role","username","password","telephone","email"},{"2","2","5","5","5","5"}} ;//标题（必须），对应属性（必须），宽度
	       ExportExcelUtil.expExcel(response,"导出xls.xls","测试",mode,list);
	       return true;
	}
}
