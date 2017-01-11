package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
    public Object addDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity){

        if (deviceObjectMappingMapper.insert(deviceObjectMappingEntity)) {
            return new ResultDto(deviceObjectMappingEntity.getId(), "添加成功");
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
