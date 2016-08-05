package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.NewStorageKeysMapper;
import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dto.SearchMeta;
import com.smartcold.manage.cold.entity.newdb.NewStorageKeysEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
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
	
	@Autowired
	private NewStorageKeysMapper storageKeysDao;
	
	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;
	
	@Override
	public List<SearchMeta> getSearchItems(int rdcId) {
		List<SearchMeta> result = new ArrayList<SearchMeta>();
		SearchMeta searchMeta = null;
		
		List<NewStorageKeysEntity> storageKeys = storageKeysDao.findAll();
		for(NewStorageKeysEntity storageKey:storageKeys){
			StorageType stype = StorageType.getStorageType(storageKey.getType());
			
			switch (stype) {
			case STORAGE:
				// 查出冷库配置
				List<ColdStorageSetEntity> coldStorageSets = coldStorageSetDao.findByRdcId(rdcId);
				for(ColdStorageSetEntity storageSet:coldStorageSets){
					searchMeta = new SearchMeta(StorageType.STORAGE.getType(), 
							storageSet.getId(), storageKey.getKey(), storageKey.getDesc(), storageSet.getName(), storageKey.getUnit());
					result.add(searchMeta);
				}
				break;
			case DOOR:
				//门的配置
				List<ColdStorageDoorSetEntity> csdse = coldStorageDoorSetDao.findByRdcId(rdcId);
				for(ColdStorageDoorSetEntity storageDoor:csdse){
					searchMeta = new SearchMeta(StorageType.DOOR.getType(), storageDoor.getId(),
							storageKey.getKey(), storageKey.getDesc(), storageDoor.getName(), storageKey.getUnit());
					result.add(searchMeta);
				}
				break;
			case COMPRESSOR:
				//查看key是否有数据
				if (storageKeyValueDao.haveKey(StorageType.COMPRESSOR.getTable(), storageKey.getKey())) {
					// 压缩机
					List<CompressorGroupSetEntity> pressSets = compressorGroupSetDao.findByRdcId(rdcId);
					for(CompressorGroupSetEntity pressSet:pressSets){
						searchMeta = new SearchMeta(StorageType.COMPRESSOR.getType(), pressSet.getId(),
								storageKey.getKey(), storageKey.getDesc(), pressSet.getName(), storageKey.getUnit());
						result.add(searchMeta);
					}
				}
				break;
			default:
				break;
			}

		}
								
		return result;
	}

	@Override
	public List<StorageKeyValue> findValuesByTime(int type, Date startTime, Date endTime) {
		// TODO Auto-generated method stub
		return null;
	}

}
