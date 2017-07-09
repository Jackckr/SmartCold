package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.TempSetMapper;
import com.smartcold.manage.cold.dto.NewStorageTempDto;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MultiValueService;
import com.smartcold.manage.cold.util.StringUtil;

@Controller
@ResponseBody
@RequestMapping("/temp")
public class TempController {
	
	@Autowired
	private TempSetMapper tempSetMapper;
	@Autowired
    private MultiValueService multiValueService; 
	@Autowired
	private ColdStorageSetMapper coldSttorageSetDao; 
	
	
	@RequestMapping("/getTempsetByRdcId")
	public Object getTempsetByRdcId(int rdcId) {
		return this.tempSetMapper.getTempsetByRdcId(rdcId);
	}
	
	@RequestMapping("/getTempsetByStorageID")
	public Object getTempsetByStorageID(int oid) {
		return this.tempSetMapper.getTempsetBycoldstorageid(oid);
	}
	
	
	@RequestMapping("/ios_getTempByTime")
	public Object ios_getTempByTime(int oid, String oids,String names, String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		return this.getTempByTime(1,oid,StringUtil.getIdS(oids) , StringUtil.splitfhString(names), key, startTime, endTime);
	}
	
	@RequestMapping("/getTempref")
	public Object getRefTemp(int oid, int [] oids,String []names, String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		if(oid==0||StringUtil.isNull(key)||oids==null || names==null||names.length!=oids.length){return null;};
		Map<String, List<StorageKeyValue>> tempMap =this.multiValueService.findMultiValueByTime(StorageType.TEMPE.getType(), key,oids,names, startTime,endTime);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setTempMap(tempMap);
		storageTempDto.setSystime(new Date().getTime());
		return storageTempDto;
	}
	
	@RequestMapping("/getTempByTime")
	public Object getTempByTime(Integer index ,int oid, int [] oids,String []names, String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		if(oid==0||StringUtil.isNull(key)||oids==null || names==null||names.length!=oids.length){return null;};
		Map<String, List<StorageKeyValue>> tempMap =this.multiValueService.findMultiValueByTime(StorageType.TEMPE.getType(), key,oids,names, startTime,endTime);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setTempMap(tempMap);
		storageTempDto.setIndex(index);
		ColdStorageSetEntity coldStorageSetEntity =this.coldSttorageSetDao.findLastNPoint(oid, 1).get(0);
		storageTempDto.setStartTemperature(coldStorageSetEntity.getStartTemperature());
		storageTempDto.setTempdiff(coldStorageSetEntity.getTempdiff());
		storageTempDto.setName(coldStorageSetEntity.getName());
		storageTempDto.setSystime(new Date().getTime());
		return storageTempDto;
	}

	
}
