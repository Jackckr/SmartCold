package com.smartcold.zigbee.manage.service;

import com.smartcold.zigbee.manage.dto.CommentDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:34)
 */
public interface CommentService {

	List<CommentEntity> findLastNComment(@RequestParam int rdcID, @RequestParam int npoint);

	List<CommentDTO> findCommentsRdcID(@RequestParam int rdcID, @RequestParam int npoint);

	public void insertComment(CommentEntity comment);
}
