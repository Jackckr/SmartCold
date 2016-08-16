package com.smartcold.bgzigbee.manage.controller;

import com.smartcold.bgzigbee.manage.dao.SetTableMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by corly on 16-8-13.
 */
@Controller
@RequestMapping("/spiderConfig")
@ResponseBody
public class SpiderConfigController {

    @Autowired
    private SetTableMapper setTableMapper;

    @RequestMapping("/mapping/update")
    public Object updateSetTableMapping(String table, String mapping, int id){
        if (SetTables.checkTable(table) && setTableMapper.updateMapping(table, mapping, id)) {
            return new BaseDto(0);
        }
        return new BaseDto(-1);
    }

    @RequestMapping("/delete/id")
    public Object deleteById(String table, int id){
        if (SetTables.checkTable(table) && setTableMapper.deleteById(table, id)) {
            return new BaseDto(0);
        }
        return new BaseDto(-1);
    }

    @RequestMapping("/insert/data")
    public Object insertData(Map params){
        return params;
    }
}
