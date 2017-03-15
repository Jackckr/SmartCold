package com.smartcold.bgzigbee.manage.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonParseException;
import com.smartcold.bgzigbee.manage.dao.TempSetMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.ColdStorageSetEntity;
import com.smartcold.bgzigbee.manage.entity.TempSetEntity;
import com.smartcold.bgzigbee.manage.util.StringUtil;

@Controller
@RequestMapping(value = "/temp")
public class TempController {


	@Autowired
	private TempSetMapper tempMapper;

	
	@RequestMapping(value = "/updateMapping")
	@ResponseBody
	public Object updateMapping(int id, String mapping) {
		try {
			this.tempMapper.upTempMappingById(id,mapping);
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}
		return new ResultDto(0, "修改成功");
	}
	
	//过期方法--更新配置后删除--在2017-3-10后删除--在执行配置前请先备份
	@Deprecated
	@RequestMapping(value = "/checkedTempMapping")
	@ResponseBody
	public Object checkedTempMapping(Integer id) {
			HashMap<Integer, String> msg=new HashMap<Integer, String>();
			if(id==-2){
				//更新温度
				List<TempSetEntity> tempSetList = this.tempMapper.getVTempsetMapper();
				if(tempSetList!=null&&tempSetList.size()>0){
		        	for (TempSetEntity tempSetEntity : tempSetList) {
		        		String mapping = tempSetEntity.getMapping();
    					try {
							JSONObject.parseObject(	mapping);
						} catch (Exception e) {
							  msg.put(tempSetEntity.getId(), "A配置异常-"+tempSetEntity.getMapping());
						} 
					}
		        }
				List<ColdStorageSetEntity> coldMapperSetList = this.tempMapper.getValidColdMapper();
				if(coldMapperSetList!=null&&coldMapperSetList.size()>0){
					for (ColdStorageSetEntity obj : coldMapperSetList) {
						String mapping = obj.getMapping();
						try {
							JSONObject.parseObject(	mapping);
						} catch (Exception e) {
							msg.put(obj.getId(), "B配置异常-"+obj.getMapping());
						} 
					}
				}
			}
			return msg;
	}
	
	//过期方法--更新配置后删除--在2017-3-10后删除
	@Deprecated
	@RequestMapping(value = "/upStorgMapping")
	@ResponseBody
	public Object upStorgMapping(Integer id) {
		try {
			List<Integer> objid=new ArrayList<Integer>();
			if(id==-2){
				this.tempMapper.getValidColdMapper();
				
				
				
			}
			
			return objid;
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}
	}
	
	
	public static void main(String[] args) {
		HashMap<Integer, String> msg=new HashMap<Integer, String>();
		List<TempSetEntity> tempSetList = new ArrayList<TempSetEntity>();
		TempSetEntity obj=null;
		obj=new TempSetEntity();obj.setId(1);obj.setMapping("{\"Temp\":\"机组2_冷库2温度\",\"startTemperature\":\"机组2_冷库2设定温度\",\"tempdiff\":\"机组2_冷库2设定温差\"}");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(2);obj.setMapping("{\"Temp\":\"机组2_冷库2温度\"}");;                                                                            tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(3);obj.setMapping("{\"startTemperature\":\"机组2_冷库2设定温度\",\"Temp\":\"机组2_冷库2温度\"}");;                                     tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(4);obj.setMapping("{\"startTemperature\":\"机组2_冷库2设定温度\",\"Temp\":\"机组2_冷库2温度\",\"tempdiff\":\"机组2_冷库2设定温差\"}");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(4);obj.setMapping("{\"startTemperature\":\"机组2_冷库2设定温度\",\"tempdiff\":\"机组2_冷库2设定温差\",\"Temp\":\"机组2_冷库2温度\"}");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(5);obj.setMapping("{}");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(6);obj.setMapping("");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(7);obj.setMapping("{\"startTemperature\":\"机组2_冷库2设定温度\",\"Temp\":\"机组2_冷库2温度\"}");       tempSetList.add(obj);
		obj=new TempSetEntity();obj.setId(8);obj.setMapping("{\"tempdiff\":\"机组2_冷库2设定温差\",\"startTemperature\":\"机组2_冷库2设定温度\"}");       tempSetList.add(obj);
        if(tempSetList!=null&&tempSetList.size()>0){
        	for (TempSetEntity tempSetEntity : tempSetList) {
        		String mapping = tempSetEntity.getMapping();
        		if(StringUtil.isnotNull(mapping)){
        			try {
						JSONObject.parseObject(	mapping);//检查配置是否合法
					   	int index=	tempSetEntity.getMapping().indexOf("\"Temp\"");
	                	int index1=	tempSetEntity.getMapping().indexOf(",");
	                	if(index!=-1){
	                		String mapper="{}";
	                	    if(index1==-1){ msg.put(tempSetEntity.getId(), "更改配置为：{}");continue; }	
	                	    System.err.println(tempSetEntity.getId()+"=========================================");
	                		System.err.println(tempSetEntity.getMapping());
	                		String tempmap=tempSetEntity.getMapping().substring(index);
	                		int a=tempmap.indexOf(",");
	        				int b=tempmap.indexOf("}");
	        				if(a!=-1){
	        					mapper=	mapping.substring(0, index)+mapping.substring(index+a+1, mapping.length());
	        					System.err.println(mapper);
	        				}else if(b!=-1){
	        					mapper=	mapping.substring(0, index)+mapping.substring(index+b, mapping.length()-2)+"}";
	        					System.err.println(mapper);
	        				}else{
	        					  msg.put(tempSetEntity.getId(), "[配置异常-"+tempSetEntity.getMapping()+"]");
	        				}
	                	}else{
	                		
	            	   }
					} catch (Exception e) {
						  msg.put(tempSetEntity.getId(), "[配置异常-"+tempSetEntity.getMapping()+"]");
					} 
        			
        		}else{
        			
        		}
        	
			}
        	System.err.println(msg);
        }
	}
	
}
