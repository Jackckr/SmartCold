package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.ReportDailyMapper;
import com.smartcold.manage.cold.dao.ReportMonthlyMapper;

@Controller
@RequestMapping(value = "/report")
public class ReportController {

	@Autowired
	private ReportDailyMapper reportDailyDao;

	@Autowired
	private ReportMonthlyMapper reportMonthlyDao;

	@RequestMapping(value = "/daily", method = RequestMethod.GET)
	@ResponseBody
	public Object reportDaily(int storageId, Date begin, Date end) {
		return reportDailyDao.findReportsByStorageId(storageId, begin, end);
	}

	@RequestMapping(value = "/monthly", method = RequestMethod.GET)
	@ResponseBody
	public Object reportMonthly(int storageId, Date begin, Date end) {
		return reportMonthlyDao.findReportsByStorageId(storageId, begin, end);
	}
}
