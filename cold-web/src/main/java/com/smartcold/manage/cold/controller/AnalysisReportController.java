package com.smartcold.manage.cold.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 *360新分析报表
 * 
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/AnalysisReportController")
public class AnalysisReportController {

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
	public ResponseData<HashMap<String, Object>> getCasesTotalSISAnalysis(HttpServletRequest request,HttpServletResponse response, List<ItemValue> rdcList, Boolean isexpt, String key, Integer[] unit, String startTime, String endTime) {
		
	}

}
