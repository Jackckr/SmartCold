package com.smartcold.zigbee.manage.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.service.CommonService;
import com.smartcold.zigbee.manage.util.CacheTool;
import com.smartcold.zigbee.manage.util.ResponseData;

@Controller
@RequestMapping(value = "/ShareRdcController")
public class ShareRdcController  {

	@Resource(name="commonService")
	private CommonService commonService;

	
	/**
	 * 查询下拉框数据  Description: ui_getSeleectData
	 * Description: ui_getSeleectData
	 * @author MaQiang
	 * @date 2016年4月25日下午3:32:25
	 * @param tb：对应数据库表明
	 * @param cl：对应数据库列名
	 * @param vl：保存数据库值
	 * @param txt：下拉框显示值
	 * @param cs  对应实体类 ：默认- com.farmen.core.entities.CommMataData
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/ui_getSeleectData")
	@ResponseBody
	public ResponseData<Map<String, Object>> ui_getSeleectData(String data,String value,String text,String cs,String parentCode,String filter) {
		    String key= data+"_"+ value+"_"+ text+"_"+ cs+"_"+ parentCode+"_"+filter;
			if(CacheTool.hasCache(key)){
				 List<Map<String, Object>> objdata = (List<Map<String, Object>>) CacheTool.getdate(key);
				return ResponseData.newSuccess(objdata);
			}else{
				if(data==null||"".equals(data)){
					return ResponseData.newFailure("请设置完整信息");
				}else{
					 try {
						 List<Map<String, Object>> objdata = this.commonService.getBaseData(data+filter, value, text);
						 CacheTool.setData(key, objdata);
						 return ResponseData.newSuccess(objdata);
					} catch (Exception e) {
							e.printStackTrace();
							return ResponseData.newFailure("网络异常！稍后重试！");
					}
				}
			}
	}
	
	/**
	 * 获得睿库共享过滤信息
	 * 
	 * @return
	 */
	 @SuppressWarnings("unchecked")
	@RequestMapping(value = "/getSEFilterData")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getSEFilterData(HttpServletRequest request) {
		String key="getSEFilterData";
		HashMap<String, Object> data = new HashMap<String, Object>();
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
		if(CacheTool.hasCache(key)){
			data= (HashMap<String, Object>) CacheTool.getdate(key);
		    result.setEntity(data);
		}else{
			data.put("mt", this.commonService.getBaseData("storagemanagetype", "id", "type"));// 经营类型
			data.put("st", this.commonService.getBaseData("storagetempertype", "id", "type"));// 温度类型
			result.setEntity(data);
			CacheTool.setData(key, data);
		}
		return result;
	}
	
	/**
	 * 获得睿库列表
	 * @param request
	 * @param keyword 支持关键字搜索-> rcd r
	 * @param provinceid 区域 -> rcd r
	 * @param type->  null：不限  1：出租2：求租
	 * @param sqm 面积-> rcd r
	 * @param managetype 经营类型  -> rdcext t
	 * @param storagetype 存放类型 -> rdcext t
	 * @param storagetempertype 温度类型 -> rdcext t
	 * @param storagetruck 有无车辆  -> rdcext t
	 * @param orderBy 排序
	 * @return
	 */
	@RequestMapping(value = "/getSERDCList")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getSERDCList(HttpServletRequest request, String keyword,String provinceid, String type,String managetype,String storagetype,String storagetempertype,String sqm,String storagetruck,String orderBy) {
		ResponseData<HashMap<String, Object>> result = ResponseData.getInstance();
		
		return result;
	}
	
	
	

}
