package com.smartcold.bgzigbee.manage.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonParseException;
import com.smartcold.bgzigbee.manage.dao.TempSetMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;

@Controller
@RequestMapping(value = "/temp")
public class TempController {


	@Autowired
	private TempSetMapper tempMapper;

	
	@RequestMapping(value = "/updateMapping")
	@ResponseBody
	public Object updateMapping(int id, String mapping) {
		try {
			this.tempMapper.upTempMappingById(id,mapping);
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}
		return new ResultDto(0, "修改成功");
	}
	
}
