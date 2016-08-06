package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;


/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 14:15)
 */
@Controller
@RequestMapping(value = "/rdcuser")
public class RdcUserController {
    @Autowired
    private RdcUserMapper rdcUserDao;


}
