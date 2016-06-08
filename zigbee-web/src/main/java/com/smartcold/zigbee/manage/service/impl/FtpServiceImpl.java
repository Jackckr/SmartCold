package com.smartcold.zigbee.manage.service.impl;


import java.io.IOException;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.service.FtpService;
/**
 * @author jiangkaiqiang
 * @date 2016-6-7 下午8:16:03  
 * @Description: implement Ftp Service
 */
public class FtpServiceImpl implements FtpService {
	private FTPClient ftp;
	@Override
	  /**   
	    * @param url FTP服务器hostname   
	    * @param port FTP服务器端口   
	    * @param username FTP登录账号   
	    * @param password FTP登录密码    
	    * @param uploadFileList 文件上传实体类列表  
	    * @return 成功返回true，否则返回false   
	    */    
	//多文件上传
		public  boolean uploadFileList(String url,// FTP服务器hostname
				int port,// FTP服务器端口
				String username, // FTP登录账号
				String password, // FTP登录密码
				List<UploadFileEntity> uploadFileList // 输入文件路径-List
		) {
		boolean success = false;
		ftp = new FTPClient();
		try {
			for (UploadFileEntity uploadFile : uploadFileList) {
				int reply;
				ftp.connect(url, port);// 连接FTP服务器
				// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
				ftp.login(username, password);// 登录
				reply = ftp.getReplyCode();
				if (!FTPReply.isPositiveCompletion(reply)) {
					ftp.disconnect();
					return success;
				}

				if (!ftp.changeWorkingDirectory(uploadFile.getRemoteDir())) {
					ftp.makeDirectory(uploadFile.getRemoteDir());
				}
				ftp.changeWorkingDirectory(uploadFile.getRemoteDir());
				if (!ftp.changeWorkingDirectory(uploadFile.getRemoteNewDir())) {
					ftp.makeDirectory(uploadFile.getRemoteNewDir());
				}
				ftp.changeWorkingDirectory(uploadFile.getRemoteNewDir());

				ftp.storeFile(uploadFile.getName(), uploadFile
						.getMultipartFile().getInputStream());
				}
				ftp.logout();
				success = true;
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				if (ftp.isConnected()) {
					try {
						ftp.disconnect();
					} catch (IOException ioe) {
					}
				}
			}
			return success;
		}
	//单个文件上传
	public  boolean uploadFile(String url,// FTP服务器hostname
			int port,// FTP服务器端口
			String username, // FTP登录账号
			String password, // FTP登录密码
			UploadFileEntity uploadFile // 输入文件路径-List
	) {
		boolean success = false;
	    ftp = new FTPClient();
		try {
			
				int reply;
				ftp.connect(url, port);// 连接FTP服务器
				// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
				ftp.login(username, password);// 登录
				reply = ftp.getReplyCode();
				if (!FTPReply.isPositiveCompletion(reply)) {
					ftp.disconnect();
				return success;
			}
				
			if (!ftp.changeWorkingDirectory(uploadFile.getRemoteDir())) {
					ftp.makeDirectory(uploadFile.getRemoteDir());
			}
			ftp.changeWorkingDirectory(uploadFile.getRemoteDir());
			if (!ftp.changeWorkingDirectory(uploadFile.getRemoteNewDir())) {
				ftp.makeDirectory(uploadFile.getRemoteNewDir());
			}
			ftp.changeWorkingDirectory(uploadFile.getRemoteNewDir());
			
			ftp.storeFile(uploadFile.getName(), uploadFile.getMultipartFile()
					.getInputStream());

			ftp.logout();
			success = true;
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ftp.isConnected()) {
				try {
					ftp.disconnect();
				} catch (IOException ioe) {
				}
			}
		}
		return success;
	}
}
