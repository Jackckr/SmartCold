package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.service.NewDoorService;

@Controller
@RequestMapping("/newDoor")
@ResponseBody
public class NewDoorController {
	
	@Autowired
	NewDoorService newDoorService;

	@RequestMapping("/getDoorStatusByNums")
	public Object getDoorStatusByNums(Integer oid, 
			@RequestParam(value="nums",defaultValue="480")Integer nums){
		return newDoorService.getDoorStatusByNums(oid, nums);
	}
}
