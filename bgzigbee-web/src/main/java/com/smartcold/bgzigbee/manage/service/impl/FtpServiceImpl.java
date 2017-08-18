package com.smartcold.bgzigbee.manage.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import com.smartcold.bgzigbee.manage.util.WatermarkUtil;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.smartcold.bgzigbee.manage.dto.UploadFileEntity;
import com.smartcold.bgzigbee.manage.service.FtpService;

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
		InputStream watermarkImg = WatermarkUtil.watermarkImg(uploadFileEntity.getMultipartFile());
		result = ftp.storeFile(uploadFileEntity.getName(),watermarkImg);
		if (!result) {
			log.error("File upload failed, upload dir:"+uploadFileEntity.getRemoteNewDir()+
					", file name:"+uploadFileEntity.getName()+
					", reply code "+ftp.getReplyCode()+" "+ftp.getReplyString());
		}
		return result;
	}
	
	private void connectFtp() throws IOException{
		ftp = new FTPClient();
		ftp.connect(PUB_HOST, PORT);// 连接FTP服务器
		// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
		ftp.login(USER_NAME, PASSWORD);// 登录
		if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
			log.error("login ftp error, "+ftp.getReplyString());
			ftp.disconnect();
		}
		ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
		ftp.enterLocalPassiveMode();
	}
	
	private void closeFtp() throws IOException{
		ftp.logout();
	}

	@Override
	// 多文件上传
	public boolean uploadFileList(List<UploadFileEntity> uploadFileList) {
		boolean result = false;
		
		try {
			connectFtp();
			for (UploadFileEntity uploadFile : uploadFileList) {
				upload(uploadFile);
			}
			closeFtp();
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
		
		try {
			connectFtp();
			result = upload(uploadFileEntity);
			closeFtp();
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
	
	public boolean deleteFile(String url){
		String hostUrl = PUB_HOST+":"+READPORT;
		int index = url.indexOf(hostUrl);
		String location = url.substring(index+hostUrl.length());
		return deleteByLocation(location);
	}
	
	public boolean deleteByLocation(String location){
		boolean deleted = false;
		try {
			connectFtp();
			
			deleted = ftp.deleteFile(BASEDIR+"/"+location);
			
			if (!deleted) {
				log.error("delete file failed, pathname:"+BASEDIR+"/"+location +
						","+ftp.getReplyString());
			}
			closeFtp();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return deleted;
	}
}
