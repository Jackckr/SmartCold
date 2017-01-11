package com.smartcold.manage.cold.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;

@Controller
@RequestMapping(value = "/power")
public class PowerSetController {

	@Autowired
	private PowerSetMapping powerSetDao;

	@Autowired
	private ColdStorageAnalysisService analysisService;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return powerSetDao.findById(id);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByRdcId(@RequestParam int rdcId) {
		return powerSetDao.findByRdcId(rdcId);
	}

	@RequestMapping(value = "/findAnalysisByRdcidKeysDate")
	@ResponseBody
	public Object findAnalysisByRdcidKeyDate(int rdcid, String keys,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>> result = new HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>>();
		List<PowerSetEntity> powers = powerSetDao.findByRdcId(rdcid);
		for (PowerSetEntity power : powers) {
			result.put(power.getName(), analysisService.findValueByDateKeys(StorageType.POWER.getType(), power.getId(),
					Arrays.asList(keys.split(",")), startTime, endTime));
		}

		return result;
	}
}
