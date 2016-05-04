package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.RdcPowerConsumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-04 11:50)
 */
@Controller
@RequestMapping(value = "/rdcPower")
public class RdcPowerController {

    @Autowired
    private RdcPowerConsumeMapper rdcPowerConsumeDao;

    @RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
    @ResponseBody
    public Object findByRdcId(@RequestParam int rdcID, @RequestParam int npoint) {
        return rdcPowerConsumeDao.findLastNPoint(rdcID, npoint);
    }

}
