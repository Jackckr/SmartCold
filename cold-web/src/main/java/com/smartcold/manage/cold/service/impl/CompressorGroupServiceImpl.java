package com.smartcold.manage.cold.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorSetMapping;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.dto.CompressorDto;
import com.smartcold.manage.cold.dto.CompressorGroupWaterCostEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.CompressorGroupService;

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
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
		CompressorGroupSetEntity compressorGroup = compressGroupSetDao.findById(groupid);
		List<CompressorSetEntity> compressors = compressorSetDao.findCompressorByGroupid(groupid);
		double waterCost = 0;
		CompressorGroupWaterCostEntity entity = new CompressorGroupWaterCostEntity();

		for (CompressorSetEntity compressor : compressors) {
			// 在这里可以防止compressorGroup不为null
			Date nowDate = new Date();
			long nowTime;
			try {
				nowTime = sf.parse(sf.format(nowDate)).getTime();
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}
			entity.setCompressorGroupName(compressorGroup.getName());
			float totalRunTime = 0;
			List<StorageKeyValue> lRunH = storageKeyValueDao.findByTime(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runH", new Date(nowTime - 5 * 60 * 1000), new Date(nowTime));
			double lH = lRunH.size() > 0 ? lRunH.get(0).getValue() : 0;
			List<StorageKeyValue> lRunM = storageKeyValueDao.findByTime(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runM", new Date(nowTime - 5 * 60 * 1000), new Date(nowTime));
			double lM = lRunM.size() > 0 ? lRunM.get(0).getValue() : 0;
			List<StorageKeyValue> lRunS = storageKeyValueDao.findByTime(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runS", new Date(nowTime - 5 * 60 * 1000), new Date(nowTime));
			double lS = lRunS.size() > 0 ? lRunS.get(0).getValue() : 0;
			List<StorageKeyValue> runH = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runH", 1);
			List<StorageKeyValue> runM = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runM", 1);
			List<StorageKeyValue> runS = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "runS", 1);
			totalRunTime += runH.size() > 0 ? runH.get(0).getValue() - lH : 0;
			totalRunTime += runM.size() > 0 ? (runM.get(0).getValue() - lM) / 60 : 0;
			totalRunTime += runS.size() > 0 ? (runS.get(0).getValue() - lS) / 3600 : 0;
			if (totalRunTime < 0) {
				entity.setCompressorGroupName(entity.getCompressorGroupName()
						+ String.format("[%s,%s,rH:%s,lH:%s,rM:%s,lM:%s,rS:%s,ls:%s]", compressor.getId(), totalRunTime,
								runH.get(0).getValue(), lH, runM.get(0).getValue(), lM, runS.get(0).getValue(), lS));
			}
			waterCost += compressor.getPower() * compressor.getWaterRatio() * totalRunTime * 3600 / 2422.8 / 1000;
		}

		entity.setWaterCost(waterCost);
		return entity;
	}

	@Override
	public List<CompressorDto> getCompressorsState(int groupId) {
		List<CompressorSetEntity> compressors = compressorSetDao.findCompressorByGroupid(groupId);
		ArrayList<CompressorDto> result = new ArrayList<CompressorDto>();
		for (CompressorSetEntity compressor : compressors) {
			HashMap<String, Double> keyValues = new HashMap<String, Double>();
			List<StorageKeyValue> infos = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(),
					compressor.getId(), "run", 1);
			keyValues.put("isRunning", infos.size() > 0 ? infos.get(0).getValue() : 0);
			infos = storageKeyValueDao.findByNums(StorageType.COMPRESSOR.getTable(), compressor.getId(), "exTemp", 1);
			keyValues.put("exTemp", infos.size() > 0 ? infos.get(0).getValue() : 0);
			result.add(new CompressorDto(compressor, keyValues));
		}

		return result;
	}

}
