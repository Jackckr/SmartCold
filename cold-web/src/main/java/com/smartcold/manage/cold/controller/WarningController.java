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
			HashMap<String, Object> allDataMap = new HashMap<String, Object>();
			String stTime = TimeUtil.getBeginDay()+" 00:00:00";String edTime = TimeUtil.getDateTime();//当月起止时间
			String lstTime = TimeUtil.getBeforeMonthTime(1);String ledTime =TimeUtil.getEndMonthTime(1);//上月起止时间
			List<HashMap<String, Object>> cuttMothRestMap=this.warningsInfoDao.getWarCountByHPO(rdcId, lstTime, ledTime);//本月累计次数
			List<HashMap<String, Object>> lastMothRestMap = this.warningsInfoDao.getWarCountByHPO(rdcId, stTime, edTime);	//  	上月累计次数
			allDataMap.put("cuttdata", cuttMothRestMap);
			allDataMap.put("lsttdata", lastMothRestMap);
			return ResponseData.newSuccess(allDataMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询错误！请稍后重试！");
		}
	}
}
