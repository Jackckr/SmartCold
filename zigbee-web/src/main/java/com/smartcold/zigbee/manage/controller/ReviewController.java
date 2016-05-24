package com.smartcold.zigbee.manage.controller;

import java.io.File;
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
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;

@Controller
@RequestMapping(value = "/review")
public class ReviewController {

	private static String dir = "/data/picture";

	@Autowired
	private CommentMapper commentDao;

	@RequestMapping(value = "/add", method = RequestMethod.POST)
	@ResponseBody
	public Object add(@RequestParam(required = false) MultipartFile file0,
			@RequestParam(required = false) MultipartFile file1, @RequestParam(required = false) MultipartFile file2,
			@RequestParam(required = false) MultipartFile file3, @RequestParam(required = false) MultipartFile file4,
			CommentDTO commentDto, HttpServletRequest request) throws Exception {
		MultipartFile[] files = { file0, file1, file2, file3, file4 };
		CommentEntity commentEntity = new CommentEntity();
		UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		List<String> picLocations = new ArrayList<String>();
		Gson gson = new Gson();

		commentEntity.setCommerID(user.getId());
		commentEntity.setContent(URLDecoder.decode(commentDto.getContent(), "UTF-8"));
		commentEntity.setGrade(commentDto.getGrade());
		commentEntity.setFacilityGrade(commentDto.getFacilityGrade());
		commentEntity.setLocationGrade(commentDto.getLocationGrade());
		commentEntity.setSanitaryGrade(commentDto.getSanitaryGrade());
		commentEntity.setServiceGrade(commentDto.getServiceGrade());
		commentEntity.setRdcID(commentDto.getRdcID());

		for (MultipartFile file : files) {
			if (file == null) {
				break;
			}
			String fileName = String.format("storage%s_%s.%s", commentDto.getRdcID(), new Date().getTime(), "jpg");

			File targetFile = new File(dir, fileName);
			try {
				file.transferTo(targetFile);
				picLocations.add(dir + "/" + fileName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		commentEntity.setPiclocation(gson.toJson(picLocations));
		commentDao.insertComment(commentEntity);

		return new BaseDto(0);
	}

	@RequestMapping(value = "/download", method = RequestMethod.GET)
	@ResponseBody
	public Object download(int picId) {

		return null;
	}
}
