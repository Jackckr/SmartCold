package com.smartcold.bgzigbee.manage.controller;

import com.smartcold.bgzigbee.manage.dao.SetTableMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by corly on 16-8-13.
 */
@RequestMapping("/spiderConfig")
@ResponseBody
public class SpiderConfigController {

    @Autowired
    private SetTableMapper setTableMapper;

    @RequestMapping("/mapping/update")
    public Object updateSetTableMapping(String table, String mapping, int id){
        if (setTableMapper.updateMapping(table, mapping, id)) {
            return new BaseDto(0);
        }
        return new BaseDto(-1);
    }
}
