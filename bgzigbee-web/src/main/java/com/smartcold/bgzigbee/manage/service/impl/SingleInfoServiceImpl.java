package com.smartcold.bgzigbee.manage.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.bgzigbee.manage.dao.CompleteInfoMapper;
import com.smartcold.bgzigbee.manage.dao.KeyDeviceMappingMapper;
import com.smartcold.bgzigbee.manage.dto.SingleInfoEntity;
import com.smartcold.bgzigbee.manage.entity.CompleteInfoEntity;
import com.smartcold.bgzigbee.manage.entity.KeyDeviceMappingEntity;
import com.smartcold.bgzigbee.manage.entity.MergeCompleteInfoEntity;
import com.smartcold.bgzigbee.manage.service.SingleInfoService;

@Service
public class SingleInfoServiceImpl implements SingleInfoService {

	@Autowired
	private CompleteInfoMapper completeInfoDao;

	@Autowired
	private KeyDeviceMappingMapper keyDeviceMappingDao;

	public SingleInfoEntity getAllInfoByKey(String key) {
		SingleInfoEntity singleInfoEntity = new SingleInfoEntity();
		CompleteInfoEntity tmpEntity, tmpEntity2;

		singleInfoEntity.setKey(key);
		List<CompleteInfoEntity> completeInfoEntities = completeInfoDao.findInfoByKey(key);
		singleInfoEntity.setInfos(completeInfoEntities);
		if (completeInfoEntities.size() > 0) {
			tmpEntity = completeInfoEntities.get(0);
			if (tmpEntity.getTemperature() > -9) {
				singleInfoEntity.incOverTemperatureTimes();
			}
			MergeCompleteInfoEntity mergeCompleteInfoEntity = new MergeCompleteInfoEntity(tmpEntity);
			for (int i = 1; i < completeInfoEntities.size(); i++) {
				tmpEntity2 = completeInfoEntities.get(i);
				if (tmpEntity2.getTemperature() > -9) {
					singleInfoEntity.incOverTemperatureTimes();
				}
				if (tmpEntity.getApid().equals(tmpEntity2.getApid())) {
					mergeCompleteInfoEntity.setEndTime(tmpEntity2.getTime());
					mergeCompleteInfoEntity
							.setHighestTemperature(Math.max(tmpEntity.getTemperature(), tmpEntity2.getTemperature()));
					mergeCompleteInfoEntity
							.setLowestTemperature(Math.min(tmpEntity.getTemperature(), tmpEntity2.getTemperature()));
				} else {
					singleInfoEntity.addAnanysis(mergeCompleteInfoEntity);
					tmpEntity = tmpEntity2;
					mergeCompleteInfoEntity = new MergeCompleteInfoEntity(tmpEntity);
				}
			}
			singleInfoEntity.addAnanysis(mergeCompleteInfoEntity);
		}
		return singleInfoEntity;
	}

	public List<SingleInfoEntity> getBatchInfoByKey(String key) {
		String batchKey;
		String regEx = "\\(10\\)(\\w+)\\(";
		Pattern pat = Pattern.compile(regEx);
		Matcher mat = pat.matcher(key);
		if (mat.find()) {
			batchKey = mat.group(0);
		} else {
			return null;
		}

		List<KeyDeviceMappingEntity> keyDeviceMappings = keyDeviceMappingDao.findByKeypre(batchKey);
		List<SingleInfoEntity> singles = new ArrayList<SingleInfoEntity>();

		if (keyDeviceMappings != null) {
			for (KeyDeviceMappingEntity entity : keyDeviceMappings) {
				singles.add(getAllInfoByKey(entity.getKey()));
			}
		}

		return singles;
	}

}
