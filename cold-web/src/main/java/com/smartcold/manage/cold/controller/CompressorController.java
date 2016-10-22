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

import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorSetMapping;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.service.StorageService;

/**
 * Created by corly on 16-8-13.
 */
@Controller
@RequestMapping("/compressor")
@ResponseBody
public class CompressorController {

	@Autowired
	private CompressorSetMapping compressorSetMapping;
	@Autowired
	private StorageService storageService;

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private ColdStorageAnalysisService analysisService;

	@RequestMapping("/findLoad")
	public Object findLoad(int groupId, @RequestParam(value = "nums", defaultValue = "1") Integer nums) {
		List<CompressorSetEntity> compressorSetEntities = compressorSetMapping.findCompressorByGroupid(groupId);
		Map<String, List<StorageKeyValue>> result = new HashMap<String, List<StorageKeyValue>>();
		StorageType stype = StorageType.COMPRESSOR;
		for (int i = 0; i < compressorSetEntities.size(); i++) {
			result.put("compressor" + (i + 1),
					storageService.findByNums(stype, compressorSetEntities.get(i).getId(), "Load", nums));

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
			List<CompressorSetEntity> compressors = compressorSetMapping.findCompressorByGroupid(group.getId());
			for (CompressorSetEntity compressor : compressors) {
				result.put(group.getName() + ":"+compressor.getName(), analysisService.findValueByDateKeys(StorageType.COMPRESSOR.getType(),
						group.getId(), Arrays.asList(keys.split(",")), startTime, endTime));
			}
		}

		return result;
	}
}
