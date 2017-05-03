package com.smartcold.manage.cold.controller;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.manage.cold.dao.olddb.MaintenanceMapper;
import com.smartcold.manage.cold.entity.olddb.MaintenanceEntity;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 维修。。。。。old
 * @author Administrator
 *
 */
//@Controller
//@RequestMapping(value = "/maintenance")
@Deprecated
public class MaintenanceController {
/*
	@Autowired
	private MaintenanceMapper maintenanceMapper;


	@RequestMapping(value = "/findMaintenanceList", method = RequestMethod.POST)
	@ResponseBody
	public Object findMaintenanceList(Integer rdcId,Integer audit,String keyword,  Integer pageNum,Integer pageSize )  {
		if(audit==null||  rdcId==null){ return null; }
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if(keyword.equals("undefined")){keyword = null;}
		Page<MaintenanceEntity> maintenancePage = maintenanceMapper.findMaintByRdcId(rdcId,audit, keyword);
		return new PageInfo<MaintenanceEntity>(maintenancePage);
	}
	
	
	@RequestMapping(value = "/findAllMaintenance", method = RequestMethod.POST)
	@ResponseBody
	public Object findAllMaintenance(Integer rdcId,Integer audit,String keyword)  {
		if(audit==null||  rdcId==null){ return null; }
		if(keyword.equals("undefined")){keyword = null;}
		Page<MaintenanceEntity> maintenancePage = maintenanceMapper.findMaintByRdcId(rdcId,audit, keyword);
		return new PageInfo<MaintenanceEntity>(maintenancePage);
	}
	
	@RequestMapping(value = "/deleteMaintenance", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteMaintenance(int id) {
		  maintenanceMapper.deleteMaintenance(id);
		  return true;
	}
	
	
	@RequestMapping(value = "findMaintenanceByID", method = RequestMethod.GET)
	@ResponseBody
	public Object findMaintenanceByID(int id) {
		return maintenanceMapper.findMaintenanceByID(id);
	}
	
	@RequestMapping(value="/addMaintenance", method=RequestMethod.POST)
	@ResponseBody
	public Object addMaintenance(Integer rdcId, String unitname, String reason,String ordertime) throws ParseException, UnsupportedEncodingException{
		if(rdcId==null){return false;}
		if(StringUtil.isNull(ordertime)){ordertime=TimeUtil.getFormatDate(new Date());}
		MaintenanceEntity maintenanceEntity = new MaintenanceEntity();
		maintenanceEntity.setUnitname( URLDecoder.decode(unitname, "UTF-8"));
		maintenanceEntity.setReason(URLDecoder.decode(reason, "UTF-8"));
		maintenanceEntity.setOrdertime(ordertime);
		maintenanceEntity.setRdcId(rdcId);
		maintenanceMapper.insertMaintenance(maintenanceEntity);
		return true;
	}
	
	@RequestMapping(value="/updateMaintenance", method=RequestMethod.POST)
	@ResponseBody
	public Object updateMaintenance(int id,int audit,String detail,String note,String fixtime) throws ParseException, UnsupportedEncodingException{
		MaintenanceEntity maintenanceEntity = new MaintenanceEntity();
		maintenanceEntity.setId(id);
		maintenanceEntity.setAudit(audit);
		maintenanceEntity.setDetail( URLDecoder.decode(detail, "UTF-8"));
		maintenanceEntity.setNote(URLDecoder.decode(note, "UTF-8"));
		maintenanceEntity.setFixtime(fixtime);
		maintenanceMapper.updateMaintenance(maintenanceEntity);
		return true;
	}
	@RequestMapping(value="/updateMaintenanceAppraise", method=RequestMethod.POST)
	@ResponseBody
	public Object updateMaintenanceAppraise(@RequestParam(value="id",required=false)int id,
			@RequestParam(value="appraise",required=false)String appraise
			) throws ParseException, UnsupportedEncodingException{
		MaintenanceEntity maintenanceEntity = new MaintenanceEntity();
		maintenanceEntity.setId(id);
		maintenanceEntity.setAudit(1);
		maintenanceEntity.setAppraise(appraise);
		maintenanceMapper.updateMaintenance(maintenanceEntity);
		return true;
	}
	*/
}
