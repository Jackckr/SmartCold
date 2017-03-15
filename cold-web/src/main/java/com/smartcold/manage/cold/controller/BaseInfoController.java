package com.smartcold.manage.cold.controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.PackMapper;
import com.smartcold.manage.cold.dao.newdb.TaskMapper;
import com.smartcold.manage.cold.dao.newdb.UsageMapper;
import com.smartcold.manage.cold.dao.newdb.WallMaterialMapper;
import com.smartcold.manage.cold.dao.olddb.TempSetMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.service.GoodsService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

@Controller
@RequestMapping(value = "/baseInfo")
public class BaseInfoController extends BaseController {
	@Autowired
	private PackMapper packDao;
	@Autowired
	private TaskMapper taskDao;
	@Autowired
	private UsageMapper usageDao;
	@Autowired
	private TempSetMapper tempSetMapper;
	@Autowired
	private GoodsService goodsService;
	@Autowired
	private StorageService storageService;
	@Autowired
	private WallMaterialMapper wallMaterialDao;

	@RequestMapping(value = "/findAllGoods", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllGoods() {
		return goodsService.getAllGoods();
	}

	@RequestMapping(value = "/findAllPack", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllPack() {
		return packDao.findAll();
	}

	@RequestMapping(value = "/findAllWallMaterial", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWallMaterial() {
		return wallMaterialDao.findAll();
	}

	@RequestMapping(value = "/findAllUsage", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllUsage() {
		return usageDao.findAll();
	}

	@RequestMapping("/getKeyValueData")
	@ResponseBody
	public Object getKeyValueData(@RequestParam("type") Integer type, @RequestParam("oid") int oid,
			@RequestParam("key") String key, @RequestParam(value = "nums", defaultValue = "480") Integer nums) {
		return storageService.findByNums(type, oid, key, nums);
	}

	@RequestMapping("/getKeyValueDataByTime")
	@ResponseBody
	public Object getKeyValueDataByTime(@RequestParam("type") Integer type, @RequestParam("oid") int oid,
			@RequestParam("key") String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		return storageService.findByTime(type, oid, key, startTime, endTime,"DESC");
	}


	/**
	 * 计算两个日期之间相差的天数
	 * 
	 * @param smdate
	 *            较小的时间
	 * @param bdate
	 *            较大的时间
	 * @return 相差天数
	 * @throws ParseException
	 */
	public String getDateFormat(int day) {
		System.err.println(day);
		if (day <= 3)
			return "%Y-%m-%d %H:%i:%s";
		else if (day <= 5)
			return "%Y-%m-%d %H";
		else 
			return "%Y-%m-%d";
		
	}
	@RequestMapping("/ios_getKeyValueDataByFilter")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> ios_getKeyValueDataByFilter(Integer type, Boolean ismklin, String key, String oids, String onames, String startTime, String endTime) {
		if(StringUtil.isnotNull(oids)&&StringUtil.isnotNull(onames)){
			String []newoid=StringUtil.splitfhString(oids);
			String []newonames= StringUtil.splitfhString(onames);
			if (newoid.length==newonames.length) {
				Integer [] newoids=new Integer[newoid.length];
				for (int i = 0; i < newoid.length; i++) {
					newoids[i]=Integer.parseInt(newoid[i]);
				}	
				return getKeyValueDataByFilter( type,  ismklin,  key,  newoids,  newonames,  startTime,  endTime);
			}else{
				return ResponseData.newFailure("参数不全！");
			}
		}
		return ResponseData.newFailure("参数不全！");
	}
	
	/**
	 * 历史数据查询
	 * 此接口在下个版本删掉（2017-5-9 17:14:10）
	 */
	@Deprecated
	@RequestMapping("/getKeyValueDataByFilter")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getKeyValueDataByFilter(Integer type, Boolean ismklin, String key,
			Integer[] oids, String[] onames, String startTime, String endTime) {
		try {
			System.err.println(type + "/" + key + "/" + oids + "/" + onames + "/" + startTime + "/" + endTime);
			if (key != null && key != "" && oids != null && oids.length > 0) {
//				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date sttime = TimeUtil.dateFormat.parse(startTime);
				Date edTime = TimeUtil.dateFormat.parse(endTime);
				int daysBetween = TimeUtil.daysBetween(sttime, edTime);
				if(daysBetween>4){return ResponseData.newFailure("时间范围最大为3天~"); }
				if(type==1&&"Temp".equals(key)){type=18;}//兼容旧数据
				HashMap<String, Object> restData = new HashMap<String, Object>();
				LinkedList<HashMap<String, Object>> restList = new LinkedList<HashMap<String, Object>>();
				LinkedList<List<StorageKeyValue>> xtemp = new LinkedList<List<StorageKeyValue>>();
				int maxsize = 0, index = -1;
				HashMap<String, Object> temp = new LinkedHashMap<String, Object>();
				List<Object> maklist = new ArrayList<Object>();

				HashMap<String, Object> dttemp = new LinkedHashMap<String, Object>();
				temp.put("type", "average");
				temp.put("name", "平均值");
				maklist.add(temp);
				dttemp.put("data", maklist);

				List<Object> mtklist = new ArrayList<Object>();
				HashMap<String, Object> rttemp = new LinkedHashMap<String, Object>();
				HashMap<String, Object> mttemp = new LinkedHashMap<String, Object>();
				mttemp.put("type", "max");
				mttemp.put("name", "最大值");
				mtklist.add(mttemp);
				rttemp.put("data", mtklist);

				for (int i = 0; i < oids.length; i++) {
					HashMap<String, Object> linmap = new HashMap<String, Object>();
					int oid = oids[i];
					String oname = onames[i];
					if("Temp".equals(key)){//
						type=18;
						 Map<String, List<StorageKeyValue>> data = storageService.findTempByTime(type, oid, key, sttime, edTime);//
						 if(SetUtil.isNotNullMap(data)){
							 for (String  devkey : data.keySet()) {
								 List<StorageKeyValue> datalist = data.get(devkey);
								 if (datalist.size() > maxsize) {index = i;}
								linmap.put("type", "line");
								linmap.put("data", datalist);
								linmap.put("name", devkey);
								if (ismklin != null && ismklin) {
									linmap.put("markLine", dttemp);
									linmap.put("markPoint", rttemp);
								}
								xtemp.add(datalist);
							}
						 }else{
							 List<StorageKeyValue> datalist =new ArrayList<>();
							    linmap.put("type", "line");
								linmap.put("data", datalist);
								linmap.put("name", onames[i]);
								xtemp.add(datalist);
						 }
							restList.add(linmap);
							i++;
					}else{
						  List<StorageKeyValue> datalist = storageService.findByTimeFormat(type, oid, key, sttime, edTime,0,null,"asc" );//
							if (datalist.size() > maxsize) {index = i;}
							linmap.put("type", "line");//type==2||type==3?"bar":line
							linmap.put("data", datalist);
							linmap.put("name", oname);
							if (ismklin != null && ismklin) {
								linmap.put("markLine", dttemp);
								linmap.put("markPoint", rttemp);
							}
							xtemp.add(datalist);
							restList.add(linmap);
					}
				}
				if (index != -1) {
					List<StorageKeyValue> list = xtemp.get(index);
					String[] xdt = new String[list.size()];
					for (int i = 0; i < list.size(); i++) {
						xdt[i] = TimeUtil.dateFormat.format(list.get(i).getAddtime());
					}
					restData.put("xdata", xdt);
				} else {
					String[] xdt = new String[daysBetween];
					for (int i = 0; i < daysBetween; i++) {
						Calendar c = Calendar.getInstance();
						c.add(Calendar.DAY_OF_MONTH, -daysBetween + i);
						xdt[i] = TimeUtil.dateFormat.format(c.getTime());
					}
					restData.put("xdata", xdt);// 展示数据
				}
				restData.put("ydata", restList);
				return ResponseData.newSuccess(restData);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure();
	}


}