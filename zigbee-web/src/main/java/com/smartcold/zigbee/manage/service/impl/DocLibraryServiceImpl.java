package com.smartcold.zigbee.manage.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.DocLibraryService;
import com.smartcold.zigbee.manage.service.FtpService;


/**
 *
 * @author maqiang
 *
 */
@Service("docLibraryService")
public class DocLibraryServiceImpl implements DocLibraryService {
    private static String baseDir = "sharepicture";
    @Autowired
    private FtpService ftpService;
    @Autowired
    private FileDataMapper fileDataDao;

    @Override
    public List<FileDataEntity> queryFileInfo(FileDataEntity bean) {
        return null;
    }

    @Override
    public List<FileDataEntity> handleFile(HttpServletRequest r, UserEntity user)
        throws IOException {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(r.getSession() .getServletContext());
        if (multipartResolver.isMultipart(r)) {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) r;
            Iterator<String> iter = multiRequest.getFileNames();
            List<FileDataEntity> files = new ArrayList<FileDataEntity>();
            while (iter.hasNext()) {
                String para = iter.next();
                MultipartFile file = multiRequest.getFile(para);
                if (file != null) {
                    //	               
                    //	                    files.add(doc);
                }
            }
            return files;
        }
        return null;
    }

    /**
     * ????  ????
     */
    @Override
    public List<FileDataEntity> handleFile(int dataID, String type, UserEntity user, HttpServletRequest request) throws IOException {
    	List<MultipartFile> files = new ArrayList<MultipartFile>();
    	List<FileDataEntity> storageFiles = new ArrayList<FileDataEntity>();
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession() .getServletContext());
     if (multipartResolver.isMultipart(request)) {
	        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
	        Iterator<String> iter = multiRequest.getFileNames();
	        while (iter.hasNext()) {
	            String para = iter.next();
	            MultipartFile file = multiRequest.getFile(para);
	            files.add(file);
	        }
	        String dir = String.format("%s/share/%s", DocLibraryServiceImpl.baseDir,  dataID);
	        for (MultipartFile file : files) {
	            if (file == null) {  continue; }
	            String fileName = String.format("share%s_%s.%s", dataID, new Date().getTime(), "jpg");
	            UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, file, dir);
	            this.ftpService.uploadFile(uploadFileEntity);
	            FileDataEntity fileDataEntity = new FileDataEntity(file.getContentType(),  dir + "/" + fileName, type, dataID, fileName);
	            storageFiles.add(fileDataEntity);
	        }
	        if (!storageFiles.isEmpty()) {
	            this.fileDataDao.saveFileDatas(storageFiles); //??????
	        }
    	 }
     return storageFiles;
    }
}
