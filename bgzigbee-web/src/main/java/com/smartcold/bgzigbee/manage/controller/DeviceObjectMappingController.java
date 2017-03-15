package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.sc360.dao.DeviceObjectMappingMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;

/**
 * Created by corly on 16-8-22.
 */
@RequestMapping("/deviceObjectMapping")
@ResponseBody
@Controller
public class DeviceObjectMappingController {
    @Autowired
    private DeviceObjectMappingMapper deviceObjectMappingMapper;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Object addDeviceObjectMapping(@RequestBody DeviceObjectMappingEntity obj){
        if (deviceObjectMappingMapper.insert(obj)) {
            return new ResultDto(obj.getId(), "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping("/findByTypeOid")
    public Object findByTypeOid(int type, int oid){
        return deviceObjectMappingMapper.findByTypeOid(type, oid);
    }

    @RequestMapping(value = "/del" , method = RequestMethod.POST)
    public Object delById(int id){
        if (deviceObjectMappingMapper.delById(id)) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1, "删除失败");
    }
}
