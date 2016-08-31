package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.InforCategoryMapper;
import com.smartcold.bgzigbee.manage.dao.InformationMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.InformationEntity;

@Controller
@RequestMapping(value = "/information")
public class InformationController extends BaseController {

	@Autowired
	private InformationMapper informationDao;
	@Autowired
	private InforCategoryMapper inforCategoryDao;
	
	@RequestMapping(value = "/findAllInformation")
	@ResponseBody
	public Object findAllInformation(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			//@RequestParam(value="audit", required=false) Integer audit,
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
	    /*	if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}*/
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if(keyword.equals("undefined"))
			keyword = null;
		/*else{
		    keyword = URLDecoder.decode(keyword, "UTF-8");
		}*/
		return new PageInfo<InformationEntity>(informationDao.findAllInformation(keyword));
		
	}
	
	@RequestMapping(value = "/deleteInformation", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteInformation(int inforID) {
		 informationDao.deleteInformation(inforID);
		 return new BaseDto(0);
	}

	@RequestMapping(value = "/addInformation", method = RequestMethod.GET)
	@ResponseBody
	public Object addInformation(InformationEntity information) throws UnsupportedEncodingException {
		if (information.getTitle() == null || information.getContent() == null) {
			return new ResultDto(-1, "标题和内容不能为空");
		}
		informationDao.insertInformation(information);
		return new BaseDto(0);
	}
	
	@RequestMapping(value = "/findAllInforCategory", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllInforCategory() {
		return inforCategoryDao.findAllInforCategory();
	}
	
	/*@ResponseBody
	@RequestMapping(value="/changeAudit", method=RequestMethod.POST)
	public Object changeAudit(int userID, int audit){
		userDao.changeAudit(userID, audit);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeAudits", method=RequestMethod.POST)
	public Object changeAudits(int[] userIDs, int audit){
		for(int userID:userIDs)
			userDao.changeAudit(userID, audit);
		return new BaseDto(0);
	}*/
	
}
