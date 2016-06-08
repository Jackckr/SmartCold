package com.smartcold.zigbee.manage.service.impl;

import com.google.common.collect.Lists;
import com.smartcold.zigbee.manage.dao.CommentMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CommentService;
import com.smartcold.zigbee.manage.util.TimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:35)
 */
@Service
public class CommentServiceImpl implements CommentService {

	@Autowired
	private CommentMapper commentDao;

	@Autowired
	private UserMapper userDao;

	@Override
	public List<CommentEntity> findLastNComment(@RequestParam int rdcID, @RequestParam int npoint) {
		return commentDao.findLastNComment(rdcID, npoint);
	}

	@Override
	public List<CommentDTO> findCommentsRdcID(@RequestParam int rdcID, @RequestParam int npoint) {
		List<CommentEntity> commentDTOList = commentDao.findLastNComment(rdcID, npoint);
		List<CommentDTO> results = Lists.newArrayList();
		for (CommentEntity commentEntity : commentDTOList) {
			CommentDTO commentDTO = new CommentDTO();
			commentDTO.setId(commentEntity.getId());
			commentDTO.setRdcID(commentEntity.getRdcID());
			commentDTO.setContent(commentEntity.getContent());
			commentDTO.setFacilityGrade(commentEntity.getFacilityGrade());
			commentDTO.setGrade(commentEntity.getGrade());
			commentDTO.setLocationGrade(commentEntity.getLocationGrade());
			commentDTO.setSanitaryGrade(commentEntity.getSanitaryGrade());
			commentDTO.setServiceGrade(commentEntity.getServiceGrade());
			commentDTO.setAddTime(TimeUtil.dateToString(commentEntity.getAddTime(), ""));
			commentDTO.setPicLocation(commentEntity.getPiclocation());
			commentDTO.setCommerID(commentEntity.getCommerID());
			UserEntity userEntity = userDao.findUserById(commentEntity.getCommerID());
			commentDTO.setCommerName(userEntity.getUsername());
			results.add(commentDTO);
		}
		return results;
	}

	@Override
	public void insertComment(CommentEntity comment) {
		commentDao.insertComment(comment);
	}
}
