package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

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
import com.smartcold.bgzigbee.manage.util.SetUtil;
import com.smartcold.bgzigbee.manage.util.TableData;



@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;
	
	 //
    @RequestMapping(value = "/getUserByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<UserEntity> getUserByFilter(Integer type,Integer audit, String  keyword,int  page,int rows) {
    	PageHelper.startPage(page, rows);
    	Page<UserEntity> userList  = userDao.findAllUser(audit,type,keyword);
    	return TableData.newSuccess(new PageInfo<UserEntity>(userList) );
    }
	
	
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
		 userDao.deleteUser(userID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteByUserIDs")//
	@ResponseBody
	public Object deleteByUserIDs(Integer[] userIDs) {
	   if(userIDs!=null&&userIDs.length>0){
			for (Integer userID : userIDs) {
				userDao.deleteUser(userID);
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
	
	@RequestMapping(value = "/addUser", method = RequestMethod.GET)
	@ResponseBody
	public Object addUser(UserEntity user) throws UnsupportedEncodingException {
		if (user.getUsername() == null || user.getPassword() == null) {
			return new ResultDto(-1, "用户名和密码不能为空");
		}
		user.setUsername(URLDecoder.decode(user.getUsername(), "UTF-8"));
		user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
		userDao.insertUser(user);
		return new BaseDto(0);
	}

	@ResponseBody
	@RequestMapping(value = "/checkUserName")
	public Object checkUserName(@RequestParam("value") String username) {
		username = StringUtils.trimAllWhitespace(username);
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(userDao.findUserByName(username)==null? true:false);
		return ngRemoteValidateDTO;
	}
}
