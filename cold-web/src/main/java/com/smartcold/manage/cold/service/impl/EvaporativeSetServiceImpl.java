package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.EvaporativeBlowerSetMapping;
import com.smartcold.manage.cold.dao.olddb.EvaporativeWaterSetMapping;
import com.smartcold.manage.cold.dto.EvaporativeBlowerDto;
import com.smartcold.manage.cold.dto.EvaporativeDto;
import com.smartcold.manage.cold.dto.EvaporativeWaterDto;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.EvaporativeBlowerSetEntity;
import com.smartcold.manage.cold.entity.olddb.EvaporativeWaterSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.EvaporativeSetService;
import com.smartcold.manage.cold.service.StorageService;

@Service
public class EvaporativeSetServiceImpl implements EvaporativeSetService {

	@Autowired
	private StorageService storageService;

	@Autowired
	private EvaporativeBlowerSetMapping evaBlowerDao;

	@Autowired
	private EvaporativeWaterSetMapping evaWaterDao;

	@Override
	public EvaporativeDto getInfoByGroupId(int groupid) {
		EvaporativeDto result = new EvaporativeDto();
		ArrayList<EvaporativeBlowerDto> blowers = new ArrayList<EvaporativeBlowerDto>();

		List<EvaporativeBlowerSetEntity> evaBlowers = evaBlowerDao.findByGroupid(groupid);

		for (EvaporativeBlowerSetEntity entity : evaBlowers) {
			List<StorageKeyValue> infos = storageService.findByNums(StorageType.EVAPORATIVEBLOWER.getType(),
					entity.getId(), "run", 1);
			blowers.add(new EvaporativeBlowerDto(entity, infos.size() > 0 ? infos.get(0).getValue().intValue() : 0));
		}
		List<EvaporativeWaterSetEntity> evaWater = evaWaterDao.findByGroupid(groupid);
		if (evaWater.size() > 0) {
			List<StorageKeyValue> infos = storageService.findByNums(StorageType.EVAPORATIVEWATER.getType(),
					evaWater.get(0).getId(), "run", 1);
			result.setEvaWater(new EvaporativeWaterDto(evaWater.get(0),
					infos.size() > 0 ? infos.get(0).getValue().intValue() : 0));
		}

		result.setEvaBlowers(blowers);
		return result;
	}

}
