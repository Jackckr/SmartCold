package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.UserEntity;



@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;

	@RequestMapping(value = "/findUserList", method = RequestMethod.GET)
	@ResponseBody
	public Object findUserList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="audit", required=false) Integer audit) {
		if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		return userDao.findAllUser(audit);
	}
	
	@RequestMapping(value = "/deleteUser", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteUser(int userID) {
		 userDao.deleteUser(userID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteByUserIDs", method=RequestMethod.DELETE)
	@ResponseBody
	public Object deleteByUserIDs(Integer[] userIDs) {
		for(Integer userID:userIDs){
			userDao.deleteUser(userID);
		}
		return new BaseDto(0);
	}
	
	@RequestMapping(value = "/addUser", method = RequestMethod.GET)
	@ResponseBody
	public Object addUser(UserEntity user) {
		if (user.getUsername() == null || user.getPassword() == null) {
			return new ResultDto(-1, "用户名和密码不能为空");
		}
		userDao.insertUser(user);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value = "/checkUserName", method = RequestMethod.GET)
	public Object checkUserName(@RequestParam("value") String username) {
		username = StringUtils.trimAllWhitespace(username);
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(userDao.findUserByName(username)==null? true:false);
		return ngRemoteValidateDTO;
	}
}
