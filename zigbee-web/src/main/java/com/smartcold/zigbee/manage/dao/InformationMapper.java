package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.InformationEntity;
/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:11:51
 *@Description: Information Mapper
 */
public interface InformationMapper {
	//产生随机资讯
	void  randinformation(Integer category);
	
	void insertInformation(InformationEntity informationEntity);
	
	void deleteInformation(@Param("inforID") int inforID);
	
	void updateInformation(InformationEntity informationEntity);

	InformationEntity findInformationByID(@Param("inforID") int inforID);
	
	Page<InformationEntity> findAllInformation(@Param("keyword")String keyword);
	
	Page<InformationEntity> findInformationByPosterID(@Param("posterID") int posterID,@Param("keyword")String keyword);
	
	Page<InformationEntity> findInformationByCategory(@Param("categoryID") int categoryID);
	
	Page<InformationEntity> findInformationList(@Param("categoryID") int categoryID);

}
