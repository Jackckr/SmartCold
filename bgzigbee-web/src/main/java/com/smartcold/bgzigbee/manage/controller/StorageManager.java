package com.smartcold.bgzigbee.manage.controller;


import com.baidu.ueditor.define.BaseState;
import com.baidu.ueditor.define.State;
import com.smartcold.bgzigbee.manage.dto.UploadFileEntity;
import com.smartcold.bgzigbee.manage.service.FtpService;
import com.smartcold.bgzigbee.manage.service.impl.FtpServiceImpl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.mockito.internal.matchers.Equals;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StorageManager
{
	private static FTPClient ftp;
    
    public static final int BUFFER_SIZE = 8192;

	private static final Logger log = LoggerFactory.getLogger(StorageManager.class);
	
  public static State saveBinaryFile(byte[] data, String path)
  {
    File file = new File(path);

    State state = valid(file);

    if (!state.isSuccess()) {
      return state;
    }
    try
    {
      BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream(file));
      bos.write(data);
      bos.flush();
      bos.close();
    } catch (IOException ioe) {
      return new BaseState(false, 4);
    }

    state = new BaseState(true, file.getAbsolutePath());
    state.putInfo("size", data.length);
    state.putInfo("title", file.getName());
    return state;
  }

  public static State saveFileByInputStream(InputStream is, String path, long maxSize)
  {
    State state = null;

    File tmpFile = getTmpFile();

    byte[] dataBuf = new byte[2048];
    BufferedInputStream bis = new BufferedInputStream(is, 8192);
    try
    {
      BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream(tmpFile), 8192);

      int count = 0;
      while ((count = bis.read(dataBuf)) != -1) {
        bos.write(dataBuf, 0, count);
      }
      bos.flush();
      bos.close();

      if (tmpFile.length() > maxSize) {
        tmpFile.delete();
        return new BaseState(false, 1);
      }

      state = saveTmpFile(tmpFile, path);

      if (!state.isSuccess()) {
        tmpFile.delete();
      }

      return state;
    }
    catch (IOException localIOException) {
    }
    return new BaseState(false, 4);
  }

  public static State saveFileByInputStream(InputStream is, String path) {
    State state = null;

    File tmpFile = getTmpFile();

    byte[] dataBuf = new byte[2048];
    BufferedInputStream bis = new BufferedInputStream(is, 8192);
    try
    {
      BufferedOutputStream bos = new BufferedOutputStream(
        new FileOutputStream(tmpFile), 8192);

      int count = 0;
      while ((count = bis.read(dataBuf)) != -1) {
        bos.write(dataBuf, 0, count);
      }
      bos.flush();
      bos.close();

      state = saveTmpFile(tmpFile, path);

      if (!state.isSuccess()) {
        tmpFile.delete();
      }

      return state;
    } catch (IOException localIOException) {
    }
    return new BaseState(false, 4);
  }

  private static File getTmpFile() {
    File tmpDir = FileUtils.getTempDirectory();
    double d = Math.random() * 10000.0D;
    String tmpFileName = String.valueOf(d).replace(".", "");
    return new File(tmpDir, tmpFileName);
  }

  private static State saveTmpFile(File tmpFile, String path) {
    State state = null;
    File targetFile = new File(path);

    if (targetFile.canWrite())
      return new BaseState(false, 2);
    try
    {
      FileUtils.moveFile(tmpFile, targetFile);
    } catch (IOException e) {
      return new BaseState(false, 4);
    }

    state = new BaseState(true);
    state.putInfo("size", targetFile.length());
    state.putInfo("title", targetFile.getName());

    return state;
  }

  private static State valid(File file) {
    File parentPath = file.getParentFile();

    if ((!parentPath.exists()) && (!parentPath.mkdirs())) {
      return new BaseState(false, 3);
    }

    if (!parentPath.canWrite()) {
      return new BaseState(false, 2);
    }

    return new BaseState(true);
  }
  
  /**
   * 上传FTP文件
   * @param is
   * @param path
   * @param maxSize
   * @return
   */
  public static State saveFtpFileByInputStream(InputStream is, String remoteDir, String path, long maxSize,boolean keepLocalFile)
  {
   try {
	   State state = null;
       File targetFile = new File(path);
       if (targetFile.canWrite())
         return new BaseState(false, 2);
     
       	connectFtp();
       	//创建目录
   		String[] dirs = remoteDir.split("/");
   		ftp.changeWorkingDirectory("../");
   		ftp.changeWorkingDirectory("data");
   		for (String dir : dirs) {
   			if(dir==null||"".equals(dir)){continue;}
   			boolean isExist =  ftp.changeWorkingDirectory(dir);
   			if (!isExist) {
   				if (!ftp.makeDirectory(dir)) {
   					log.error("ftp current working directory:"+ftp.printWorkingDirectory()+
   							" ftp create "+dir+" directory failed, reply code:"+ftp.getReplyCode());
   				}
   				ftp.changeWorkingDirectory(dir);
   			}
   		}
   		 boolean result = ftp.storeFile(targetFile.getName(),is);
   		 log.info("终于上传成功啦！");
   		if (!result) {
   			log.error("File upload failed, upload dir:"+remoteDir+
   					", file name:22"+
   					", reply code "+ftp.getReplyCode()+" "+ftp.getReplyString());
   		}
       state = new BaseState(true);
       state.putInfo("size", targetFile.length());
       state.putInfo("title", targetFile.getName());
       try
       {
           if(! keepLocalFile)
               targetFile.delete();
       }catch(Exception e){ }
       return state;
    }
    catch (Exception Exception) {
    	
    }
    return new BaseState(false, 4);
  }
  
 
  
  
  private static void connectFtp() throws IOException{
	  if(ftp!=null){return;}
		try {
			ftp = new FTPClient();
			ftp.connect(FtpService.PUB_HOST, FtpService.PORT);// 连接FTP服务器
			// 如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(FtpService.USER_NAME, FtpService.PASSWORD);// 登录
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				log.error("login ftp error, "+ftp.getReplyString());
				ftp.disconnect();
			}
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.enterLocalPassiveMode();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			ftp=null;
		}
	}
	
	private static void closeFtp() throws IOException{
		if(ftp!=null)ftp.logout();
	}
}