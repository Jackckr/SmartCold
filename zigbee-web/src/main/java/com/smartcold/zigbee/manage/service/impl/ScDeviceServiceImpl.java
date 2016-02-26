package com.smartcold.zigbee.manage.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.smartcold.zigbee.manage.dao.ScinfoMapper;
import com.smartcold.zigbee.manage.entity.MergeInfoDeviceEntity;
import com.smartcold.zigbee.manage.entity.ScInfoDeviceEntity;
import com.smartcold.zigbee.manage.service.ScDeviceService;

@Controller
public class ScDeviceServiceImpl implements ScDeviceService {

	@Autowired
	private ScinfoMapper scinfoDao;

	public List<MergeInfoDeviceEntity> findScDeviceByKey(String key) {
		List<ScInfoDeviceEntity> entities = scinfoDao.findInfoDeviceByKey(key);
		if (entities == null) {
			return null;
		} else {
			List<MergeInfoDeviceEntity> mergeEntities = new ArrayList<MergeInfoDeviceEntity>();
			MergeInfoDeviceEntity mergeTmp = new MergeInfoDeviceEntity();
			ScInfoDeviceEntity entityTmp = entities.get(0);
			mergeTmp.setLocation(entityTmp.getLocation());
			mergeTmp.setStartTime(entityTmp.getAddtime());
			mergeTmp.setEndTime(entityTmp.getAddtime());
			mergeTmp.setHighestTemperature(entityTmp.getInfo1());
			mergeTmp.setLowestTemperature(entityTmp.getInfo1());
			// 合并同一地点
			for (int i = 1; i < entities.size(); i++) {
				entityTmp = entities.get(i);
				if (mergeTmp.getLocation().equals(entityTmp.getLocation())) {
					mergeTmp.setEndTime(entityTmp.getAddtime());
					mergeTmp.setLowestTemperature(mergeTmp.getLowestTemperature() > entityTmp.getInfo1()
							? entityTmp.getInfo1() : mergeTmp.getLowestTemperature());
					mergeTmp.setHighestTemperature(mergeTmp.getHighestTemperature() < entityTmp.getInfo1()
							? entityTmp.getInfo1() : mergeTmp.getHighestTemperature());
				} else {
					mergeEntities.add(mergeTmp);
					mergeTmp = new MergeInfoDeviceEntity(); 
					mergeTmp.setLocation(entityTmp.getLocation());
					mergeTmp.setStartTime(entityTmp.getAddtime());
					mergeTmp.setEndTime(entityTmp.getAddtime());
					mergeTmp.setHighestTemperature(entityTmp.getInfo1());
					mergeTmp.setLowestTemperature(entityTmp.getInfo1());
				}
			}
			mergeEntities.add(mergeTmp);
			return mergeEntities;
		}
	}
}
