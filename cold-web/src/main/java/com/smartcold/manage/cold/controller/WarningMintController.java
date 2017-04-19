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
import com.smartcold.manage.cold.util.SetUtil;
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
		 this.warningMintMapper.upMaintAlarmstatuByIds(ids,null,userId,status,node);
		 return true;
	}
	
	//==========================================================2.维修商确认维修并发起维修申请==========================================================
	@RequestMapping(value = "/addMaintenance", method = RequestMethod.POST)
	@ResponseBody
	public boolean addMaintenance( String waruser,String  maintuser,String companyinfo,String warMapper,String warmappid,String note,Double cost,String repairtime,String bookingtime,String servertype ){
		try {
			MaintenanceInfo obj=new MaintenanceInfo();
			obj.setWaruser(waruser);
			obj.setMaintuser(maintuser);
			obj.setCompanyinfo(companyinfo);
			obj.setWarMapper(warMapper);
			obj.setWarmappid(warmappid);
			obj.setNote(note);
			obj.setCost(cost);
			obj.setRepairtime(repairtime);
			obj.setBookingtime(bookingtime);
			obj.setAddtime(TimeUtil.getDateTime());
			obj.setServertype(servertype);
			this.maintenanceMapper.addMaintenanceInfo(obj);
		    this.warningMintMapper.upMaintAlarmstatuByIds(warmappid,obj.getId(),null,2,null);
		    return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	@RequestMapping(value = "/getMaintenanceById", method = RequestMethod.GET)
	@ResponseBody
	public Object getMaintenanceById(int id){
		 List<MaintenanceInfo> maintenanceInfoList = this.maintenanceMapper.getMaintenanceById(id);
		if(SetUtil.isnotNullList(maintenanceInfoList)){
			HashMap<String, Object> resMap=new HashMap<String, Object>();
		     MaintenanceInfo maintenanceInfo = maintenanceInfoList.get(0);
			 List<WarningMintEntity> warList = this.warningMintMapper.getWarningMintById(maintenanceInfo.getWarmappid());
			 resMap.put("warData", warList);
			 resMap.put("data",  maintenanceInfo );
			 return resMap;
		}else{
			return null;
		}
		
	}
	
	@RequestMapping(value = "/rejectMaintenanceByWarId", method = RequestMethod.POST)
	@ResponseBody
	public Object rejectMaintenanceById(Boolean isreject,String wid,Integer mid,Integer status){
		 if(isreject){ this.maintenanceMapper.delMaintenanceById(mid);}
		 this.warningMintMapper.upMaintAlarmstatuByIds(wid,null,null,status,null);//降级处理
		 return true;
	}
	
	
	
}
