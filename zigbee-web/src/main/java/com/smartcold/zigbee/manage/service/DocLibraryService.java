package com.smartcold.zigbee.manage.service;


import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类->提供文件操作
 * Create on MaQiang 2016-6-25 09:28:36
 */
public interface DocLibraryService {
	
	public List<FileDataEntity> queryFileInfo(FileDataEntity bean);

	public List<FileDataEntity> handleFile(HttpServletRequest r,UserEntity user) throws IOException ;
	
	public  List<FileDataEntity> handleFile(int dataID,String type,UserEntity user,HttpServletRequest request)throws IOException;

	public  List<FileDataEntity> handleWMFile(int dataID,String type,UserEntity user,HttpServletRequest request)throws IOException;

	
}
