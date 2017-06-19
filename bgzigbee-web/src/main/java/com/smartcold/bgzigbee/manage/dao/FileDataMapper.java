package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.FileDataEntity;

/**
 * @author MengShuang 
 * @Date 2016年6月16日 下午2:41:15
 */
public interface FileDataMapper {
	
	// category
  //冷库图片
 public static final String CATEGORY_STORAGE_PIC = "storagePic";
 //功能平面布置图
 public static final String CATEGORY_ARRANGE_PIC= "arrangePic";
  //评论的图片
 public static final String CATEGORY_COMMENT_PIC = "commentPic";
//评论的图片
 public static final String CATEGORY_HONOR_PIC = "honorPic";
  //认证图片
 public static final String CATEGORY_AUTH_PIC = "authPic";
 //用户头像
 public static final String CATEGORY_AVATAR_PIC = "userPic";


 public int deleteByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);

 public void saveFileData(FileDataEntity fileDataEntity);

 public void saveFileDatas(List<FileDataEntity> fileDataEntities);

 public int deleteById(@Param("id") Integer id);

 public List<FileDataEntity> findByBelongIdAndCategory(@Param("belongid")int belongid, @Param("category")String category);

 public Page<FileDataEntity> getAuthByFile(@Param("belongid")Integer belongid, @Param("category")String category ,@Param("description")String description);
 
}
