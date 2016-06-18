package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.FileDataEntity;

/**
 * @author MengShuang 
 * @Date 2016年6月16日 下午2:41:15
 */
public interface FileDataMapper {
	
	//文件类型
	static final String TYPE_IMAGE = "image";
	
	// category
	//冷库图片
	static final String CATEGORY_STORAGE_PIC = "storagePic";
	//功能平面布置图
	static final String CATEGORY_ARRANGE_PIC= "arrangePic";
	//评论的图片
	static final String CATEGORY_COMMENT_PIC = "commentPic";
	
	List<FileDataEntity> findByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);
	
	void saveFileData(FileDataEntity fileDataEntity);
	
	void saveFileDatas(List<FileDataEntity> fileDataEntities);
}
