package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.ColdStorageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Description: ColdStorageController
 * Author: qiunian.sun
 * Update: qiunian.sun(2016-03-15 23:38)
 */
@Controller
@RequestMapping(value = "/coldStorage")
public class ColdStorageController {

    @Autowired
    private ColdStorageMapper coldStorageDao;

    @RequestMapping(value = "/findColdStorageById", method = RequestMethod.GET)
    @ResponseBody
    public Object findColdStorageById(@RequestParam int storageID, @RequestParam int npoint) {
        return coldStorageDao.findLastNPoint(storageID, npoint);
    }
}
