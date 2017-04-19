package com.smartcold.manage.cold.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.CompanyMapper;
import com.smartcold.manage.cold.dao.newdb.MaintenanceInfoMapper;
import com.smartcold.manage.cold.dao.newdb.WarningMintMapper;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.entity.newdb.MaintenanceInfo;
import com.smartcold.manage.cold.entity.newdb.WarningMintEntity;
import com.smartcold.manage.cold.util.TimeUtil;


/**
 * 维修
 * @author Administrator
 *
 */

@Controller
@RequestMapping(value = "/warningMint")
public class WarningMintController extends BaseController {
  
	@Autowired
	private CompanyMapper companyMapper;
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private WarningMintMapper warningMintMapper;
	@Autowired
	private MaintenanceInfoMapper maintenanceMapper;
	
	
	
	//==========================================================1.冷库发起申请故障维修==========================================================
	@RequestMapping(value = "/getWarningMintById", method = RequestMethod.GET)
	@ResponseBody
	public Object getWarningMintById(String ids,Integer rdcId){
		 HashMap<String, Object> resMap=new HashMap<String, Object>();
		 List<WarningMintEntity> warList = this.warningMintMapper.getWarningMintById(ids);
		 resMap.put("warData", warList);
		 resMap.put("user",  this.userMapper.selectByPrimaryKey(warList.get(0).getUserId()) );
		 resMap.put("company", this.companyMapper.selectCompanyByRdcId(rdcId));
		 return resMap;
	}
	
	@RequestMapping(value = "/getWarningMintByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public List<WarningMintEntity> getWarningMintByRdcId(int rdcId,String status,Integer level,String keyword){
		return this.warningMintMapper.getMaintAlarmByFilter(rdcId, status, level, keyword);
	}
	
	@RequestMapping(value = "/delMaintAlarmByIds", method = RequestMethod.DELETE)
	@ResponseBody
	public boolean delMaintAlarmByIds(String ids){
		 this.warningMintMapper.delMaintAlarmByIds(ids);
		 return true;
	}
	
	@RequestMapping(value = "/upMaintAlarmstatuByIds", method = RequestMethod.POST)
	@ResponseBody
	public boolean upMaintAlarmstatuByIds(String ids,Integer userId, Integer status,String node){
		 this.warningMintMapper.upMaintAlarmstatuByIds(ids,userId,status,node);
		 return true;
	}
	
	//==========================================================2.维修商确认维修并发起维修申请==========================================================
	@RequestMapping(value = "/addMaintenance", method = RequestMethod.POST)
	@ResponseBody
	public boolean addMaintenance( String waruser,String  maintuser,String companyinfo,String warMapper,String mappid,String note,Double cost,String repairtime,String bookingtime,String servertype ){
		try {
			MaintenanceInfo obj=new MaintenanceInfo();
			obj.setWaruser(waruser);
			obj.setMaintuser(maintuser);
			obj.setCompanyinfo(companyinfo);
			obj.setWarMapper(warMapper);
			obj.setMappid(mappid);
			obj.setNote(note);
			obj.setCost(cost);
			obj.setRepairtime(repairtime);
			obj.setBookingtime(bookingtime);
			obj.setAddtime(TimeUtil.getDateTime());
			this.maintenanceMapper.addMaintenanceInfo(obj);
		    return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	
	
	
	
}
