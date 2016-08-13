package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.FileDataEntity;

/**
 * @author MengShuang 
 * @Date 2016年6月16日 下午2:41:15
 */
public interface FileDataMapper {
	
	// category
	//冷库图片
	static final String CATEGORY_STORAGE_PIC = "storagePic";
	//功能平面布置图
	static final String CATEGORY_ARRANGE_PIC= "arrangePic";
	//评论的图片
	static final String CATEGORY_COMMENT_PIC = "commentPic";
	//评论的图片
	static final String CATEGORY_HONOR_PIC = "honorPic";
	//认证图片
	static final String CATEGORY_AUTH_PIC = "authPic";
	
	List<FileDataEntity> findByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);
	
	int deleteByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);
	
	void saveFileData(FileDataEntity fileDataEntity);
	
	void saveFileDatas(List<FileDataEntity> fileDataEntities);
	
	int deleteById(@Param("id") Integer id);
}
