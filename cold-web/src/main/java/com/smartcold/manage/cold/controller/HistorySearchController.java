package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.service.HistorySearchService;

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
	
	@Deprecated
	@RequestMapping("/findStorageKeysByFilter")
	public Object findStorageKeysByFilter(int rdcId,String types){
		return historySearchService.getSearchItems(rdcId,types);
	}
	

}
