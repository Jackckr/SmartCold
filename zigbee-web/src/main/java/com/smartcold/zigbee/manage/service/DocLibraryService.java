package com.smartcold.zigbee.manage.service;


import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.smartcold.zigbee.manage.entity.DocumentBean;
import com.smartcold.zigbee.manage.entity.UserEntity;

public interface DocLibraryService {

	
	
	public List<DocumentBean> handleFile(HttpServletRequest r,UserEntity user) throws IOException ;
	
	public List<DocumentBean> queryFileInfo(DocumentBean bean);
}
