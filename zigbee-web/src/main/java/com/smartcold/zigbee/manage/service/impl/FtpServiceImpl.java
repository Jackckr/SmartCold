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

	@Override
	// 多文件上传
	public boolean uploadFileList(List<UploadFileEntity> uploadFileList) {
		boolean result = false;
		ftp = new FTPClient();
		try {
			for (UploadFileEntity uploadFile : uploadFileList) {
				int reply;
				ftp.connect(PUBURL, PORT);// 连接FTP服务器
				// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
				ftp.login(USER_NAME, PASSWORD);// 登录
				reply = ftp.getReplyCode();
				if (!FTPReply.isPositiveCompletion(reply)) {
					ftp.disconnect();
					return false;
				}

				ftp.setFileType(FTPClient.BINARY_FILE_TYPE);

				if (!ftp.changeWorkingDirectory(BASEDIR)) {
					throw new IOException("change base working dir error!");
				}

				//创建目录
				String[] dirs = uploadFile.getRemoteNewDir().split("/");
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

				result = ftp.storeFile(uploadFile.getName(), uploadFile.getMultipartFile().getInputStream());
				if (!result) {
					log.error("File upload failed, upload dir:"+uploadFile.getRemoteNewDir()+
							", file name:"+uploadFile.getName()+
							", reply code"+ftp.getReplyCode());
				}
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
	public boolean uploadFile(UploadFileEntity uploadFile) {
		boolean result = false;
		ftp = new FTPClient();
		ftp.enterLocalPassiveMode();
		try {
			int reply;
			ftp.connect(PUBURL, PORT);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(USER_NAME, PASSWORD);// 登录
			reply = ftp.getReplyCode();
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftp.disconnect();
				return false;
			}
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);

			if (!ftp.changeWorkingDirectory(BASEDIR)) {
				throw new IOException("change base working dir error!");
			}
			
			//创建目录
			String[] dirs = uploadFile.getRemoteNewDir().split("/");
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
			
			result = ftp.storeFile(uploadFile.getName(), uploadFile.getMultipartFile().getInputStream());
			if (!result) {
				log.error("File upload failed, upload dir:"+uploadFile.getRemoteNewDir()+
						", file name:"+uploadFile.getName()+
						", reply code "+ftp.getReplyCode()+" "+ftp.getReplyString());
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

}
