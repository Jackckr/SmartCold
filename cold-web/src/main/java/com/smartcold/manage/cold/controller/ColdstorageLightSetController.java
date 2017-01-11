package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdstorageLightSetMapping;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageLightSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@Controller
@RequestMapping(value = "/coldstorageLight")
public class ColdstorageLightSetController {

	@Autowired
	private ColdstorageLightSetMapping coldstorageLightSetDao;
	
	@Autowired
	ColdStorageSetMapper coldSttorageSetDao;
	
	@Autowired
	StorageService storageService;
	
	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {	
		return coldstorageLightSetDao.findById(id);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByRdcId(@RequestParam int rdcId) {
		return coldstorageLightSetDao.findByRdcId(rdcId);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/findLightsInfoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findLightsInfoByRdcId(@RequestParam int rdcId) {
		List allInfoList = new ArrayList();
		
		List<ColdStorageLightSetEntity> coldStorageLightSetList = coldstorageLightSetDao.findByRdcId(rdcId);
		
		for(ColdStorageLightSetEntity storageLightSet : coldStorageLightSetList){
			Map map = new HashMap();
			map.put("storageID", storageLightSet.getId());
			List<StorageKeyValue> infos = storageService.findByNums(StorageType.COLDSTORAGELIGHT.getType(), storageLightSet.getId(), "Status", 1);

			map.put("status", infos.size()>0 ? infos.get(0).getValue() : 0);
			map.put("div_x", storageLightSet.getDiv_x() == null ? "" : storageLightSet.getDiv_x());
			map.put("div_y", storageLightSet.getDiv_y() == null ? "" : storageLightSet.getDiv_y());
			map.put("rotate", storageLightSet.getRotate() == null ? "" : storageLightSet.getRotate());
			allInfoList.add(map);
		}		
		return allInfoList;	
	}
	
	// update div_x and div_y by id of light
    @RequestMapping(value = "/updateLightInfoByOid", method = RequestMethod.GET)
    @ResponseBody
    public Object updateConfigByOid( int oid, int div_x, int div_y, int rotate) {
    	ColdStorageLightSetEntity lightSetEntity = coldstorageLightSetDao.findById(oid);
    	lightSetEntity.setDiv_x(div_x);
    	lightSetEntity.setDiv_y(div_y);
    	lightSetEntity.setRotate(rotate);
    	return coldstorageLightSetDao.updateSet(lightSetEntity);
    }
}
