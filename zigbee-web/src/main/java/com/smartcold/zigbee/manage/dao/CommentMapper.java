package com.smartcold.zigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:25)
 */
public interface CommentMapper {

    List<CommentEntity> findLastNComment(@Param("rdcID") int rdcID, @Param("npoint") int npoint);

    public void insertComment(CommentEntity comment);

    List<CommentEntity> findCommentsByRdcId(@Param("rdcID") int rdcID);

    void addUsefulCnt(int id);

    /**
    * 获得睿库信息
    * @param filter
    * @return
    */
    public Page<RdcShareDTO> getSEGDList(Map<String, Object> parameters);

	Page<CommentEntity> findCommentsByUserId(int userID);
	
	int deleteByCommentID(int commentID);
    
}