package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.CommentEntity;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:25)
 */
public interface CommentMapper {

    List<CommentEntity> findLastNComment(@Param("rdcID") int rdcID, @Param("npoint") int npoint);

    public void insertComment(CommentEntity comment);

    List<CommentEntity> findCommentsByRdcId(@Param("rdcID") int rdcID);
    
    Page<CommentEntity> findByPage();
    
    int deleteCommentByID(int id);

}