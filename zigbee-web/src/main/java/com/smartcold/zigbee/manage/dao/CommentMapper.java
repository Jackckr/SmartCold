package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.CommentEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-04-28 20:25)
 */
public interface CommentMapper {

    List<CommentEntity> findLastNComment(@Param("rdcID") int rdcID, @Param("npoint") int npoint);

}
