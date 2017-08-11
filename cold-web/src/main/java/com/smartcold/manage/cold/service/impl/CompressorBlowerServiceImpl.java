package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.olddb.BlowerSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dto.BlowerDTO;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.BlowerSetEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.CompressorBlowerService;
import com.smartcold.manage.cold.service.StorageService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 23:05)
 */
@Service
public class CompressorBlowerServiceImpl implements CompressorBlowerService {

	@Autowired
	private BlowerSetMapper blowerSetDao;

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

	@Autowired
	private StorageService storageService;

	@Override
	public List<BlowerDTO> findByRdcId(int rdcId) {
		List<ColdStorageSetEntity> storageIdList = coldStorageSetDao.findByRdcId(rdcId);
		List<BlowerDTO> blowerList = Lists.newArrayList();
		List<StorageKeyValue> infos;
		if (storageIdList != null && !storageIdList.isEmpty()) {
			for (ColdStorageSetEntity coldStorageSetEntity : storageIdList) {
				List<BlowerSetEntity> blowerSets = blowerSetDao.findByStorageId(coldStorageSetEntity.getId());
				if (blowerSets != null && !blowerSets.isEmpty()) {
					for (BlowerSetEntity obj : blowerSets) {
						BlowerDTO blowerDTO = new BlowerDTO();
						blowerDTO.setName(obj.getName());
						blowerDTO.setBlowerId(obj.getId());
						blowerDTO.setColdStorageId(obj.getColdStorageId());
						blowerDTO.setCompressorGroupId(obj.getCompressorGroupId());
						blowerDTO.setDefrostingTemperature(obj.getDefrostingTemperature());
						infos = storageService.findByNums(StorageType.BLOWER.getType(), obj.getId(),"isDefrosting", 1);
						blowerDTO.setIsDefrosting(infos.size() > 0 ? infos.get(0).getValue().intValue() : 0);
						infos = storageService.findByNums(StorageType.BLOWER.getType(), obj.getId(),"isRunning", 1);
						blowerDTO.setIsRunning(infos.size() > 0 ? infos.get(0).getValue().intValue() : 0);
						blowerDTO.setColdStorageName(coldStorageSetEntity.getName());
						// 计算化霜累计时间/制冷累计时间
						infos = storageService.findByNums(StorageType.BLOWER.getType(), obj.getId(),"totalRunning", 1);
						blowerDTO.setRunTime(infos.size() > 0 ? infos.get(0).getValue().intValue() : 0);
						infos = storageService.findByNums(StorageType.BLOWER.getType(), obj.getId(),"totalDefrosting", 1);
						blowerDTO.setDefrostTime(infos.size() > 0 ? infos.get(0).getValue().intValue() : 0);
						blowerList.add(blowerDTO);
					}
				}
			}
		}
		return blowerList;
	}
	
}
