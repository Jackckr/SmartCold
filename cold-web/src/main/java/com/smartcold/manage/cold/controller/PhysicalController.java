package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.WeightSetMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.WeightSetEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 体检Controller
 * 
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/physicalController")
public class PhysicalController {
	@Autowired
	private StorageService storageService;
	@Autowired
	private WeightSetMapper weightSetMapper;
	@Autowired
	private ColdStorageSetMapper coldsetServer;
	/**
	 * 根据rdcid体检
	 * 1.检查冷库信息
	 * 2.检查设备信息
	 * 3.开始体检
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/checkup")
	@ResponseBody
	public ResponseData<Object> checkup(Integer rdcId) {
		if(rdcId==null){ return ResponseData.newFailure("0");}//0.非法请求
		List<ColdStorageSetEntity> coldStorageSetList = coldsetServer.findByRdcId(rdcId);
		if(SetUtil.isNullList(coldStorageSetList)){return ResponseData.newFailure("-1");}//1.检查冷库信息
		Integer oid= coldStorageSetList.get(0).getId();
		List<StorageKeyValue> dataList = this.storageService.findByTimeFormat(1, oid, "Temp", TimeUtil.getBeforeDay(4), new Date(), 4,"%Y-%m-%d"," asc ");//
		if(SetUtil.isNullList(dataList)){ return ResponseData.newFailure("-2"); }//2.檢查設備
		WeightSetEntity weightSet = weightSetMapper.getWeightSet(rdcId);
		if(weightSet==null){return ResponseData.newFailure("-3");}
		
		
		
		return null;
	}

	

}
