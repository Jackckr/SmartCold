package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.FileDataEntity;


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
	static final String CATEGORY_SHARE_PIC = "sharePic";
	//资质荣誉图片
	static final String CATEGORY_HONOR_PIC = "honorPic";
	//用户头像
	static final String CATEGORY_AVATAR_PIC = "userPic";
	//认证图片
	static final String CATEGORY_AUTH_PIC = "authPic";

	List<FileDataEntity> findByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);
	
	void saveFileData(FileDataEntity fileDataEntity);
	
	void saveFileDatas(List<FileDataEntity> fileDataEntities);

	int deleteByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);

	int deleteById(@Param("id") Integer id);
}
