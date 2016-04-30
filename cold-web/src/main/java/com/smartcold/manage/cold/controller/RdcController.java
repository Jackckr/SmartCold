package com.smartcold.manage.cold.controller;


import com.smartcold.manage.cold.dao.RdcMapper;
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
}
