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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.BlowerMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
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
		return blowerMapper.findBlowerByRdcID(rdcId);
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
			List<HashMap<String, Object>> quantitsis = quantityMapper.getQuantitsis(rdcId, stTime);
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
					if(tempdata.containsKey(key)){
						double[] ds = tempdata.get(key);
						ds[idt]=(Double) hashMap.get("sumq");
					}else{
						double[] clone = data.clone();
						clone[idt]=(Double) hashMap.get("sumq");
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
	public ResponseData<HashMap<String, Object>> getCoolingAnalysis(Integer rdcId, Integer[] compressorsId,
			String[] compressorsName) {
		try {
			if (rdcId == null) {
				return ResponseData.newFailure("非法请求！");
			}
			List<CompressorGroupSetEntity> compressList = this.compressorGroupSetDao.findByRdcId(rdcId);
			if (SetUtil.isnotNullList(compressList)) {
				HashMap<String, Object> chardata = new HashMap<String, Object>();//
				// ==========================================虚拟数据start-30天==========================================
				String xdata[] = new String[30];// 日期
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				for (int i = 0; i < 30; i++) {
					Calendar c = Calendar.getInstance();
					c.add(Calendar.DAY_OF_MONTH, -30 + i);
					xdata[i] = sdf.format(c.getTime());
				}
				chardata.put("xdata", xdata);// 展示数据
				List<Object> templist = new ArrayList<Object>();
				DecimalFormat dfformat = new DecimalFormat("######0.00");
				for (CompressorGroupSetEntity comss : compressList) {
					double y1[] = new double[xdata.length];
					for (int i = 0; i < xdata.length; i++) {
						y1[i] = Double.parseDouble(dfformat.format(Math.random()));
					}
					HashMap<String, Object> charxdata = new HashMap<String, Object>();//
					charxdata.put("name", comss.getName());
					charxdata.put("id", comss.getId());
					charxdata.put("data", y1);
					templist.add(charxdata);
				}
				chardata.put("chdata", templist);
				// ==========================================虚拟数据end==========================================
				return ResponseData.newSuccess(chardata);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure();
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
			HttpServletResponse response, Boolean isexpt, int index,Integer urlid, Integer type, String confdata, String key,
			@RequestParam(value = "unit[]", required = false) Integer[] unit, String startTime, String endTime) {
		try {
			if (StringUtil.isNull(confdata) || StringUtil.isNull(key)) {
				return ResponseData.newFailure("非法请求！");
			}
			boolean isunit = false;
			String[] keys = {};
			String[] keyts = {};
			String[] titls = {};
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
				DecimalFormat dfformat = new DecimalFormat("######0.00");
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
				if(index==8){//处理特殊情况->制冷分析
					for (String sdkey : tempData.keySet()) {//String, Object[]
						Object[] keydata = tempData.get(sdkey);
						for (int i =2; i < keydata.length; i++) {
							if((i+1)%3==0&&0!=(Double)keydata[i-2]&&0!=(Double)keydata[i-1]){
								
								keydata[i]=	((Double)keydata[i-2]/(Double)keydata[i-1]);
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
	public void expSISAnalysisData(HttpServletRequest request, HttpServletResponse response, String fileName,
			String title, String sid) {
		try {
			if (StringUtil.isnotNull(fileName) && StringUtil.isnotNull(sid)) {
				LinkedHashMap<String, Object[]> tempData = expData.get(sid);
				String[] names = (String[]) request.getSession().getAttribute(sid + "name");
				String[] titls = (String[]) request.getSession().getAttribute(sid + "titls");
				expData.remove(sid);
				request.getSession().removeAttribute(sid + "name");
				request.getSession().removeAttribute(sid + "titls");
				experrDataTool(request, response, fileName, title, names, titls, false, tempData);// 导出数据
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
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
