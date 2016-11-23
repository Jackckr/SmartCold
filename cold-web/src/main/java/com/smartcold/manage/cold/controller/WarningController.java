package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.TimeUtil;

@Controller
@RequestMapping(value = "/warn")
public class WarningController extends BaseController {

	@Autowired
	private WarningsInfoMapper warningsInfoDao;

	@RequestMapping(value = "/findAllWarningsInfoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWarningsInfo(int rdcId) {
		List<WarningsInfo> warningsInfoList = warningsInfoDao.findAllWarningInfo(rdcId);
		return warningsInfoList;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/findLastNWarningsInfoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findLastNWarningsInfoByRdcId(int rdcId, int point) {
		List<WarningsInfo> warningsInfoList = warningsInfoDao.findLastNWarningInfo(rdcId, point);
		List allInfoList = new ArrayList();
		for (WarningsInfo warningInfo : warningsInfoList) {
			Map map = new HashMap();
			map.put("addtime", warningInfo.getAddtime());
			map.put("level", warningInfo.getLevel());
			map.put("id", warningInfo.getId());
			allInfoList.add(map);
		}
		return allInfoList;
	}

	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getWarncoldAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getWarncoldAnalysis(Integer rdcId) {
		try {
			if (rdcId == null) { return ResponseData.newFailure("非法访问！"); }
			String stTime = TimeUtil.getBeginDay()+" 00:00:00";String edTime = TimeUtil.getDateTime();//当月起止时间
			String lstTime = TimeUtil.getBeforeMonthTime(1);String ledTime =TimeUtil.getEndMonthTime(1);//上月起止时间
			
			
			//  	上月累计次数	本月累计次数
			//高压报警	 HighPressWarningCount 
			//电源报警	 PowerWarningCount 
			//缺油报警   OilWarningCount
			
			HashMap<String, Object> allDataMap = new HashMap<String, Object>();
			HashMap<String, Object> resMap = new HashMap<String, Object>();
//			List<WarningsInfo> wrnType = this.warningsInfoDao.getWrnType(rdcId, 1);// 查询上个月的
//			if (SetUtil.isnotNullList(wrnType) && wrnType.size() > 0) {
//				String startime = TimeUtil.getBeforeMonthTime(1);
//				String endtime = TimeUtil.getEndMonthTime(1);
//				for (WarningsInfo warningsInfo : wrnType) {
//					resMap.put(warningsInfo.getWarningname(),
//							this.warningsInfoDao.getWarCountByType(rdcId,30,warningsInfo.getWarningname(),startime,endtime) );
//				}
//			}
			HashMap<String, Object> rescuMap = new HashMap<String, Object>();
//			List<WarningsInfo> wrncuType = this.warningsInfoDao.getWrnType(rdcId, 0);// 查询当前月份的
//			if (SetUtil.isnotNullList(wrncuType) && wrncuType.size() > 0) {
//				String startime = TimeUtil.getBeforeMonthTime(0);
//				String endtime = TimeUtil.getEndMonthTime(0);
//				for (WarningsInfo warningsInfo : wrncuType) {
//					rescuMap.put(warningsInfo.getWarningname(),
//							this.warningsInfoDao.getWarCountByType(rdcId,  30, warningsInfo.getWarningname(),startime,endtime));
//				}
//			}
			allDataMap.put("cuttdata", rescuMap);
			allDataMap.put("lsttdata", resMap);
			return ResponseData.newSuccess(allDataMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询错误！请稍后重试！");
		}

	}
	
	
	

}
