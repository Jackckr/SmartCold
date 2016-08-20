package com.smartcold.manage.cold.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.ChargingPileSetMapping;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.ForkLiftSetMapping;
import com.smartcold.manage.cold.dao.olddb.PressurePlatformSetMapping;
import com.smartcold.manage.cold.dao.olddb.WindScreenSetMapping;
import com.smartcold.manage.cold.dto.CostEntity;
import com.smartcold.manage.cold.dto.OtherDeviceDto;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ChargingPileSetEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.ForkLiftSetEntity;
import com.smartcold.manage.cold.entity.olddb.PressurePlatformSetEntity;
import com.smartcold.manage.cold.entity.olddb.WindScreenSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.OtherDeviceService;
import com.smartcold.manage.cold.service.StorageService;

@Service
public class OtherDeviceServiceImpl implements OtherDeviceService {

	@Autowired
	private ForkLiftSetMapping forkLiftSetDao;

	@Autowired
	private WindScreenSetMapping windScreenSetDao;

	@Autowired
	private ChargingPileSetMapping chargingPileSetDao;

	@Autowired
	private PressurePlatformSetMapping pressurePlatformSetDao;

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

	@Autowired
	private StorageService storageService;

	@Override
	public OtherDeviceDto getOtherDeviceCostByTime(int rdcId, Date startTime, Date endTime) {
		OtherDeviceDto otherDeviceDto = new OtherDeviceDto();

		otherDeviceDto.setForkLift(getForkLiftCostByTime(rdcId, startTime, endTime));
		otherDeviceDto.setWindScreen(getWindScreenByTime(rdcId, startTime, endTime));
		otherDeviceDto.setChargingPile(getForkLiftCostByTime(rdcId, startTime, endTime));
		otherDeviceDto.setPressurePlatform(getPressureByTime(rdcId, startTime, endTime));

		return otherDeviceDto;
	}

	public List<CostEntity> getForkLiftCostByTime(int rdcId, Date startTime, Date endTime) {
		List<ForkLiftSetEntity> forkLiftEntities = forkLiftSetDao.findByRdcId(rdcId);
		ArrayList<CostEntity> costEntities = new ArrayList<CostEntity>();
		for (ForkLiftSetEntity entity : forkLiftEntities) {
			List<StorageKeyValue> infos = storageService.findByTime(StorageType.FORKLIFT.getType(), entity.getId(),
					"time", startTime, endTime);
			for (StorageKeyValue info : infos) {
				costEntities.add(new CostEntity(entity.getPower() * info.getValue(), info.getAddtime()));
			}
		}

		return mergeCost(costEntities);
	}

	public List<CostEntity> getWindScreenByTime(int rdcId, Date startTime, Date endTime) {
		ArrayList<CostEntity> costEntities = new ArrayList<CostEntity>();
		List<ColdStorageSetEntity> storages = coldStorageSetDao.findByRdcId(rdcId);
		for (ColdStorageSetEntity entity : storages) {
			List<WindScreenSetEntity> windEntities = windScreenSetDao.findByStorageId(entity.getId());
			for (WindScreenSetEntity windEntity : windEntities) {
				List<StorageKeyValue> infos = storageService.findByTime(StorageType.WINDSCREEN.getType(),
						windEntity.getId(), "time", startTime, endTime);
				for (StorageKeyValue info : infos) {
					costEntities.add(new CostEntity(windEntity.getPower() * info.getValue(), info.getAddtime()));
				}
			}
		}

		return mergeCost(costEntities);
	}

	public List<CostEntity> getPressureByTime(int rdcId, Date startTime, Date endTime) {
		ArrayList<CostEntity> costEntities = new ArrayList<CostEntity>();
		List<PressurePlatformSetEntity> pressureEntities = pressurePlatformSetDao.findByRdcId(rdcId);
		for (PressurePlatformSetEntity pressure : pressureEntities) {
			List<StorageKeyValue> infos = storageService.findByTime(StorageType.PRESSUREPLATFORM.getType(),
					pressure.getId(), "time", startTime, endTime);
			for (StorageKeyValue info : infos) {
				costEntities.add(new CostEntity(pressure.getPower() * info.getValue(), info.getAddtime()));
			}
		}

		return mergeCost(costEntities);
	}

	public List<CostEntity> getChargingPileByTime(int rdcId, Date startTime, Date endTime) {
		ArrayList<CostEntity> costEntities = new ArrayList<CostEntity>();
		List<ChargingPileSetEntity> chargingEntities = chargingPileSetDao.findByRdcId(rdcId);
		for (ChargingPileSetEntity chargingEntity : chargingEntities) {
			List<StorageKeyValue> infos = storageService.findByTime(StorageType.CHARGINGPILE.getType(),
					chargingEntity.getId(), "time", startTime, endTime);
			for (StorageKeyValue info : infos) {
				costEntities.add(new CostEntity(chargingEntity.getPower() * info.getValue(), info.getAddtime()));
			}
		}

		return mergeCost(costEntities);
	}

	public ArrayList<CostEntity> mergeCost(List<CostEntity> entities) {
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
		HashMap<String, Double> timeCostMap = new HashMap<String, Double>();
		ArrayList<CostEntity> results = new ArrayList<CostEntity>();
		CompareCostEntity compareCostEntity = new CompareCostEntity();
		for (CostEntity entity : entities) {
			String timeFormat = sf.format(entity.getTime());
			if (timeCostMap.containsKey(timeFormat)) {
				timeCostMap.put(timeFormat, timeCostMap.get(timeFormat) + entity.getCost());
			} else {
				timeCostMap.put(timeFormat, entity.getCost());
			}
		}
		for (Entry<String, Double> entry : timeCostMap.entrySet()) {
			try {
				results.add(new CostEntity(entry.getValue(), sf.parse(entry.getKey())));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		Collections.sort(results, compareCostEntity);
		return results;
	}

	private class CompareCostEntity implements Comparator<CostEntity> {

		public int compare(CostEntity arg0, CostEntity arg1) {
			return arg0.getTime().getTime() > arg1.getTime().getTime() ? 1 : -1;
		}

	}

}
