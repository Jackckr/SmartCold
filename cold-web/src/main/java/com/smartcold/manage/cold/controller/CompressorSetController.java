package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.CompressorSetMapping;

@Controller
@RequestMapping(value = "/compressor")
public class CompressorSetController {

	@Autowired
	private CompressorSetMapping compressorSetDao;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return compressorSetDao.findCompressorByid(id);
	}

	@RequestMapping(value = "/findBygroupId", method = RequestMethod.GET)
	@ResponseBody
	public Object findBygroupId(@RequestParam int groupId) {
		return compressorSetDao.findCompressorByGroupid(groupId);
	}
}
