package com.smartcold.manage.cold.service;

import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.dto.SearchMeta;

public interface HistorySearchService {

	List<SearchMeta> getSearchItems(int rdcId);
	
	Map<String, Object> getSearchItems(int rdcId,String types);
	
}
