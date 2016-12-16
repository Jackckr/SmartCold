package com.smartcold.zigbee.manage.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.dto.PersonalCommentDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:34)
 */
public interface CommentService {

	public CommentEntity getCommentById(int id);
	
	public void insertComment(CommentEntity comment);
	
	List<CommentEntity> findLastNComment(@RequestParam int rdcID, @RequestParam int npoint);

	List<CommentDTO> findCommentsRdcID(@RequestParam int rdcID, @RequestParam int npoint);


	Page<PersonalCommentDTO> findCommentsUserID(int userID,int pageNum,int pageSize);
}
