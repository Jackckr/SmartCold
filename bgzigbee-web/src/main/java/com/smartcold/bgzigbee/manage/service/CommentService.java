package com.smartcold.bgzigbee.manage.service;

import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dto.CommentDTO;
import com.smartcold.bgzigbee.manage.entity.CommentEntity;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:34)
 */
public interface CommentService {

	List<CommentEntity> findLastNComment(@RequestParam int rdcID, @RequestParam int npoint);

	List<CommentDTO> findCommentsRdcID(@RequestParam int rdcID, @RequestParam int npoint);

	public void insertComment(CommentEntity comment);
	
	public PageInfo<CommentEntity> findByPage(Integer pageNum, Integer pageSize);
}
