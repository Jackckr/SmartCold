package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.ComMessageReadEntity;
/**
 * 
 * @author kaiqiang jiang
 * @version 创建时间：2016-9-13 上午11:41:07
 * 全局消息已读标示
 */
public interface ComMessageReadMapper {

	ComMessageReadEntity findComMessageReadByUserID(@Param("userID") int userID);
	
	void insertComMessageRead(ComMessageReadEntity comMessageReadEntity);
	
}
