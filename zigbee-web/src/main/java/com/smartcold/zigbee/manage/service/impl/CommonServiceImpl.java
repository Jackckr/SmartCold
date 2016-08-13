package com.smartcold.zigbee.manage.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.zigbee.manage.dao.CommonMapper;
import com.smartcold.zigbee.manage.service.CommonService;
/**
 * 
 * @author MaQiang
 *
 */
@Service("commonService")
public class CommonServiceImpl implements CommonService {

	@Autowired
	private CommonMapper commonMapper;
	
	@Override
	public List<Map<String, Object>> getCommData(String codetype) {
		return this.commonMapper.getCommData(codetype);
	}
	@Override
	public List<Map<String, Object>> getCommDataByID(Integer type_code,String codetype) {
		return this.commonMapper.getCommDataByID(type_code, codetype);
	}
	
	@Override
	public List<Map<String, Object>> getBaseData(String table, String code,String value) {
		return this.commonMapper.getBaseData(table, code, value);
	}
	@Override
	public List<Map<String, Object>> getBaseData(String table, String code,String value, Integer id) {
		return this.commonMapper.getBaseDataByID(table, code, value, id);
	}



	

}
