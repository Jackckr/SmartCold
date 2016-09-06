package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.InforCategoryEntity;

/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:11:51
 *@Description: InforCategory Mapper
 */
public interface InforCategoryMapper {

	InforCategoryEntity findInforCategoryByID(@Param("categoryID") int categoryID);
	
	Page<InforCategoryEntity> findAllInforCategory();

	void insertInforCategory(InforCategoryEntity inforCategoryEntity);
	
	void deleteInforCategory(@Param("categoryID") int categoryID);
	
	void updateInforCategory(InforCategoryEntity inforCategoryEntity);
}
