package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.MsgCategoryEntity;

/**
 * 
 * @author kaiqiang jiang
 * @version 创建时间：2016-9-13 上午11:50:34
 * Message Category Mapper
 */
public interface MsgCategoryMapper {

	MsgCategoryEntity findMsgCategoryByID(@Param("categoryID") int categoryID);
	
	Page<MsgCategoryEntity> findAllMsgCategory();

	void insertMsgCategory(MsgCategoryEntity MsgCategoryEntity);
	
	void deleteMsgCategory(@Param("categoryID") int categoryID);
	
	void updateMsgCategory(MsgCategoryEntity MsgCategoryEntity);
}
