package com.smartcold.zigbee.manage.service;

import java.util.List;

import com.smartcold.zigbee.manage.dto.UploadFileEntity;


public interface FtpService {
	
	boolean uploadFile(String url,// FTP服务器hostname
			int port,// FTP服务器端口
			String username, // FTP登录账号
			String password, // FTP登录密码
			List<UploadFileEntity> uploadFileList // 输入文件路径-List
	);
}
