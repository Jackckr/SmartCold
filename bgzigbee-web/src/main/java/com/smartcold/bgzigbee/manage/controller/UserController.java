package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

import com.smartcold.bgzigbee.manage.dao.RdcAuthMapper;
import com.smartcold.bgzigbee.manage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
import com.smartcold.bgzigbee.manage.util.EncodeUtil;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;



@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;
	@Autowired
	private UserService userService;
	@Autowired
	private RdcAuthMapper rdcAuthMapper;

	 //
    @RequestMapping(value = "/getUserByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<UserEntity> getUserByFilter(Integer type,Integer audit,String coleam,String colval,int  page,int rows) {
    	PageHelper.startPage(page, rows);
    	Page<UserEntity> userList  = userDao.findUserByFilter( type, audit, coleam, colval);
    	return TableData.newSuccess(new PageInfo<UserEntity>(userList) );
    }

	@RequestMapping(value = "/getUserList", method = RequestMethod.POST)
	@ResponseBody
	public TableData getUserList(
			String  keyword,
			int     page,
			int     rows) {
		if(!StringUtil.isnotNull(keyword)){keyword=null;}else {keyword="%"+keyword+"%";}
		PageHelper.startPage(page, rows);
		Page<UserEntity> allUser = userDao.findAllUser(null, null, keyword);
		return TableData.newSuccess(new PageInfo<UserEntity>(allUser));
	}


	@Deprecated
	@RequestMapping(value = "/findUserList", method = RequestMethod.POST)
	@ResponseBody
	public Object findUserList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="audit", required=false) Integer audit,@RequestParam(value="type", required=false) Integer type,
			@RequestParam(value="keyword", required=false) String keyword) {
		if( !(audit == -1 || audit == 1 || audit == 0) ){audit = null;}
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		Page<UserEntity> allUser = userDao.findAllUser(audit,type,keyword);
		return new PageInfo<UserEntity>(allUser);
		
	}
	
	@RequestMapping(value = "/deleteUser", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteUser(int userID) {
		 userService.deleteUserById(userID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteByUserIDs")//
	@ResponseBody
	public Object deleteByUserIDs(Integer[] userIDs) {
	   if(userIDs!=null&&userIDs.length>0){
			for (Integer userID : userIDs) {
				userService.deleteUserById(userID);
			}
			return new BaseDto(1);
		}
	   return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeAudit", method=RequestMethod.POST)
	public Object changeAudit(int userID, int audit){
		userDao.changeAudit(userID, audit);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeLevel", method=RequestMethod.POST)
	public Object changeLevel(int userID, int vipType){
		if(vipType==0){
			rdcAuthMapper.delVipByUid(userID);
		}
		UserEntity userEntity = new UserEntity();
		userEntity.setId(userID);
		userEntity.setVipType(vipType);
		userDao.updateUser(userEntity);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeUserType", method=RequestMethod.POST)
	public Object changeUserType(String ids, int type){
		try {
			userDao.changeUserType(ids, type);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	@ResponseBody
	@RequestMapping(value="/changeAudits", method=RequestMethod.POST)
	public Object changeAudits(int[] userIDs, int audit){
		for(int userID:userIDs)
			userDao.changeAudit(userID, audit);
		return new BaseDto(0);
	}
	
	@RequestMapping(value = "/addUser")
	@ResponseBody
	public Object addUser(UserEntity user) throws UnsupportedEncodingException {
		if (StringUtil.isNull(user.getUsername())|| StringUtil.isNull(user.getPassword())) {return new ResultDto(-1, "用户名和密码不能为空");}
		user.setUsername(URLDecoder.decode(user.getUsername(), "UTF-8"));
		user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
		user.setType(0);
		user.setAudit(0);
		userDao.insertUser(user);
		return new BaseDto(0);
	}
	
	
	
	@RequestMapping(value = "/addorupdateUser",method=RequestMethod.POST)
	@ResponseBody
	public Object addorupdateUser(UserEntity user) {
		try {
			if(StringUtil.isNull(user.getUsername())||(user.getId()==0&&StringUtil.isNull(user.getPassword()))){return new ResultDto(-1, "用户名不能为空");}
			if(user.getId()==0){//添加
				user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
				userDao.insertUser(user);
			}else{
				//修改
				user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
				userDao.updateUser(user);
			}
			return new BaseDto(0);
		} catch (Exception e) {
			e.printStackTrace();
			return new BaseDto(-1);
		}
	}

//	@Deprecated
	@ResponseBody
	@RequestMapping(value = "/checkUserName")
	public Object checkUserName(@RequestParam("value") String username) {
		username = StringUtils.trimAllWhitespace(username);
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(userDao.findUserByName(username)==null? true:false);
		return ngRemoteValidateDTO;
	}
	
	@ResponseBody
	@RequestMapping(value = "/vistUserName")
	public Object vistUserName(String username) {
		if(StringUtil.isNull(username)){return true;}
	    return this.userDao.findUserByName(username)==null? true:false;
	}

	@ResponseBody
	@RequestMapping(value = "/auditVipUser")
	public ResultDto auditVipUser(int userId,int vipType) {
		UserEntity userEntity = new UserEntity();
		userEntity.setId(userId);
		userEntity.setVipType(vipType);
		userEntity.setUpdateTime(new Date());
		userDao.updateUser(userEntity);
		return new ResultDto(1,"认证成功！");
	}

	@ResponseBody
	@RequestMapping(value = "/getUsernameById")
	public String getUsernameById(int userId) {
		UserEntity user = userDao.findUserById(userId);
		if(user!=null){
			return user.getUsername();
		}
		return "";
	}
}
