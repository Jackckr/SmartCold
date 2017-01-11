package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.BlowerMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 分析Controller
 * 
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/AnalysisController")
public class AnalysisController {

	@Autowired
	private BlowerMapper blowerMapper;
	
	@Autowired
	private QuantityMapper quantityMapper;

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;

	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
    private final static 	DecimalFormat dfformat = new DecimalFormat("######0.00");
	private static HashMap<String, LinkedHashMap<String, Object[]>> expData = new HashMap<String, LinkedHashMap<String, Object[]>>();

	/**
	 * 获得有效冷库门
	 * 
	 * @param recId
	 * @return
	 */
	@RequestMapping(value = "/getColdStorageDoor")
	@ResponseBody
	public Object getColdStorageDoor(Integer rdcId) {
		return coldStorageDoorSetDao.findValidByRdcId(rdcId);
	}

	/**
	 * 获得风机
	 * 
	 * @param recId
	 * @return
	 */
	@RequestMapping(value = "/getColdStorageBlower")
	@ResponseBody
	public Object getColdStorageBlower(Integer rdcId) {
		if(rdcId==null)return null;
		return blowerMapper.findBlowerByRdcID(rdcId);
	}

	/**
	 * 获得月分析报表
	 * @param rdcId
	 * @param stTime
	 * @param edTime
	 * @return
	 */
	@RequestMapping(value = "/getRdcreportsis", method = RequestMethod.POST)
	@ResponseBody
	public Object getRdcreportsis(Integer rdcId,String stTime ,String edTime) {
		if(rdcId!=null&&StringUtil.isnotNull(stTime)&&StringUtil.isnotNull(edTime)){ 
			return this.quantityMapper.getMothReportsisByrdcId(rdcId, stTime, edTime);}
		return null;
	}
	
	/**
	 * 月报告Q信息
	 * @param rdcId
	 * @param stTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value = "/getQAnalysisByMonth")
	@ResponseBody
	public Object getQAnalysis(Integer rdcId,String stTime,String edTime){
		if(rdcId!=null){
			return this.quantityMapper.getQuantitsis(rdcId, stTime,edTime);
		}
		return null;
	}
	/**
	 * 月报告信息
	 * @param rdcId
	 * @param stTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value = "/getSumkeySisByKey")
	@ResponseBody
	public Object getSumkeySisByKey(Integer rdcId,Integer type,String key, String stTime,String edTime){
		if(rdcId!=null&&type!=null&&StringUtil.isnotNull(key)){
			return this.quantityMapper.getSumKeyByRdcId(rdcId,StorageType.getStorageType(type).getTable()+"set", type, key, stTime, edTime);
		}
		return null;
	}
	/**
	 * 
	 * @param rdcId:冷库ID
	 * @param oids:冷库id集合
	 * @return
	 */
	@RequestMapping(value = "/getQAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getQAnalysis(Integer rdcId){
		if(rdcId==null){	return ResponseData.newFailure();}
			String stTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(30));
			List<HashMap<String, Object>> quantitsis = this.quantityMapper.getQuantitsis(rdcId, stTime,null);
			if(SetUtil.isnotNullList(quantitsis)){
				String xdata[] = new String[30];// 日期
				HashMap<String, Integer> dataindex=new HashMap<String, Integer>();
				double data[]=new double[]{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				for (int i = 0; i < 30; i++) {
					Calendar c = Calendar.getInstance(); c.add(Calendar.DAY_OF_MONTH, -30 + i); 
					String date=sdf.format(c.getTime());
					xdata[i]=date;
					dataindex.put(date, i);
				}
				HashMap<String, Object> resalldata=new HashMap<String, Object>();
				LinkedHashMap<String ,double[]> tempdata=new LinkedHashMap<String, double[]>();
				for (HashMap<String, Object> hashMap : quantitsis) {
					String date = sdf.format((Date) hashMap.get("date"));
					String key =  (String) hashMap.get("key");
					Integer idt = dataindex.get(date);
					double sumq= Double.parseDouble(dfformat.format((Double) hashMap.get("sumq")));
					if(tempdata.containsKey(key)){
						double[] ds = tempdata.get(key);
						ds[idt]=sumq ;
					}else{
						double[] clone = data.clone();
						clone[idt]=sumq;
						tempdata.put(key, clone);
					}
				 }
				resalldata.put("xAxis", xdata);
				resalldata.put("allseries", tempdata);
				return ResponseData.newSuccess(resalldata);
			}
			return ResponseData.newSuccess();
	}
	

