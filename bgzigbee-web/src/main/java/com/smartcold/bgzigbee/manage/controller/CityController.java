package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.CityListMapper;
import com.smartcold.bgzigbee.manage.dao.ProvinceListMapper;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 16:41)
 */
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
}
