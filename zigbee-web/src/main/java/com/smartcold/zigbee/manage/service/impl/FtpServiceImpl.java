package com.smartcold.zigbee.manage.service.impl;

import java.io.IOException;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
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
	private FTPClient ftp;

	@Override
	// 多文件上传
	public boolean uploadFileList(List<UploadFileEntity> uploadFileList) {
		boolean success = false;
		ftp = new FTPClient();
		try {
			for (UploadFileEntity uploadFile : uploadFileList) {
				int reply;
				String dir = uploadFile.getRemoteNewDir();
				ftp.connect(URL, PORT);// 连接FTP服务器
				// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
				ftp.login(USER_NAME, PASSWORD);// 登录
				reply = ftp.getReplyCode();
				if (!FTPReply.isPositiveCompletion(reply)) {
					ftp.disconnect();
					return success;
				}

				ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
				ftp.enterLocalPassiveMode();

				if (!ftp.changeWorkingDirectory(BASEDIR)) {
					throw new IOException("change base working dir error!");
				}

				String[] dirs = dir.split("/");
				for (String nextDir : dirs) {
					if (!ftp.changeWorkingDirectory(nextDir)) {
						ftp.makeDirectory(nextDir);
					}
					ftp.changeWorkingDirectory(nextDir);
				}

				ftp.storeFile(uploadFile.getName(), uploadFile.getMultipartFile().getInputStream());
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

	// 单个文件上传
	public boolean uploadFile(UploadFileEntity uploadFile) {
		boolean success = false;
		ftp = new FTPClient();
		try {
			String dir = uploadFile.getRemoteNewDir();
			int reply;
			ftp.connect(URL, PORT);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(USER_NAME, PASSWORD);// 登录
			reply = ftp.getReplyCode();
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftp.disconnect();
				return success;
			}
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.enterLocalPassiveMode();

			if (!ftp.changeWorkingDirectory(BASEDIR)) {
				throw new IOException("change base working dir error!");
			}

			String[] dirs = dir.split("/");
			for (String nextDir : dirs) {
				if (!ftp.changeWorkingDirectory(nextDir)) {
					if (!ftp.makeDirectory(nextDir)) {
						throw new IOException(String.format("can't make dir<%s>", nextDir));
					}
				}
				ftp.changeWorkingDirectory(nextDir);
			}

			boolean storeFile = ftp.storeFile(uploadFile.getName(), uploadFile.getMultipartFile().getInputStream());

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
