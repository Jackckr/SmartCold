package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.dto.SearchMeta;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface HistorySearchService {

	List<SearchMeta> getSearchItems(int rdcId);
	
	List<StorageKeyValue> findValuesByTime(int type, Date startTime, Date endTime);
}
