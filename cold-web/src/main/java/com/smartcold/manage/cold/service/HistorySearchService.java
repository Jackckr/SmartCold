package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.dto.SearchMeta;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface HistorySearchService {

	List<SearchMeta> getSearchItems(int rdcId);
	
	Map<String, Object> getSearchItems(int rdcId,String types);
	
	List<StorageKeyValue> findValuesByTime(int type, Date startTime, Date endTime);
}
