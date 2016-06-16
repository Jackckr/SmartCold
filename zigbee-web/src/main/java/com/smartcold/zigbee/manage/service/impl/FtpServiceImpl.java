package com.smartcold.zigbee.manage.service.impl;

import java.io.IOException;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.service.FtpService;

/**
 * @author jiangkaiqiang
 * @date 2016-6-7 下午8:16:03
 * @Description: implement Ftp Service
 */
@Service
public class FtpServiceImpl implements FtpService {
	private static final Logger log = LoggerFactory.getLogger(FtpServiceImpl.class);
	private FTPClient ftp;
	
	/**
	 * ftp 已经连接登录
	 * @param uploadFileEntity
	 * @return
	 * @throws IOException
	 */
	private boolean upload(UploadFileEntity uploadFileEntity) throws IOException{
		boolean result = false;
		if (!ftp.changeWorkingDirectory(BASEDIR)) {
			throw new IOException("change base working dir error!");
		}
		
		//创建目录
		String[] dirs = uploadFileEntity.getRemoteNewDir().split("/");
		for (String dir : dirs) {
			boolean isExist =  ftp.changeWorkingDirectory(dir);
			if (!isExist) {
				if (!ftp.makeDirectory(dir)) {
					log.error("ftp current working directory:"+ftp.printWorkingDirectory()+
							" ftp create "+dir+" directory failed, reply code:"+ftp.getReplyCode());
				}
				ftp.changeWorkingDirectory(dir);
			}
		}
		
		result = ftp.storeFile(uploadFileEntity.getName(), uploadFileEntity.getMultipartFile().getInputStream());
		if (!result) {
			log.error("File upload failed, upload dir:"+uploadFileEntity.getRemoteNewDir()+
					", file name:"+uploadFileEntity.getName()+
					", reply code "+ftp.getReplyCode()+" "+ftp.getReplyString());
		}
		return result;
	}

	@Override
	// 多文件上传
	public boolean uploadFileList(List<UploadFileEntity> uploadFileList) {
		boolean result = false;
		ftp = new FTPClient();
		try {
			ftp.connect(PUBURL, PORT);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(USER_NAME, PASSWORD);// 登录
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				log.error("login ftp error, "+ftp.getReplyString());
				ftp.disconnect();
				return false;
			}
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.enterLocalPassiveMode();
			
			for (UploadFileEntity uploadFile : uploadFileList) {
				upload(uploadFile);
			}
			ftp.logout();
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
		return result;
	}

	// 单个文件上传
	public boolean uploadFile(UploadFileEntity uploadFileEntity) {
		boolean result = false;
		ftp = new FTPClient();
		ftp.enterLocalPassiveMode();
		try {
			ftp.connect(PUBURL, PORT);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(USER_NAME, PASSWORD);// 登录
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				log.error("login ftp error, "+ftp.getReplyString());
				ftp.disconnect();
				return false;
			}
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.enterLocalPassiveMode();
			result = upload(uploadFileEntity);
			ftp.logout();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ftp.isConnected()) {
				try {
					ftp.disconnect();
				} catch (IOException ioe) {
					ioe.printStackTrace();
				}
			}
		}
		return result;
	}

}
