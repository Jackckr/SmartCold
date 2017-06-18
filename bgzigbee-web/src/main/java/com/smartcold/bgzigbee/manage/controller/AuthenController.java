package com.smartcold.bgzigbee.manage.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.ACLMapper;
import com.smartcold.bgzigbee.manage.dao.AuthenMapper;
import com.smartcold.bgzigbee.manage.dao.RdcAuthLogMapper;
import com.smartcold.bgzigbee.manage.dao.RdcMapper;
import com.smartcold.bgzigbee.manage.dao.RdcUserMapper;
import com.smartcold.bgzigbee.manage.dao.RoleUserMapper;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.RdcAuthEntity;
import com.smartcold.bgzigbee.manage.entity.RdcAuthLogEntity;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;
import com.smartcold.bgzigbee.manage.entity.RdcUser;
import com.smartcold.bgzigbee.manage.entity.RoleUser;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.enums.UserVersion;
import com.smartcold.bgzigbee.manage.util.SetUtil;
import com.smartcold.bgzigbee.manage.util.TableData;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/authen")
public class AuthenController {

	
	@Autowired
	private RdcMapper rdcDao;
	@Autowired
	private AuthenMapper authenMapper;
	@Autowired
	private RdcAuthLogMapper rdcAuthLogDao;
	@Autowired
	private RoleUserMapper roleUserDao;
	@Autowired
	private RdcUserMapper rdcUserDao;
	@Autowired
	private UserMapper userDao;
	@Autowired
	private ACLMapper aclMapper;
	
	
	/**
	 * 获得认证列表
	 * @param type
	 * @param audit
	 * @param coleam
	 * @param colval
	 * @param page
	 * @param rows
	 * @return
	 */
    @RequestMapping(value = "/getAuthRdcList", method = RequestMethod.POST)
    @ResponseBody
    public TableData<RdcAuthEntity> getAuthRdcList(Integer type,Integer state, String coleam,String colval,int  page,int rows) {
    	PageHelper.startPage(page, rows);
    	Page<RdcAuthEntity> rdcAuthList  = this.authenMapper.getRdcAuthList( type,state, coleam, colval);
    	return TableData.newSuccess(new PageInfo<RdcAuthEntity>(rdcAuthList) );
    }
	
    /**
	 * 获得认证列表
	 * @param type
	 * @param audit
	 * @param coleam
	 * @param colval
	 * @param page
	 * @param rows
	 * @return
	 */
    @RequestMapping(value = "/updateAuthstate", method = RequestMethod.POST)
    @ResponseBody
    public boolean updateAuthstate(Integer id,Integer ishandle,Integer state,String note) {
    	this.authenMapper.updateAuthstate(id, ishandle, state,note);
    	return true;
    }
	
    
	/**
	 * 冷库认证
	 * @param request
	 * @param rdcId
	 * @param authUserId
	 * @return
	 */
	@RequestMapping(value = "/authRdc", method = RequestMethod.POST)
	@ResponseBody
	public Object authRdc(HttpServletRequest request, int rdcId, int authUserId) {
		try {
			RdcEntity rdcEntity = rdcDao.findRDCByRDCId(rdcId).get(0);
			rdcEntity.setUserId(authUserId);
			rdcEntity.setAudit(2); // 已认证
			rdcDao.updateRdc(rdcEntity);

			RdcAuthLogEntity rdcAuthLogEntity = new RdcAuthLogEntity();
			AdminEntity admin = (AdminEntity) request.getSession().getAttribute("admin");
			rdcAuthLogEntity.setType("认证审核");
			rdcAuthLogEntity.setAuthuserid(admin.getId()); // 审核人
			rdcAuthLogEntity.setApplyuserid(authUserId); // 申请人
			rdcAuthLogEntity.setChangeduserid(rdcEntity.getUserId()); // 被替换人
			rdcAuthLogEntity.setDesc("审核通过,更新冷库库主");
			rdcAuthLogDao.insert(rdcAuthLogEntity);

			RoleUser roleUserByUserId = roleUserDao.getRoleUserByUserId(authUserId); // 默认用户账号与管理员账号不会重复
			if (roleUserByUserId == null) {
				RoleUser roleUser = new RoleUser();
				roleUser.setRoleid(2); // op
				roleUser.setUserid(authUserId);
				roleUser.setAddtime(new Date());
				roleUserDao.insertSelective(roleUser);
			}
//
			RdcUser byRdcId = rdcUserDao.findByRUID(authUserId,  rdcId);//邏輯修改
			if (byRdcId == null) {
				RdcUser rdcUser = new RdcUser();
				rdcUser.setRdcid(rdcId);
				rdcUser.setUserid(authUserId);
				rdcUser.setAddtime(new Date());
				rdcUserDao.insertSelective(rdcUser);
			}
//			else {
//				byRdcId.setUserid(authUserId);
//				rdcUserDao.updateByPrimaryKeySelective(byRdcId);
//			}
				
			UserEntity user = this.userDao.findUserById(authUserId);
			if(user.getType()==UserVersion.MaintVERSION.getType()){//维修商
			   List<HashMap<String, Object>> useracl = this.aclMapper.getNACLByID("ACL_USER","UID",authUserId);
			   if(SetUtil.isnotNullList(useracl)){
				 this.aclMapper.upuserAcl(authUserId, 9, null);
			   }else{
				   this.aclMapper.adduserAcl(authUserId, 9, null);//采用默认权限。。。
			   }
			}
			return new ResultDto(0, "冷库认证审核成功！");
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultDto(-1, "冷库认证审核失败！请稍后重试！");
		}
	}

	

    
    
	
}
