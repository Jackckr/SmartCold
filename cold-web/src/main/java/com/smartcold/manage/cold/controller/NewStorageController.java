package com.smartcold.manage.cold.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import com.smartcold.manage.cold.dto.NewStorageTempDto;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@Controller
@ResponseBody
@RequestMapping("/newStorage")
public class NewStorageController {
	
	@Autowired
	StorageService storageService;
	
	@Autowired
	ColdStorageSetMapper coldSttorageSetDao;
	
	@RequestMapping("/getTempByNums")
	public Object getTempByNums(Integer oid,
			@RequestParam(value="nums",defaultValue="480")Integer nums){
		List<StorageKeyValue> list = storageService.findByNums(StorageType.STORAGE, oid, "STORAGE_TEMP", nums);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setList(list);
		storageTempDto.setStartTemperature(coldSttorageSetDao.findLastNPoint(oid, 1).get(0).getStartTemperature());
		return storageTempDto;
	}
	
	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	public Object findByUserId(@RequestParam int userId) {
		return storageService.findByUserId(userId);
	}
}
