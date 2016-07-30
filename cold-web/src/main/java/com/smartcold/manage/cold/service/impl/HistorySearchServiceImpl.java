package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dto.SearchMeta;
import com.smartcold.manage.cold.entity.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.HistorySearchService;

@Service
public class HistorySearchServiceImpl implements HistorySearchService {
	
	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;
	
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;
	
	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;
	
	@Override
	public List<SearchMeta> getSearchItems(int rdcId) {
		List<SearchMeta> result = new ArrayList<SearchMeta>();
		SearchMeta searchMeta = null;
		// 查出冷库
		List<ColdStorageSetEntity> coldStorageSets = coldStorageSetDao.findByRdcId(rdcId);
//		for(ColdStorageSetEntity storageSets:coldStorageSets){
//			//处理温度
//			searchMeta = new SearchMeta(StorageType.STORAGE_TEMP.getType(),
//					storageSets.getId(), StorageType.STORAGE_TEMP.getDesc(), storageSets.getName());
//			result.add(searchMeta);
//			//冷库电量
//			searchMeta = new SearchMeta(StorageType.STORAGE_POWER.getType(), 
//					storageSets.getId(), StorageType.STORAGE_POWER.getDesc(), storageSets.getName());
//			result.add(searchMeta);
//			// 根据冷库id查出冷库门id，处理door
//			List<ColdStorageDoorSetEntity> doorSets = coldStorageDoorSetDao.findByStorageId(storageSets.getId());
//			for(ColdStorageDoorSetEntity doorSet:doorSets){
//				searchMeta = new SearchMeta(StorageType.STORAGE_DOOR.getType(),
//						doorSet.getId(), StorageType.STORAGE_DOOR.getDesc(), doorSet.getName());
//				result.add(searchMeta);
//			}
//		}
		
		//查出压缩机
		List<CompressorGroupSetEntity> compressorGroupSetEntities = compressorGroupSetDao.findLastNPoint(rdcId);
		for(CompressorGroupSetEntity cgse:compressorGroupSetEntities){
			
		}
		
		return result;
	}

	@Override
	public List<StorageKeyValue> findValuesByTime(int type, Date startTime, Date endTime) {
		// TODO Auto-generated method stub
		return null;
	}

}
