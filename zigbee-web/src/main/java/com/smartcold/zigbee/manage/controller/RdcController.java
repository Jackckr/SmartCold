package com.smartcold.zigbee.manage.controller;

import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.service.RdcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {

    @Autowired
    private RdcMapper rdcMapper;

    @Autowired
    private RdcService rdcService;

    @RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
    @ResponseBody
    public Object findRdcList() {
        return rdcMapper.findRdcList();
    }

    @RequestMapping(value = "/findRDCByRDCId", method = RequestMethod.GET)
    @ResponseBody
    public Object findRDCByRDCId(@RequestParam int rdcID) {
        return rdcMapper.findRDCByRDCId(rdcID);
    }

    @RequestMapping(value = "/findAllRdcDtos", method = RequestMethod.GET)
    @ResponseBody
    public Object findAllRdcDtos() {
        return rdcService.findAllRdcDtos();
    }
}
