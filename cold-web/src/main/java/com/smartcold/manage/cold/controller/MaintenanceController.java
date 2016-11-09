package com.smartcold.manage.cold.controller;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.manage.cold.dao.olddb.MaintenanceMapper;
import com.smartcold.manage.cold.entity.olddb.MaintenanceEntity;

@Controller
@RequestMapping(value = "/maintenance")
public class MaintenanceController {

	@Autowired
	private MaintenanceMapper maintenanceMapper;


	@RequestMapping(value = "/findMaintenanceList", method = RequestMethod.POST)
	@ResponseBody
	public Object findMaintenanceList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="audit", required=false) Integer audit,
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
		if( !(audit == 1 || audit == 0) ){
			audit = null;
		}
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if(keyword.equals("undefined"))
			keyword = null;
		else{
		keyword = URLDecoder.decode(keyword, "UTF-8");
		}
		Page<MaintenanceEntity> maintenancePage = maintenanceMapper.findAllMaintenances(audit, keyword);
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
	public Object addMaintenance(@RequestParam(value="unitname",required=false)String unitname,
			@RequestParam(value="reason",required=false)String reason,
			@RequestParam(value="ordertime",required=false)String ordertime) throws ParseException, UnsupportedEncodingException{
		 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
		MaintenanceEntity maintenanceEntity = new MaintenanceEntity();
		maintenanceEntity.setUnitname( URLDecoder.decode(unitname, "UTF-8"));
		maintenanceEntity.setReason(URLDecoder.decode(reason, "UTF-8"));
		maintenanceEntity.setOrdertime(sdf.parse(ordertime));
		maintenanceMapper.insertMaintenance(maintenanceEntity);
		return true;
	}
	
	@RequestMapping(value="/updateMaintenance", method=RequestMethod.POST)
	@ResponseBody
	public Object updateMaintenance(@RequestParam(value="id",required=false)int id,
			@RequestParam(value="audit",required=false)int audit,
			@RequestParam(value="detail",required=false)String detail,
			@RequestParam(value="note",required=false)String note,
			@RequestParam(value="fixtime",required=false)String fixtime) throws ParseException, UnsupportedEncodingException{
		 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
		MaintenanceEntity maintenanceEntity = new MaintenanceEntity();
		maintenanceEntity.setId(id);
		maintenanceEntity.setAudit(audit);
		maintenanceEntity.setDetail( URLDecoder.decode(detail, "UTF-8"));
		maintenanceEntity.setNote(URLDecoder.decode(note, "UTF-8"));
		maintenanceEntity.setFixtime(sdf.parse(fixtime));
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
	
}
