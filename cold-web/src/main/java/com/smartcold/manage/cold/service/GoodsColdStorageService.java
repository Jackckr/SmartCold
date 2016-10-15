package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.GoodsColdStorageEntity;

public interface GoodsColdStorageService {

	public Map<String, List<GoodsColdStorageEntity>> findGoodsByDate(int coldstorageId, Date startDate, Date endDate);
}
