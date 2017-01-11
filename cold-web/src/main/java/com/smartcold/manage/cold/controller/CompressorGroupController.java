package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
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

import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dto.CompressorGroupWaterCostEntity;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.service.CompressorGroupService;
import com.smartcold.manage.cold.service.StorageService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 15:05)
 */
@Controller
@ResponseBody
@RequestMapping(value = "/compressorGroup")
public class CompressorGroupController {

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private CompressorGroupService compressorGroupService;

	@Autowired
	private ColdStorageAnalysisService analysisService;

	@Autowired
	private StorageService storageService;

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	public Object findByUserId(@RequestParam int userId) {
		return compressorGroupService.findByUserId(userId);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	public Object findByGroupId(@RequestParam int rdcId) {
		return compressorGroupSetDao.findByRdcId(rdcId);
	}

	@RequestMapping("/findPressByNums")
	public Object findPressByNums(int compressorID, String key,
			@RequestParam(value = "nums", defaultValue = "2") Integer nums) {
		List<StorageKeyValue> lowPress = storageService.findByNums(StorageType.COMPRESSORGROUP, compressorID,
				"lowPress", nums);
		List<StorageKeyValue> highPress = storageService.findByNums(StorageType.COMPRESSORGROUP, compressorID,
				"highPress", nums);
		Map<String, List<StorageKeyValue>> result = new HashMap<String, List<StorageKeyValue>>(2);
		result.put("lowPress", lowPress);
		result.put("highPress", highPress);
		return result;
	}

	@RequestMapping(value = "/getWaterCost", method = RequestMethod.GET)
	@ResponseBody
	public Object getWaterCost(int groupId) {
		return compressorGroupService.getWaterCost(groupId);
	}

	@RequestMapping(value = "/getAllWaterCostByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object getAllWaterCostByRdcId(int rdcId) {
		ArrayList<CompressorGroupWaterCostEntity> result = new ArrayList<CompressorGroupWaterCostEntity>();
		List<CompressorGroupSetEntity> groupSets = compressorGroupSetDao.findByRdcId(rdcId);

		for (CompressorGroupSetEntity groupSet : groupSets) {
			result.add(compressorGroupService.getWaterCost(groupSet.getId()));
		}

		return result;
	}

	@RequestMapping(value = "/findAnalysisByRdcidKeysDate", method = RequestMethod.GET)
	@ResponseBody
	public Object findAnalysisByRdcidKeyDate(int rdcId, String keys,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>> result = new HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>>();

		List<CompressorGroupSetEntity> groups = compressorGroupSetDao.findByRdcId(rdcId);
		for (CompressorGroupSetEntity group : groups) {
			result.put(group.getName(), analysisService.findValueByDateKeys(StorageType.COMPRESSORGROUP.getType(),
					group.getId(), Arrays.asList(keys.split(",")), startTime, endTime));
		}

		return result;
	}

	@RequestMapping(value = "/findCompressorState", method = RequestMethod.GET)
	@ResponseBody
	public Object findCompressorState(int compressorGroupId) {

		return compressorGroupService.getCompressorsState(compressorGroupId);
	}

	/*
	 * @RequestMapping("/findCompressorByNums") public Object
	 * findCompressorByNums(int compressorID,
	 * 
	 * @RequestParam(value="nums",defaultValue="1")Integer nums){ Map<String,
	 * List<StorageKeyValue>> result = new HashMap<String,
	 * List<StorageKeyValue>>(); StorageType stype =
	 * StorageType.COMPRESSORGROUP;
	 * result.put("compressor1",storageService.findByNums(stype, compressorID,
	 * "Compressor1", nums));
	 * result.put("compressor2",storageService.findByNums(stype, compressorID,
	 * "Compressor2", nums));
	 * result.put("compressor3",storageService.findByNums(stype, compressorID,
	 * "Compressor3", nums));
	 * result.put("compressor4",storageService.findByNums(stype, compressorID,
	 * "Compressor4", nums));
	 * result.put("compressor5",storageService.findByNums(stype, compressorID,
	 * "Compressor5", nums));
	 * result.put("compressor6",storageService.findByNums(stype, compressorID,
	 * "Compressor6", nums)); return result; }
	 */
}
