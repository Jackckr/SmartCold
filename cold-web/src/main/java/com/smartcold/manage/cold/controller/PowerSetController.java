package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.enums.StorageType;

@Controller
@RequestMapping(value = "/power")
public class PowerSetController {

	@Autowired
	private PowerSetMapping powerSetDao;

	@Autowired
	private ColdStorageAnalysisMapper analysisDao;

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

	@RequestMapping(value = "/findAnalysisByRdcidKeyDate")
	@ResponseBody
	public Object findAnalysisByRdcidKeyDate(int rdcid, String key, Date startTime, Date endTime) {
		HashMap<String, List<ColdStorageAnalysisEntity>> result = new HashMap<String, List<ColdStorageAnalysisEntity>>();
		List<PowerSetEntity> powers = powerSetDao.findByRdcId(rdcid);
		for (PowerSetEntity power : powers) {
			List<ColdStorageAnalysisEntity> datas = analysisDao.findValueByDate(StorageType.POWER.getType(),
					power.getId(), key, startTime, endTime);
			result.put(power.getName(), datas);
		}

		return result;
	}
}
