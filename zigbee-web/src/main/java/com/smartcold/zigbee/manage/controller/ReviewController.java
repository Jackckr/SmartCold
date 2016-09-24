package com.smartcold.zigbee.manage.controller;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.smartcold.zigbee.manage.dao.CommentMapper;
import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.FtpService;

@Controller
@RequestMapping(value = "/review")
public class ReviewController {
	private static String basedir = "picture";

	@Autowired
	private CommentMapper commentDao;

	@Autowired
	private FtpService ftpService;
	
	@Autowired
	private FileDataMapper fileDataDao;

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public Object add(@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			CommentDTO commentDto, HttpServletRequest request) throws Exception {
		MultipartFile[] files = { file0, file1, file2, file3, file4 };
		CommentEntity commentEntity = new CommentEntity();
		UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		String dir = String.format("%s/review/%s", basedir, commentDto.getRdcID());
		if(user!=null){
		commentEntity.setCommerID(user.getId());
		}
		else {
			commentEntity.setCommerID(commentDto.getCommerID());
		}
		commentEntity.setContent(URLDecoder.decode(commentDto.getContent(), "UTF-8"));
		commentEntity.setGrade(commentDto.getGrade());
		commentEntity.setFacilityGrade(commentDto.getFacilityGrade());
		commentEntity.setLocationGrade(commentDto.getLocationGrade());
		commentEntity.setSanitaryGrade(commentDto.getSanitaryGrade());
		commentEntity.setServiceGrade(commentDto.getServiceGrade());
		commentEntity.setRdcID(commentDto.getRdcID());

		commentDao.insertComment(commentEntity);
		
		List<FileDataEntity> reviewPics = new ArrayList<FileDataEntity>();
		for (MultipartFile file : files) {
			if (file == null) {
				continue;
			}
			String fileName = String.format("storage%s_%s.%s", commentDto.getRdcID(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
			ftpService.uploadFile(uploadFileEntity);
			FileDataEntity reviewPic = new FileDataEntity(file.getContentType(), dir + "/" + fileName, 
					FileDataMapper.CATEGORY_COMMENT_PIC, commentEntity.getId(), fileName);
			reviewPics.add(reviewPic);
		}
		if (!reviewPics.isEmpty()) {
			fileDataDao.saveFileDatas(reviewPics);
		}

		return new BaseDto(0);
	}

	@RequestMapping(value = "/download", method = RequestMethod.GET)
	@ResponseBody
	public Object download(int picId) {

		return null;
	}
}
