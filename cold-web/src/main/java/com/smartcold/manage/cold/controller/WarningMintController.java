package com.smartcold.manage.cold.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.smartcold.manage.cold.dao.newdb.CompanyMapper;
import com.smartcold.manage.cold.dao.newdb.MaintenanceInfoMapper;
import com.smartcold.manage.cold.dao.newdb.WarningMintMapper;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.entity.newdb.MaintenanceInfo;
import com.smartcold.manage.cold.entity.newdb.MaintorderEntity;
import com.smartcold.manage.cold.entity.newdb.WarningMintEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
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
	
	//1.查看维修告警列表
	@RequestMapping(value = "/getWarningMintByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public List<WarningMintEntity> getWarningMintByRdcId(int rdcId,String status,Integer level,String keyword){
		return this.warningMintMapper.getMaintAlarmByFilter(rdcId, status, level, keyword);
	}
	//2.提交维修申请。。。使流程开始下个节点
	@RequestMapping(value = "/upMaintAlarmstatuByIds", method = RequestMethod.POST)
	@ResponseBody
	public boolean upMaintAlarmstatuByIds(String ids,Integer userId, Integer status,String node){
		 this.warningMintMapper.upMaintAlarmstatuByIds(ids,userId,status,node);
		 return true;
	}
	
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
	
	
	
	@RequestMapping(value = "/delMaintAlarmByIds", method = RequestMethod.DELETE)
	@ResponseBody
	public boolean delMaintAlarmByIds(String ids){
		 this.warningMintMapper.delMaintAlarmByIds(ids);
		 return true;
	}
	
	
	
	//==========================================================2.维修商确认维修并发起维修申请==========================================================
	//添加告警
	@RequestMapping(value = "/addMaintenance", method = RequestMethod.POST)
	@ResponseBody
	public boolean addMaintenance(int rdcid ,String warmappid,String faultmapper,String note,Double cost,String repairtime,String bookingtime,String servertype ){
		try {
			MaintenanceInfo obj=new MaintenanceInfo();
			obj.setRdcId(rdcid);
			obj.setWarmappid(warmappid);
			obj.setFaultmapper(faultmapper);
			obj.setNote(note);
			obj.setCost(cost);
			obj.setRepairtime(repairtime);
			obj.setBookingtime(bookingtime);
			obj.setAddtime(TimeUtil.getDateTime());
			obj.setServertype(servertype);
			this.maintenanceMapper.addMaintenanceInfo(obj);
		    this.warningMintMapper.upMaintAlarmstatuByIds(warmappid,null,2,null);
		    return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	// 查看维修清单方法
	@RequestMapping(value = "/getMaintenanceByWId", method = RequestMethod.GET)
	@ResponseBody
	public MaintenanceInfo getMaintenanceByWId(String wid){
		 if(StringUtil.isnotNull(wid)){
			 return this.maintenanceMapper.getMaintenanceByWId(wid);
		 }
		 return null;
	}
	
	//冷库主同意维修or驳回处理
	@RequestMapping(value = "/rejectMaintenanceByWarId", method = RequestMethod.POST)
	@ResponseBody
	public Object rejectMaintenanceById(Boolean isreject,String wid,Integer mid,int status){
		if(StringUtil.isnotNull(wid)){
		  if(isreject&&mid!=null){ this.maintenanceMapper.delMaintenanceById(mid);}
		  this.warningMintMapper.upMaintAlarmstatuByIds(wid,null,status,null);
		  return true;
	     }
		return false;
	}
	
	//==========================================================3.维修商提交维修清单==========================================================
	
//	id starttime endtime failurestatus maintresult cost 	note serverType addtime
	//获得错位类型分类
	@RequestMapping(value = "/getWarningType", method = RequestMethod.GET)
	@ResponseBody
	public Object getWarningType(int pid){
		return this.warningMintMapper.getWarningType(pid);
	}
	
	//维修确认清单-维修商3—4-5-维修清单确认 
	@RequestMapping(value = "/addMaintConfirma", method = RequestMethod.POST)
	@ResponseBody
	public boolean addMaintConfirma(int	rdcId,int maintid ,String wids,String detaileds, String starttime,String endtime,String	phenomena,String maintresult,Double	cost,String	note,String	serverType){
		 try {
			if(StringUtil.isnotNull(detaileds)){
				List<MaintorderEntity> listorder=JSONArray.parseArray(detaileds, MaintorderEntity.class);
				if(SetUtil.isnotNullList(listorder)){
					this.warningMintMapper.addMaintorder(listorder);
				}
			}
			this.warningMintMapper.addMaintconFirma(rdcId,maintid,starttime, endtime,phenomena, maintresult,cost,note,serverType);
			this.warningMintMapper.upMaintAlarmstatuByIds(wids,null,5,null);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		 return false;
	}
	
//	// 查看维修清单方法
	@RequestMapping(value = "/getMaintconFirmaByMid", method = RequestMethod.GET)
	@ResponseBody
	public Object getMaintconFirmaByMid(int mid){
		return this.maintenanceMapper.getMaintconFirmaByMid(mid);
	}
	
	@RequestMapping(value = "/getMaintorderByMid", method = RequestMethod.GET)
	@ResponseBody
	public Object getMaintorderByMid(int mid){
		return this.maintenanceMapper.getMaintorderByMid(mid);
	}
	//=================================================================================6同意及评价============================================================
	//冷库主清单同意or驳回处理
	@RequestMapping(value = "/rejectMaintconfirmaById", method = RequestMethod.POST)
	@ResponseBody
	public Object rejectMaintconfirmaById(Boolean isreback,Double score,String evaluate,  String wid,int mid,int status){
		if(StringUtil.isnotNull(wid)){
//			  if(isreject&&mid!=null){ this.maintenanceMapper.delMaintenanceById(mid);}
			  this.warningMintMapper.upMaintAlarmstatuByIds(wid,null,status,null);
			  if(!isreback){//追加评价
				  this.maintenanceMapper.upMaintenancesCoreById(mid, score, evaluate);
			  }
			  return true;
		     }
		return false;
	}
	
	
	
}
