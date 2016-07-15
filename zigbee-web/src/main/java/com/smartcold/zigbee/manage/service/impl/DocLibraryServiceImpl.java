package com.smartcold.zigbee.manage.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.smartcold.zigbee.manage.entity.DocumentBean;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.DocLibraryService;

@Service
public class DocLibraryServiceImpl implements DocLibraryService {

	private static Logger logger = LoggerFactory.getLogger(DocLibraryServiceImpl.class);
//	@Autowired
//	private FileStore fileStore;

	@Override
	public List<DocumentBean> handleFile(HttpServletRequest r,UserEntity user)throws IOException{
		 CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(r.getSession().getServletContext());  
	        if(multipartResolver.isMultipart(r)){  
	            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest)r;  
	            Iterator<String> iter = multiRequest.getFileNames();  
	            List<DocumentBean> files = new ArrayList<DocumentBean>();
	            while(iter.hasNext()){  
	            	String para = iter.next();
	            	
	                MultipartFile file = multiRequest.getFile(para);  
	                if(file != null){  
//	                	if (file.getSize() > fileStore.getMaxFileSize()) {
////	    					logger.error("File Upload failed !  File Size can not More then "
////	    							+ fileStore.getMaxFileSize() / 1024 + " K");
//	    					continue;
//	    				}
	                	DocumentBean doc = new DocumentBean();
	                    String myFileName = file.getOriginalFilename();  
	                    int index = myFileName.lastIndexOf(".");
	                    String suffix = myFileName.substring(index + 1);
	                    doc.setParameter(para);
	                    doc.setFullname(myFileName);
	                    doc.setSize(file.getSize());
	                    doc.setSuffix(suffix);
	                    doc.setFiletype(suffix.toUpperCase());
	                    doc.setName(myFileName.substring(0,index-1));
	                    try {
							doc.setIo(file.getInputStream());
							//fileStore.saveFile(uInfo, doc);
						} catch (IOException e) {
							e.printStackTrace();
						} catch (Exception e) {
							e.printStackTrace();
						}
	                    
	                    files.add(doc);
	                }  
	            }  
	            return files;
	        }  
	        return null;
	}

	@Override
	public List<DocumentBean> queryFileInfo(DocumentBean bean){

		return null;
	}

}
