package com.smartcold.bgzigbee.manage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.sc360.dao.DeviceObjectMappingMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;
import com.smartcold.bgzigbee.manage.util.SetUtil;
import com.smartcold.bgzigbee.manage.util.StringUtil;

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

    @RequestMapping(value = "/del" , method = RequestMethod.DELETE)
    public Object delById(int id){
        if (deviceObjectMappingMapper.delById(id)) {
            return new ResultDto(0, "删除成功");
        }
        return new ResultDto(-1, "删除失败");
    }
    
    /**
     * 更换dev
     * 1.更新dev编号
     * 2.更新映射dev
     * 3.添加日志记录
     * @param type
     * @param oid
     * @return
     */
    @RequestMapping("/replacedev")
    public Object replacedev(String token,String olddevno,String newdevno){
	      try {
			if(StringUtil.verifyToken(token)&&StringUtil.isnotNull(olddevno)&&StringUtil.isnotNull(newdevno)){
				
				 return new ResultDto(0, "更换设备成功！");
			  }
			  return new ResultDto(-1, "参数错误");
		} catch (Exception e) {
			  e.printStackTrace();
			  return new ResultDto(-1, "更换设备设备！原因："+e.getMessage());
		}
    	
    } 
    
    /**
     * 根据rdcId查找设备
     * @param token
     * @param rdcId
     * @return
     */
    @RequestMapping("/getDevStatusByRdcId")
    public Object replacedev(String token,Integer rdcId){
		  if(StringUtil.verifyToken(token)){
			List<DeviceObjectMappingEntity> devList = this.deviceObjectMappingMapper.findInfoByfilter(null,null,null,rdcId);
			if(SetUtil.isnotNullList(devList)){
				for (DeviceObjectMappingEntity dev : devList) {
					dev.setDu( this.deviceObjectMappingMapper.getDevstatusByKey(dev.getDeviceid(), "DU"));
					dev.setBsi( this.deviceObjectMappingMapper.getDevstatusByKey(dev.getDeviceid(), "BSI"));
					
					
					
				}
				
				
				
			}
			  
		  }
          return null;
    	
    } 
    
    
}
