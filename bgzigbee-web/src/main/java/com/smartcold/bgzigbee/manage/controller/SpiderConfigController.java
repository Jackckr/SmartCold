package com.smartcold.bgzigbee.manage.controller;

import com.smartcold.bgzigbee.manage.dao.*;
import com.smartcold.bgzigbee.manage.dto.RdcIdAndNameDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.dto.UpdateMappingDTO;
import com.smartcold.bgzigbee.manage.entity.*;
import com.smartcold.bgzigbee.manage.enums.SetTables;
import com.smartcold.bgzigbee.manage.service.RemoteService;
import com.smartcold.bgzigbee.manage.service.SpiderConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by corly on 16-8-13.
 */
@Controller
@RequestMapping("/spiderConfig")
@ResponseBody
public class SpiderConfigController {

    @Autowired
    private SetTableMapper setTableMapper;

    @Autowired
    private SpiderConfigService spiderConfigService;

    @Autowired
    private WindScreenSetMapping windScreenSetMapping;

    @Autowired
    private EvaporativeSetMapping evaporativeSetMapping;

    @Autowired
    private EvaporativeWaterSetMapping evaporativeWaterSetMapping;

    @Autowired
    private EvaporativeBlowerSetMapping evaporativeBlowerSetMapping;

    @Autowired
    private PlatformDoorSetMapping platformDoorSetMapping;

    @Autowired
    private ColdstorageLightSetMapping coldstorageLightSetMapping;

    @Autowired
    private ForkLiftSetMapping forkLiftSetMapping;

    @Autowired
    private RemoteService remoteService;

    @RequestMapping("/update/mapping")
    public Object updateSetTableMapping(@RequestBody UpdateMappingDTO updateMappingDTO){
        if (SetTables.checkTable(updateMappingDTO.getTable()) && setTableMapper.updateMapping(updateMappingDTO.getTable(), updateMappingDTO.getMapping(), updateMappingDTO.getId())) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/delete/id", method = RequestMethod.DELETE)
    public Object deleteById(String table, int id){
        if (!(table.equals("deviceobjectmapping") || SetTables.checkTable(table) )){
            return new ResultDto(-2, "非法参数");
        }
        if (setTableMapper.deleteById(table, id)) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1,"删除失败");
    }

    @RequestMapping("/find/windscreenSet")
    public Object findSetTableConfigByType(int storageId){
        return windScreenSetMapping.findByStorageId(storageId);
    }

    @RequestMapping("/find/evaporativeSet")
    public Object findEvaporativeSet(int rdcId){
        return evaporativeSetMapping.findByRdcId(rdcId);
    }

    @RequestMapping("/find/evaporativeWaterSet")
    public Object findEvaporativeWaterSet(int evaporativeid){
        return evaporativeWaterSetMapping.findByEvaporativeId(evaporativeid);
    }

    @RequestMapping("/find/evaporativeBlowerSet")
    public Object findEvaporativeBloeSet(int evaporativeid){
        return evaporativeBlowerSetMapping.findByEvaporativeId(evaporativeid);
    }

    @RequestMapping("/findByRdcid")
    public Object findByRdcid(String table, int rdcid){
        if (SetTables.checkTable(table)) {
            return setTableMapper.findByRdcId(table, rdcid);
        }
        return new ResultDto(-1, "error");
    }



    @RequestMapping(value = "/del/deviceObjectMapping" , method = RequestMethod.DELETE)
    public Object delDeviceObjectMapping(int id){
        return remoteService.delDeviceObjectMappingById(id);
    }

    /**
     * 公用的添加方法，只添加rdcid 和 name
     * @return
     */
    @RequestMapping(value = "/add/rdcidAndName", method = RequestMethod.POST)
    public Object addRdcidAndName(@RequestBody RdcIdAndNameDTO rdcIdAndNameDTO){
        if (SetTables.checkTable(rdcIdAndNameDTO.getTable()) && setTableMapper.insert(rdcIdAndNameDTO)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/windscreenset", method = RequestMethod.POST)
    public Object addWindScreenSet(@RequestBody WindScreenSetEntity windScreenSetEntity){
        if (windScreenSetMapping.insert(windScreenSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/evaporativeSet", method = RequestMethod.POST)
    public Object addEvaporativeSet(@RequestBody EvaporativeSetEntity evaporativeSetEntity){
        if (evaporativeSetMapping.insert(evaporativeSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/evaporativeWaterSet", method = RequestMethod.POST)
    public Object addEvaporativeWaterSet(@RequestBody EvaporativeWaterSetEntity evaporativeWaterSetEntity){
        if (evaporativeWaterSetMapping.insert(evaporativeWaterSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/evaporativeBlowerSet", method = RequestMethod.POST)
    public Object addEvaporativeBlowerSet(@RequestBody EvaporativeBlowerSetEntity evaporativeBlowerSetEntity){
        if (evaporativeBlowerSetMapping.insert(evaporativeBlowerSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/platformDoorSet", method = RequestMethod.POST)
    public Object addPlatformDoorSet(@RequestBody PlatformDoorSetEntity platformDoorSetEntity){
        if (platformDoorSetMapping.insert(platformDoorSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/coldStorageLightSet", method = RequestMethod.POST)
    public Object addColdStorageLightSet(@RequestBody ColdStorageLightSetEntity coldStorageLightSetEntity){
        if (coldstorageLightSetMapping.insert(coldStorageLightSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/forkliftSet", method = RequestMethod.POST)
    public Object addForklift(@RequestBody ForkLiftSetEntity forkLiftSetEntity){
        if (forkLiftSetMapping.insert(forkLiftSetEntity)) {
            return new ResultDto(0, "添加成功");
        }
        return new ResultDto(-1, "添加失败");
    }

    @RequestMapping(value = "/add/deviceObjectMapping", method = RequestMethod.POST)
    public Object addDeviceObjectMapping(@RequestBody DeviceObjectMappingEntity deviceObjectMappingEntity){
        Object res = remoteService.insertDeviceObjectMapping(deviceObjectMappingEntity);
        return res;

    }
}
