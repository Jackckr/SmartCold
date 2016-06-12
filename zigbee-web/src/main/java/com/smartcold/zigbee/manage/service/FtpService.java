package com.smartcold.zigbee.manage.service;

import java.util.List;

import com.smartcold.zigbee.manage.dto.UploadFileEntity;

public interface FtpService {

	public final static String URL = "10.25.192.102";

	public final static String USER_NAME = "pwftp";

	public final static String PASSWORD = "!@QWaszx";

	public final static int PORT = 2021;

	public final static String BASEDIR = "data";

	public final static int READPORT = 8089;

	boolean uploadFile(UploadFileEntity uploadFile);

	boolean uploadFileList(List<UploadFileEntity> uploadFileList);
}
