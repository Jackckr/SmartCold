package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.GoodsColdStorageMapper;
import com.smartcold.manage.cold.entity.newdb.GoodsColdStorageEntity;
import com.smartcold.manage.cold.service.GoodsColdStorageService;

@Service
public class GoodsColdStorageServiceImpl implements GoodsColdStorageService {

	@Autowired
	private GoodsColdStorageMapper goodsColdStorageDao;

	@Override
	public Map<String, List<GoodsColdStorageEntity>> findGoodsByDate(int coldstorageId, Date startDate, Date endDate) {
		HashMap<String, List<GoodsColdStorageEntity>> result = new HashMap<String, List<GoodsColdStorageEntity>>();
		List<GoodsColdStorageEntity> goods = goodsColdStorageDao.findByDate(coldstorageId, startDate, endDate);
		for (GoodsColdStorageEntity good : goods) {
			if (!result.containsKey(good.getGoodsname())) {
				result.put(good.getGoodsname(), new ArrayList<GoodsColdStorageEntity>());
			}
			result.get(good.getGoodsname()).add(good);
		}

		return result;
	}

}
