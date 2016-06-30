package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.UserMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;



@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;

	@RequestMapping(value = "/findUserList", method = RequestMethod.GET)
	@ResponseBody
	public Object findUserList() {
		return userDao.findAllUser();
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
}
