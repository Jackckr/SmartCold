package com.smartcold.zigbee.manage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.CityListMapper;
import com.smartcold.zigbee.manage.dao.ProvinceListMapper;
import com.smartcold.zigbee.manage.entity.CityListEntity;

@Controller
@RequestMapping(value = "/city")
public class CityController {

    @Autowired
    private ProvinceListMapper provinceListMapper;

    @Autowired
    private CityListMapper cityListDao;

    
    @RequestMapping(value = "/findProvinceList", method = RequestMethod.GET)
    @ResponseBody
    public Object findProvinceList() {
        return provinceListMapper.findProvinceList();
    }
    
    @RequestMapping(value = "/findCitysByProvinceId", method = RequestMethod.GET)
    @ResponseBody
    public Object findCitysByProvinceId(@RequestParam int provinceID) {
        return cityListDao.findCitysByProvinceId(provinceID);
    }

    @RequestMapping(value = "/findCityById", method = RequestMethod.GET)
    @ResponseBody
    public Object findCityById(@RequestParam int CityID) {
        return cityListDao.findCityById(CityID);
    }

    @RequestMapping(value = "/findProvinceById", method = RequestMethod.GET)
    @ResponseBody
    public Object findProvinceById(@RequestParam int provinceId) {
        return cityListDao.findProvinceById(provinceId);
    }

    @RequestMapping(value = "/findCityByName", method = RequestMethod.GET)
    @ResponseBody
    public Object findCityByName(@RequestParam String CityName) {
    	String cityName = CityName.substring(0, 2);
    	List<CityListEntity> cList =  cityListDao.findCityByName(cityName);
    	if (cList!=null&&!cList.isEmpty()) {
    		return cList.get(0);
		}
        return null;
    }
}
