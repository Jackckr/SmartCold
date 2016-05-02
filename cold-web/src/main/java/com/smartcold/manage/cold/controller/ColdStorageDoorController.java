package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.service.ColdStorageDoorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 09:57)
 */
@Controller
@RequestMapping(value = "/coldStorageDoor")
public class ColdStorageDoorController {

    @Autowired
    private ColdStorageDoorService coldStorageDoorService;

    @RequestMapping(value = "/findByStorageId", method = RequestMethod.GET)
    @ResponseBody
    public Object findByStorageId(@RequestParam int storageID, @RequestParam int npoint) {
        return coldStorageDoorService.findByStorageId(storageID, npoint);
    }
}
