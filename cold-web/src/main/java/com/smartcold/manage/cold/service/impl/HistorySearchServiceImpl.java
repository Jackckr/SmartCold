package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.newdb.StorageKeysMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dto.SearchMeta;
import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;
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
	private StorageKeysMapper storageKeysDao;

	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;

	@Override
	public List<SearchMeta> getSearchItems(int rdcId) {
		List<SearchMeta> result = new ArrayList<SearchMeta>();
		SearchMeta searchMeta = null;

		List<StorageKeysEntity> storageKeys = storageKeysDao.findAll();
		for (StorageKeysEntity storageKey : storageKeys) {
			StorageType stype = StorageType.getStorageType(storageKey.getType());

			switch (stype) {
			case STORAGE:
				// 查出冷库配置
				List<ColdStorageSetEntity> coldStorageSets = coldStorageSetDao.findByRdcId(rdcId);
				for (ColdStorageSetEntity storageSet : coldStorageSets) {
					searchMeta = new SearchMeta(StorageType.STORAGE.getType(), storageSet.getId(), storageKey.getKey(),
							storageKey.getDesc(), storageSet.getName(), storageKey.getUnit());
					result.add(searchMeta);
				}
				break;
			case DOOR:
				// 门的配置
				List<ColdStorageDoorSetEntity> csdse = coldStorageDoorSetDao.findByRdcId(rdcId);
				for (ColdStorageDoorSetEntity storageDoor : csdse) {
					searchMeta = new SearchMeta(StorageType.DOOR.getType(), storageDoor.getId(), storageKey.getKey(),
							storageKey.getDesc(), storageDoor.getName(), storageKey.getUnit());
					result.add(searchMeta);
				}
				break;
			case COMPRESSORGROUP:
				// 查看key是否有数据
				if (storageKeyValueDao.haveKey(StorageType.COMPRESSORGROUP.getTable(), storageKey.getKey())) {
					// 压缩机
					List<CompressorGroupSetEntity> pressSets = compressorGroupSetDao.findByRdcId(rdcId);
					for (CompressorGroupSetEntity pressSet : pressSets) {
						searchMeta = new SearchMeta(StorageType.COMPRESSORGROUP.getType(), pressSet.getId(),
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

	/**
	 * 历史数据查询
	 * 
	 */
	@Deprecated
	@Override
	public LinkedHashMap<String, Object> getSearchItems(int rdcId, String types) {
		SearchMeta searchMeta = null;
		LinkedHashMap<String, Object> allresult = new LinkedHashMap<String, Object>();
		LinkedHashMap<String, Object> result = new LinkedHashMap<String, Object>();
		LinkedHashMap<String, Object> reskey = new LinkedHashMap<String, Object>();
		List<StorageKeysEntity> storageKeys = this.storageKeysDao.findbyFilter("1,2",
				" 'Temp','powerConsume','Switch' ");
		for (StorageKeysEntity storageKey : storageKeys) {
			StorageType stype = StorageType.getStorageType(storageKey.getType());
			switch (stype) {
			case STORAGE:
				// 查出冷库配置
				List<SearchMeta> searcList = new ArrayList<SearchMeta>();
				List<ColdStorageSetEntity> coldStorageSets = this.coldStorageSetDao.findByRdcId(rdcId);
				for (ColdStorageSetEntity storageSet : coldStorageSets) {
					searchMeta = new SearchMeta(StorageType.STORAGE.getType(), storageSet.getId(), storageKey.getKey(),
							storageKey.getDesc(), storageSet.getName(), storageKey.getUnit());
					searcList.add(searchMeta);
				}
				result.put(storageKey.getType() + "_" + storageKey.getKey(), searcList);
				reskey.put(storageKey.getType() + "_" + storageKey.getKey(), storageKey.getDesc());
				break;
			case DOOR:
				// 门的配置
				List<SearchMeta> smList = new ArrayList<SearchMeta>();
				List<ColdStorageDoorSetEntity> csdse = this.coldStorageDoorSetDao.findByRdcId(rdcId);
				for (ColdStorageDoorSetEntity storageDoor : csdse) {
					searchMeta = new SearchMeta(StorageType.DOOR.getType(), storageDoor.getId(), storageKey.getKey(),
							storageKey.getDesc(), storageDoor.getName(), storageKey.getUnit());
					smList.add(searchMeta);
				}
				result.put(storageKey.getType() + "_" + storageKey.getKey(), smList);
				reskey.put(storageKey.getType() + "_" + storageKey.getKey(), storageKey.getDesc());
				break;

			default:
				break;
			}
		}
		allresult.put("key", reskey);
		allresult.put("keydata", result);
		return allresult;
	}

}
