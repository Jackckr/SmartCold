package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.InforCategoryMapper;
import com.smartcold.bgzigbee.manage.dao.InformationMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.dto.UploadFileEntity;
import com.smartcold.bgzigbee.manage.entity.InformationEntity;
import com.smartcold.bgzigbee.manage.service.FtpService;
/**
 * 资讯controller
 * @author jkq
 *
 */
@Controller
@RequestMapping(value = "/information")
public class InformationController extends BaseController {
	private static String baseDir = "picture";
	@Autowired
	private FtpService ftpService;
	@Autowired
	private InformationMapper informationDao;
	@Autowired
	private InforCategoryMapper inforCategoryDao;
	
	/**
	 * 为后台管理员操作提供查询服务
	 * @param pageNum
	 * @param pageSize
	 * @param posterID
	 * @param keyword
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping(value = "/findAllInformationForAdmin")
	@ResponseBody
	public Object findAllInformationForAdmin(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="posterID") Integer posterID, 
			//@RequestParam(value="audit", required=false) Integer audit,
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
	    /*	if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}*/
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if (posterID!=1) {
			return new PageInfo<InformationEntity>(informationDao.findInformationByPosterID(posterID,keyword));
		}
		else {
			return new PageInfo<InformationEntity>(informationDao.findAllInformation(keyword));
		}
	}
	
	
	/**
	 * 为前台user资讯查询提供服务
	 * @param pageNum
	 * @param pageSize
	 * @param keyword
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping(value = "/findAllInformationForUser")
	@ResponseBody
	public Object findAllInformationForUser(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 10:pageSize;
		PageHelper.startPage(pageNum, pageSize);
	    return new PageInfo<InformationEntity>(informationDao.findAllInformation(keyword));
	}
	
	/**
	 * 删除资讯
	 * @param inforID
	 * @return
	 */
	@RequestMapping(value = "/deleteInformation")
	@ResponseBody
	public Object deleteInformation(int inforID) {
		 informationDao.deleteInformation(inforID);
		 return new BaseDto(0);
	}
	
	/**
	 * 根据资讯id查找资讯
	 * @param inforID
	 * @return
	 */
	@RequestMapping(value = "/findInformationByID")
	@ResponseBody
	public Object findInformationByID(@RequestParam int inforID) {
		return informationDao.findInformationByID(inforID);
	}
	
	/**
	 * 添加和修改资讯公用服务，根据id是否为空判断是发布或是修改
	 * @param information
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value = "/addInformation")
	@ResponseBody
	public Object addInformation( @RequestParam(required = false) MultipartFile uploadcoverpic,InformationEntity information) throws Exception {
		if (information.getTitle() == null || information.getContent() == null) {
			return new ResultDto(-1, "标题和内容不能为空");
		}
		String dir = String.format("%s/rdc/%s", baseDir, information.getId());
		if (uploadcoverpic != null) {
			String fileName = String.format("information%s_%s.%s", information.getId(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, uploadcoverpic, dir);
			ftpService.uploadFile(uploadFileEntity);
			information.setCoverpic(FtpService.READ_URL+dir + "/" + fileName);
		}
		else {
			  throw new Exception("资讯上传图片时，封面图片为空异常");
		}
		if (information.getId()!=0) {
			
			informationDao.updateInformation(information);
		}
		else {
			informationDao.insertInformation(information);
		}
		return new BaseDto(0);
	}
	
	/**
	 * 查询所有的资讯类别
	 * @return
	 */
	@RequestMapping(value = "/findAllInforCategory")
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