	/**
	 * 
	 * @param rdcId:冷库ID
	 * @param compressorsId
	 *            :压缩机组id
	 * @return
	 */
	@RequestMapping(value = "/getCoolingAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getCoolingAnalysis(Integer rdcId) {
		try {
			if (rdcId == null) { return ResponseData.newFailure("非法请求！"); }
			String stTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(30));
			List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, stTime,null);
			List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, stTime,null);
			if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
				String xdata[] = new String[30];// 日期
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				HashMap<String,Double > QMap=new HashMap<String, Double>();
				HashMap<String,Double > EMap=new HashMap<String, Double>();
				HashMap<String, Object> chardata = new HashMap<String, Object>();//
				for (HashMap<String, Object> hashMap : sumQlist) { QMap.put(sdf.format((Date) hashMap.get("date")),  (Double) hashMap.get("sumq")); }
				for (HashMap<String, Object> hashMap : sumElist) { EMap.put(sdf.format((Date) hashMap.get("date")),  (Double) hashMap.get("sume")); }
				for (int i = 0; i < 30; i++) { Calendar c = Calendar.getInstance(); c.add(Calendar.DAY_OF_MONTH, -30 + i); xdata[i] = sdf.format(c.getTime());}
				double y1[] = new double[xdata.length];
				for (int i = 0; i < xdata.length; i++) {
					Double q=  QMap.get(xdata[i])  ;       
					Double e=  EMap.get(xdata[i])  ; 
					if(q!=null&&e!=null&&e!=0){
						y1[i]= Double.parseDouble(dfformat.format(q/e));
					}else{
						y1[i]=0;
					}
				}
				List<Object> templist = new ArrayList<Object>();
				HashMap<String, Object> charxdata = new HashMap<String, Object>();//
				charxdata.put("name", "系统效率");
				charxdata.put("data", y1);
				templist.add(charxdata);
				chardata.put("chdata", templist);
				chardata.put("xdata", xdata);// 展示数据
				return ResponseData.newSuccess(chardata);
			}else{
				if(SetUtil.isNullList(sumElist)){
					return ResponseData.newFailure("没有查询到电表采集的数据!请检查电表配置！");
				}else if(SetUtil.isNullList(sumQlist)){
					return ResponseData.newFailure("没有查询到热量采集数据!请检查AP配置！");
				}
				return ResponseData.newFailure("制冷系统运行效率趋势配置错误！");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("没有数据！");
	}

	/**
	 * 报表分析 支持多key
	 * 
	 * @param index:当前功能模块
	 *            ->0 单key 1 :多key
	 * @param rdcId:冷库id
	 *            ->暂时无用
	 * @param type:数据类型->StorageType->type
	 * @param confdata:采集数据父项
	 * @param key:采集数据
	 * @param startTime:开始时间
	 * @param endTime:结束数据
	 * @return
	 * index:$scope.slindex,urlid
	 */
	@RequestMapping(value = "/getCasesTotalSISAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getCasesTotalSISAnalysis(HttpServletRequest request,
			HttpServletResponse response, Boolean isexpt,int rdcid, int index,Integer urlid, Integer type, String confdata, String key,
			@RequestParam(value = "unit[]", required = false) Integer[] unit, String startTime, String endTime) {
		try {
			if(index==6){ return getQEAnalysis(rdcid, startTime, endTime); }//又一个处理特殊情况的  坑死我啦。。。。系统效率没有固化
			if (StringUtil.isNull(confdata) || StringUtil.isNull(key)) { return ResponseData.newFailure("非法请求！"); }
			boolean isunit = false;
			String[] keys = {}; String[] keyts = {}; String[] titls = {};
			HashMap<Integer, Integer> oidsymap = new HashMap<Integer, Integer>();
			HashMap<String, Integer> keymap = new HashMap<String, Integer>();
			LinkedHashMap<String, Object[]> tempData = new LinkedHashMap<String, Object[]>();
			if (urlid == 1) {
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
				if (unit != null && unit.length == keyts.length) { isunit = true; }//判断是否进行单位转换
			}
			List<PowerSetEntity> powerList = JSON.parseArray(confdata, PowerSetEntity.class);
			if (SetUtil.isNullList(powerList)) {
				return ResponseData.newFailure("非法请求！");
			}
			String oid = "";
			int[] oids = new int[powerList.size()];
			String[] names = new String[powerList.size()];
			for (PowerSetEntity powst : powerList) {
				oids[powst.getId()] = powst.getRdcid();
				names[powst.getId()] = powst.getName();
				if (!oid.equals("")) {
					oid += "," + powst.getRdcid();
				} else {
					oid = powst.getRdcid() + "";
				}
				oidsymap.put(powst.getRdcid(), powst.getId());
			}
			HashMap<String, Object> fileter = new HashMap<String, Object>();
			fileter.put("type", type);
			fileter.put("oid", oid);
			fileter.put("key", urlid == 0 ? key : keys[0]);
			fileter.put("desc", "asc");
			fileter.put("startTime", startTime);
			fileter.put("endTime", endTime);
			List<ColdStorageAnalysisEntity> datalist = this.coldStorageAnalysisService.findValueByFilter(fileter);
			HashMap<String, Object> restMap = new HashMap<String, Object>();
			if (SetUtil.isnotNullList(datalist)) {
				Object[] objects = {};
				for (ColdStorageAnalysisEntity coldsis : datalist) {// 2
					String data = TimeUtil.getFormatDate(coldsis.getDate());
					int oidindex = oidsymap.get(coldsis.getOid());
					int keyindex = urlid == 0 ? 0 : keymap.get(coldsis.getKey());
					if (tempData.containsKey(data)) {
						objects = tempData.get(data);
					} else {
						objects = new Object[urlid == 0 ? oids.length : oids.length * keyts.length];
					}
					double value = coldsis.getValue();// 计算偏移量
					if (isunit) {
						value = Double.parseDouble(dfformat.format(value / unit[keyindex]));
					} // 单位转换
					objects[urlid == 0 ? oidindex : oidindex * keyts.length + keyindex] = value;
					tempData.put(data, objects);
				}
				if(index==8){//第二个坑   处理特殊情况->制冷分析->平均值
					for (String sdkey : tempData.keySet()) {//String, Object[]
						Object[] keydata = tempData.get(sdkey);
						for (int i =2; i < keydata.length; i++) {
							if((i+1)%3==0&&0!=(Double)keydata[i-2]&&0!=(Double)keydata[i-1]){
								keydata[i]=	((Double)keydata[i-2]/(Double)keydata[i-1])*60;
							}
						}
					}
				}
				restMap.put("tbdata", tempData);
			}
			if (isexpt != null && isexpt) {
				String sid = request.getSession().getId();
				expData.put(sid, tempData);
				request.getSession().setAttribute(sid + "name", names);
				request.getSession().setAttribute(sid + "titls", titls);
				return ResponseData.newSuccess(sid);
			} else {
				restMap.put("titls", titls);
				restMap.put("keyts", keyts);
				return ResponseData.newSuccess(restMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询数据失败！请稍后重试！");
		}
	}
	
	
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
	public void expSISAnalysisData(HttpServletRequest request, HttpServletResponse response,  Boolean isexpt,int rdcid, int index,Integer urlid, Integer type, String confdata, String key,@RequestParam(value = "unit[]", required = false) Integer[] unit, String startTime, String endTime,String fileName, String title ) {
		try {
			if(StringUtil.isnotNull(fileName)){
				 ResponseData<HashMap<String, Object>> expdata = this.getCasesTotalSISAnalysis(request, response, true, rdcid, index, urlid, type, confdata, key, unit, startTime, endTime);
				 String sid=expdata.getMessage();
				 if(expdata.isSuccess()&& StringUtil.isnotNull(sid)){
								LinkedHashMap<String, Object[]> tempData = expData.get(sid);
								String[] names = (String[]) request.getSession().getAttribute(sid + "name");
								String[] titls = (String[]) request.getSession().getAttribute(sid + "titls");
								expData.remove(sid);
								request.getSession().removeAttribute(sid + "name");
								request.getSession().removeAttribute(sid + "titls");
								experrDataTool(request, response, fileName, title, names, titls, false, tempData);// 导出数据
			 }else{
				 experrDataTool(request, response, fileName, title, new String[]{startTime}, null, false, null);// 导出数据
			 }
			}else{
				experrDataTool(request, response, fileName, title, new String[]{startTime}, null, false, null);// 导出数据
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
    /**
     * 报表效率
     * @param rdcId
     * @param startTime
     * @param endTime
     * @return
     */
	@RequestMapping(value = "/getQEAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getQEAnalysis(Integer rdcId,String startTime, String endTime) {
		try {
			if (rdcId == null) { return ResponseData.newFailure("非法请求！"); }
			List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, startTime,endTime);
			List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, startTime,endTime);
			if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
				HashMap<Date,Double > QMap=new HashMap<Date, Double>();
				HashMap<String, Object> restMap = new HashMap<String, Object>();
				LinkedHashMap<Date, Object[]> tempData = new LinkedHashMap<Date, Object[]>();
				for (HashMap<String, Object> hashMap : sumQlist) { QMap.put((Date) hashMap.get("date"),  (Double) hashMap.get("sumq")); }
				for (HashMap<String, Object> hashMap : sumElist) { 
					Date date=(Date) hashMap.get("date");
					Double cutteQ = QMap.get(date);
					if(cutteQ==null){cutteQ=new Double(0);}
					Object[] objects = {Double.parseDouble(dfformat.format(cutteQ/ (Double) hashMap.get("sume")))};
					tempData.put(date,objects );
			    }
				restMap.put("tbdata", tempData);
				return ResponseData.newSuccess(restMap);
			}else{
				if(SetUtil.isNullList(sumElist)){
					return ResponseData.newFailure("电表采集的数据异常!请检查电表配置！");
				}else if(SetUtil.isNullList(sumQlist)){
					return ResponseData.newFailure("没有查询到热量采集数据!请检查AP配置！");
				}
				return ResponseData.newFailure("制冷系统运行效率趋势配置错误！");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("没有数据！");
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
	private void experrDataTool(HttpServletRequest request, HttpServletResponse response, String fileName, String title,
			String[] toptit, String[] subtit, boolean iserr, LinkedHashMap<String, Object[]> alldata) {
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

}
