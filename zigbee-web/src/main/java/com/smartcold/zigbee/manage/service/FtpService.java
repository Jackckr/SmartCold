package com.smartcold.zigbee.manage.service;

import java.util.List;

import com.smartcold.zigbee.manage.dto.UploadFileEntity;


public interface FtpService {
	
	boolean uploadFile(UploadFileEntity uploadFile );
	boolean uploadFileList(List<UploadFileEntity> uploadFileList);
}
