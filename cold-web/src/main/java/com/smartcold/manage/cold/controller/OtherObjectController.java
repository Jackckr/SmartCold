package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.GoodsColdStorageMapper;

@Controller
@RequestMapping("/other")
public class OtherObjectController {

	@Autowired
	GoodsColdStorageMapper goodsColdStorageDao;

	@RequestMapping(value = "/findGoodsByDate", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllStorageKeys(int coldstorageId,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startCollectionTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endCollectionTime) {

		return goodsColdStorageDao.findByDate(coldstorageId, startCollectionTime, endCollectionTime);
	}
}
