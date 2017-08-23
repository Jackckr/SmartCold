package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.UtilMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
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
	private QuantityMapper quantityMapper;
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
	
	private final static DecimalFormat dfformat = new DecimalFormat("######0.00");

	private static HashMap<Integer, Object[]> objMap=new HashMap<Integer, Object[]>();

	
	/**
	 * 导出请求。。。
	 * 
	 * @param request
	 * @param response
	 * @param fileName
	 * @param title
	 * @param sid
	 * @param index
	 * @param type
	 */
	@RequestMapping(value = "/expSISAnalysisData")
	@ResponseBody
	public void expSISAnalysisData(HttpServletRequest request, HttpServletResponse response, String fileName, Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, Boolean isexpt,String startTime, String endTime ) {
		try {
			Object[] data = getData(index, type, keytype, title, key, rdcIds, rdcNames, unit,  startTime, endTime);
			if((boolean) data[0]){
				
			}else{
//				return ResponseData.newFailure((String)data[1]);
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
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
	public ResponseData<Object> getCasesTotalSISAnalysis(HttpServletRequest request, HttpServletResponse response,Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, String startTime, String endTime) {
			Object[] data = getData(index, type, keytype, title, key, rdcIds, rdcNames, unit,  startTime, endTime);
			if((boolean) data[0]){
				return ResponseData.newSuccess(data[1]);
			}else{
				return ResponseData.newFailure((String)data[1]);
			}
	}
	
	private Object[] getData(Integer index,int type, int keytype,String title, String key, int[] rdcIds,String[] rdcNames, Integer[] unit, String startTime, String endTime) {
		try {
			List<LinkedHashMap<String, Object>> sisDataList=new ArrayList<LinkedHashMap<String, Object>>();
			if (rdcIds == null|| rdcNames == null || StringUtil.isNull(key)) {	return new Object[]{false,"非法请求"};}
			boolean isunit = false;
			String[] keys = {}, keyts = {}, titls = {};
			HashMap<String, Integer> keymap = new HashMap<String, Integer>();
			if (keytype == 1) {//
				keys = StringUtil.splitString(key);
				if (keys.length != 2) {
					return new Object[]{false,"非法请求！key参数不完整"};
				}
				keyts = StringUtil.splitfhString(keys[0]);// 主key
				titls = StringUtil.splitfhString(keys[1]);// key标题
				if (keyts.length != titls.length) {
					return new Object[]{false,"非法请求！key参数不完整"};
				}
				for (int i = 0; i < keyts.length; i++) {
					keymap.put(keyts[i].replace("'", ""), i);
				}
				if (unit != null && unit.length == keyts.length) {
					isunit = true;
				}// 判断是否进行单位转换
			}else{
				keys=new String[]{key};
				keymap.put(key.replace("'", ""), 0);
			}
			for (int i = 0; i < rdcIds.length; i++) {//RDC
				if(index==6){//处理系统效率
					sisDataList.add(this.getQEAnalysis(rdcIds[i],rdcNames[i], title, startTime, endTime));
				}else{
					sisDataList.add(this.getsisData(type, rdcIds[i], rdcNames[i], title, keytype, keys[0], keymap, isunit, unit, startTime, endTime));
				}
			}
			return new Object[]{true,sisDataList};
		} catch (Exception e) {
			e.printStackTrace();
		}
		 return new Object[]{false,"配置异常！"};
	}
	
	
	private LinkedHashMap<String, Object> getsisData(int type, int rdcid,String rdcname,String title,int keytype,String keys,HashMap<String, Integer> keymap,boolean isunit,Integer[] unit,String startTime, String endTime){
		LinkedHashMap<String, Object> rdcobj =new LinkedHashMap<String, Object>();
		rdcobj.put("id",  rdcid);
		rdcobj.put("name", rdcname);
		List<ItemValue> itemList = getItemList( type, rdcid);
		if (SetUtil.isnotNullList(itemList)) {
			LinkedHashMap< Object, Object> alllsisMap =new LinkedHashMap<Object, Object>();
			for (ItemValue itemValue : itemList) {//子对象-->冷库
				LinkedHashMap< Object, Object> subsisMap =new LinkedHashMap<Object, Object>();
				Object sisdata = getRdcData(type,keytype, itemValue.getId(),keys,keymap, isunit, unit, startTime, endTime);//keys[0]
				subsisMap.put("obj", itemValue);
				subsisMap.put("data", sisdata);
				subsisMap.put("hasData", sisdata==null?false:true);
				subsisMap.put("msge", sisdata==null?"没有查询到数据！":null);
				alllsisMap.put(itemValue.getId(), subsisMap);
			}
			rdcobj.put("data", alllsisMap);
		}else {
			rdcobj.put("data", null);
			rdcobj.put("errmsg", "没有"+title+"相关配置！");
		}
		return rdcobj;
		
		
	}

	/**
	 * 考虑使用多线程
	 * 
	 * @return
	 */
	private Object getRdcData(int type,int keytype, int oid,String keys,HashMap<String, Integer> keymap , boolean isunit ,Integer[] unit,String startTime, String endTime) {
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
				double value =  Double.parseDouble(dfformat.format(coldsis.getValue()));//、= Double.parseDouble(dfformat.format(value / unit[keyindex]));
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

	/**
	 * 导出辅助工具
	 * 
	 * @param request
	 * @param response
	 * @param index
	 * @param filename
	 * @param title
	 * @param toptit
	 *            :第一栏位名称
	 * @param subtit
	 *            :
	 * @param iserr
	 * @param alldata
	 */
	@SuppressWarnings("rawtypes")
	private void experrDataTool(HttpServletRequest request, HttpServletResponse response, String fileName, String title,	String[] toptit, String[] subtit, boolean iserr, LinkedHashMap<String, Object[]> alldata) {
		String[] shelName = { title };
		List<String> newtitlist = new ArrayList<String>();
		List<String> subtitlist = new ArrayList<String>();
		List<String> colmwith = new ArrayList<String>();
		newtitlist.add("日期");
		subtitlist.add("-");
		colmwith.add("5");
		int colmode[][] = null;
		if (subtit != null && subtit.length > 0) {
			colmode = new int[toptit.length + 1][];// 初始化跨列集合,进行跨列跨行计算
			colmode[0] = new int[] { 1, 2, 0, 0 };
			for (int i = 0; i < toptit.length; i++) {
				for (int j = 0; j < subtit.length; j++) {
					if (j == 0) {
						newtitlist.add(toptit[i]);
						colmode[i + 1] = new int[] { 1, 1, i * subtit.length + 1, i * subtit.length + subtit.length };
					} else {
						newtitlist.add("");
					}
					subtitlist.add(subtit[j]);
					colmwith.add("5");
				}
			}
		} else {
			for (String tit : toptit) {
				newtitlist.add(tit);
				colmwith.add("5");
			}
		}
		List<String[]> modeList = new ArrayList<String[]>();
		modeList.add(newtitlist.toArray(new String[newtitlist.size()]));// ;
		modeList.add(new String[] {});
		modeList.add(colmwith.toArray(new String[colmwith.size()]));// ;
		if (subtit != null && subtit.length > 0) {
			modeList.add(subtitlist.toArray(new String[subtitlist.size()]));// ;
		}
		List<List> expdata = new ArrayList<List>();
		LinkedList<Object> temp = null;
		if (alldata != null && alldata.size() > 0) {
			for (String key : alldata.keySet()) {
				temp = new LinkedList<Object>();
				temp.add(key);
				Object[] objects = alldata.get(key);
				for (Object object : objects) {
					if (object == null) {
						temp.add("0.0");
					} else {
						temp.add(object);
					}
				}
				expdata.add(temp);
			}
		}
		String mode[][] = modeList.toArray(new String[modeList.size()][]);
		ExportExcelUtil.expExcel(response, fileName, title, mode, colmode, shelName, expdata);
	}
	

	
	
	
	

	
	private Object[]  getObj(int seize){
		if(objMap.containsKey(seize)){return objMap.get(seize).clone();}
		Object[] objects =new Object[seize];
		for (int i = 0; i < seize; i++) {objects[i]=0;}
		objMap.put(seize, objects.clone());
		return objects;
	}
	
	
	private List<ItemValue>  getItemList(int type,int redcid){
		switch (type) {
		case 4://风机数据->冷库->风机
			return util.findSObjByRdcId(SetTables.STORAGESET.getTable(),SetTables.BLOWERSET.getTable(),"coldstorageid",redcid);
		case 5://风机数据->冷库->风机
			return util.findSObjByRdcId(SetTables.COMPRESSORGROUPSET.getTable(),SetTables.COMPRESSORSET.getTable(),"compressorgroupid",redcid);
		default:
			return util.findObjByRdcId(SetTables.getByType(type).getTable(), redcid);
		}
		
	}
	
	
	
	private LinkedHashMap<String, Object> getQEAnalysis(Integer rdcId,String rdcNmae,String title,String startTime, String endTime) {
		try {
			LinkedHashMap<String, Object> restMap = new LinkedHashMap<String, Object>();
			restMap.put("id",  rdcId);
			restMap.put("name", rdcNmae);
			List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, startTime,endTime);
			List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, startTime,endTime);
			if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
				HashMap<Date,Double > QMap=new HashMap<Date, Double>();
				LinkedHashMap<String, Object> bojdata = new LinkedHashMap<String, Object>();
				LinkedHashMap<String, Object> pbojdata = new LinkedHashMap<String, Object>();
				LinkedHashMap<Date, Object[]> tempData = new LinkedHashMap<Date, Object[]>();
				for (HashMap<String, Object> hashMap : sumQlist) { QMap.put((Date) hashMap.get("date"),  (Double) hashMap.get("sumq")); }
				for (HashMap<String, Object> hashMap : sumElist) { 
					Date date=(Date) hashMap.get("date");
					Double cutteQ = QMap.get(date);
					if(cutteQ==null){cutteQ=new Double(0);}
					Object[] objects = {Double.parseDouble(dfformat.format(cutteQ/ (Double) hashMap.get("sume")))};
					tempData.put(date,objects );
			    }
				bojdata.put("hasData", true);
				bojdata.put("obj",new ItemValue(1,"系统效率",0));
				bojdata.put("data", tempData)	;
				pbojdata.put("1", bojdata);
				restMap.put("data", pbojdata);
			}else{
				restMap.put("hasData", false);
				restMap.put("errmsg", SetUtil.isNullList(sumElist)?"没有查询到电表采集的数据!请检查电表配置！":"没有查询到热量采集数据!请检查AP配置！");
			}
			return restMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
}
