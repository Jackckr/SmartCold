package com.smartcold.manage.cold.service.impl;

import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorSetMapping;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.dto.CompressorGroupWaterCostEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.CompressorGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 14:38)
 */
@Service
public class CompressorGroupServiceImpl implements CompressorGroupService {

	@Autowired
	private CompressorGroupSetMapper compressGroupSetDao;

	@Autowired
	private CompressorSetMapping compressorSetDao;

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;

	@Override
	public List<CompressorGroupSetEntity> findByUserId(int userid) {
		RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userid));
		if (rdcUser == null)
			return null;
		return compressGroupSetDao.findByRdcId(rdcUser.getRdcid());
	}

	@Override
	public CompressorGroupWaterCostEntity getWaterCost(int groupid) {
		CompressorGroupSetEntity compressorGroup = compressGroupSetDao.findById(groupid);
		List<CompressorSetEntity> compressors = compressorSetDao.findCompressorByGroupid(groupid);
		double waterCost = 0;
		CompressorGroupWaterCostEntity entity = new CompressorGroupWaterCostEntity();

		for (CompressorSetEntity compressor : compressors) {
			// 在这里可以防止compressorGroup不为null
			entity.setCompressorGroupName(compressorGroup.getName());
			float totalRunTime = 0;
			List<StorageKeyValue> runH = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runH", 1);
			List<StorageKeyValue> runM = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runM", 1);
			List<StorageKeyValue> runS = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runS", 1);
			totalRunTime += runH.size() > 0 ? runH.get(0).getValue() : 0;
			totalRunTime += runM.size() > 0 ? runM.get(0).getValue() : 0;
			totalRunTime += runS.size() > 0 ? runS.get(0).getValue() : 0;
			waterCost = compressor.getPower() * compressor.getWaterRatio() * totalRunTime * 3600 / 2422.8 / 1000;
		}

		entity.setWaterCost(waterCost);
		return entity;
	}

}
