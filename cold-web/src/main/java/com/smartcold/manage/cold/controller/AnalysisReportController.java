package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jsqlparser.expression.operators.relational.ItemsList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.smartcold.manage.cold.dao.olddb.CongfigMapper;
import com.smartcold.manage.cold.dao.olddb.UtilMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 360新分析报表
 * 
 * @author MaQiang
 * 
 */
@Controller
@RequestMapping(value = "/AnalysisReportController")
public class AnalysisReportController {
	@Autowired
	private UtilMapper util;
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
	
	private final static DecimalFormat dfformat = new DecimalFormat("######0.00");

	private static HashMap<Integer, Object[]> objMap=new HashMap<Integer, Object[]>();

	/**
	 * 报表分析 支持多key
	 * 
	 * @param type
	 *            :数据类型->StorageType->type: 1,10,3,2,1,4,-1,1,5
	 * @param keytype
	 *            : ->0 单key 1 :多key
	 * @param rdcIds
	 *            :
	 * @param rdcNames
	 *            :
	 * @param unit
	 *            :
	 * @param key
	 *            :采集数据
	 * @param isexpt
	 *            :导出
	 * @param startTime
	 *            :开始时间
	 * @param endTime
	 *            :结束数据
	 * @return index:$scope.slindex,urlid
	 */
	@RequestMapping(value = "/getSisDataByRdc")
	@ResponseBody
	public ResponseData<Object> getCasesTotalSISAnalysis(HttpServletRequest request, HttpServletResponse response,Integer type, Integer keytype, String key, Integer[] rdcIds,String[] rdcNames, Integer[] unit, Boolean isexpt,String startTime, String endTime) {
		try {
			if (type == null || keytype == null || rdcIds == null|| rdcNames == null || StringUtil.isNull(key)) {return ResponseData.newFailure("非法请求！");}
			boolean isunit = false;
			String[] keys = {}, keyts = {}, titls = {};
			HashMap<String, Integer> keymap = new HashMap<String, Integer>();
			if (keytype == 1) {
				keys = StringUtil.splitString(key);
				if (keys.length != 2) {
					return ResponseData.newFailure("非法请求！key参数不完整");
				}
				keyts = StringUtil.splitfhString(keys[0]);// 主key
				titls = StringUtil.splitfhString(keys[1]);// key标题
				if (keyts.length != titls.length) {
					return ResponseData.newFailure("非法请求！key参数不完整");
				}
				for (int i = 0; i < keyts.length; i++) {
					keymap.put(keyts[i].replace("'", ""), i);
				}
				if (unit != null && unit.length == keyts.length) {
					isunit = true;
				}// 判断是否进行单位转换
			}
			List<Object> sisDataList=new ArrayList<Object>();
			for (int i = 0; i < rdcIds.length; i++) {//RDC
				LinkedHashMap<Object, Object> rdcobj =new LinkedHashMap<Object, Object>();
				List<ItemValue> itemList = util.findObjByRdcId(SetTables.getByType(type).getTable(), rdcIds[i]);
				if (SetUtil.isnotNullList(itemList)) {
					LinkedHashMap< Object, Object> alllsisMap =new LinkedHashMap<Object, Object>();
					for (ItemValue itemValue : itemList) {//子对象-->冷库
						LinkedHashMap< Object, Object> subsisMap =new LinkedHashMap<Object, Object>();
						Object sisdata = getRdcData(type,keytype, itemValue.getId(), keys[0],keymap, isunit, unit, startTime, endTime);
						subsisMap.put("obj", itemValue);
						subsisMap.put("data", sisdata);
						alllsisMap.put(itemValue.getId(), subsisMap);
					}
					rdcobj.put("id",  rdcIds[i]);
					rdcobj.put("name",  rdcNames[i]);
					rdcobj.put("data", alllsisMap);
				}else {
					rdcobj.put("id",  rdcIds[i]);
					rdcobj.put("name",  rdcNames[i]);
					rdcobj.put("data", null);
				}
				sisDataList.add(rdcobj);
			}
			return ResponseData.newSuccess(sisDataList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("分析异常！");
		}
	}

	/**
	 * 考虑使用多线程
	 * 
	 * @return
	 */
	private Object getRdcData(Integer type,Integer keytype, int oid,String keys,HashMap<String, Integer> keymap , boolean isunit ,Integer[] unit,String startTime, String endTime) {
		HashMap<String, Object> fileter = new HashMap<String, Object>();
		fileter.put("type", type);
		fileter.put("oid", oid);
		fileter.put("key",  keys );
		fileter.put("desc", null);
		fileter.put("startTime", startTime);
		fileter.put("endTime", endTime);
		List<ColdStorageAnalysisEntity> datalist = this.coldStorageAnalysisService.findValueByFilter(fileter);
		LinkedHashMap<String, Object[]> tempData = new LinkedHashMap<String, Object[]>();
		if (SetUtil.isnotNullList(datalist)) {
			Object[] objects = null;
			for (ColdStorageAnalysisEntity coldsis : datalist) {// 2
				String data = TimeUtil.getFormatDate(coldsis.getDate());
				int keyindex = keymap.get(coldsis.getKey());
				if (tempData.containsKey(data)) {
					objects = tempData.get(data);
				} else {
					objects = getObj(keymap.size());
				}
				double value = coldsis.getValue();
				if (isunit) {
					value = Double.parseDouble(dfformat.format(value / unit[keyindex]));
				} // 单位转换
				objects[keyindex] = value;
				tempData.put(data, objects);
			}
			return tempData;
		}
        return null;
	}

	
	private Object[]  getObj(int seize){
		if(objMap.containsKey(seize)){return objMap.get(seize).clone();}
		Object[] objects =new Object[seize];
		for (int i = 0; i < seize; i++) {
			objects[i]=0;
		}
		objMap.put(seize, objects.clone());
		return objects;
	}
}
