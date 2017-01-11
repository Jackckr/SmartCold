package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.dto.UploadFileEntity;

public interface FtpService {

	public final static String HOST = "10.25.192.102";

	public final static String PUB_HOST = "139.196.189.93";

	public final static String USER_NAME = "pwftp";

	public final static String PASSWORD = "!@QWaszx0o";

	public final static int PORT = 2021;

	public final static String BASEDIR = "/data";

	public final static int READPORT = 8089;
	
	public final static String READ_URL = "http://139.196.189.93:8089/";

	boolean uploadFile(UploadFileEntity uploadFile);

	boolean uploadFileList(List<UploadFileEntity> uploadFileList);
	
	boolean deleteFile(String url);

	boolean deleteByLocation(String location);
}
