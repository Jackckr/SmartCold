package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.ReportDailyMapper;
import com.smartcold.manage.cold.dao.newdb.ReportMonthlyMapper;

@Controller
@RequestMapping(value = "/report")
public class ReportController {

	@Autowired
	private ReportDailyMapper reportDailyDao;

	@Autowired
	private ReportMonthlyMapper reportMonthlyDao;

	@RequestMapping(value = "/daily", method = RequestMethod.GET)
	@ResponseBody
	public Object reportDaily(int storageId, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date begin,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end) {
		return reportDailyDao.findReportsByStorageId(storageId, begin, end);
	}

	@RequestMapping(value = "/monthly", method = RequestMethod.GET)
	@ResponseBody
	public Object reportMonthly(int storageId, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date begin,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end) {
		return reportMonthlyDao.findReportsByStorageId(storageId, begin, end);
	}
}
