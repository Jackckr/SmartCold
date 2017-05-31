package com.smartcold.manage.cold.controller;

import java.io.File;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.smartcold.manage.cold.dao.olddb.FileDataMapper;
import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.dao.olddb.RdcauthMapping;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.dto.UploadFileEntity;
import com.smartcold.manage.cold.entity.olddb.FileDataEntity;
import com.smartcold.manage.cold.entity.olddb.MessageRecord;
import com.smartcold.manage.cold.entity.olddb.RdcAuthEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.FtpService;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Created by qiangzi on 2017/5/14.
 * 
 * 认证冷库信息
 * 
 */
@Controller
@RequestMapping(value = "/authenUser")
public class AuthenUserController {
    private static String baseDir = "picture";
    @Autowired
    private RdcMapper rdcMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private FtpService ftpService;
    @Autowired
    private FileDataMapper fileDataDao;
    @Autowired
    private MessageRecordMapping messageRecordMapping;
    @Autowired
    private RdcauthMapping rdcauthMapping;
    

    @RequestMapping(value = "/attestationRdc",method = RequestMethod.POST)
    @ResponseBody
    public Object attestationRdc(int userId,String userName, int rdcId,  int type, MultipartFile authfile) {
    	try {
    		String msg="";
			if (type==0){
				String dir =null;String fileName=null;
				if (authfile != null) {//
					    dir = String.format("%s/rdc/%s", baseDir, rdcId);
						fileName = String.format("rdc%s_%s_%s.%s", rdcId,userId, new Date().getTime(), "jpg");
						UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
						this.ftpService.uploadFile(uploadFileEntity);
						FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,FileDataMapper.CATEGORY_AUTH_PIC, rdcId, fileName);
						arrangeFile.setDescription(type+"");
						this.fileDataDao.saveFileData(arrangeFile);
					}
			        RdcAuthEntity auchedata = new RdcAuthEntity();
			        auchedata.setType(type);
			        auchedata.setUid(userId);
			        auchedata.setRdcid(rdcId);
			        if(authfile!=null){
			         auchedata.setImgurl(dir + File.separator + fileName);
			        }
			        this.rdcauthMapping.insertCertification(auchedata);
			        msg="尊敬的用户，您的申请已提交成功，受理编号为<span id=\"proNo\">"+auchedata.getId()+"</span>。";
			}else {
			    MessageRecord msgMessageRecord = new MessageRecord();
			    msgMessageRecord.setType(1);
			    msgMessageRecord.setsType(type);
			    msgMessageRecord.setUid(userId);
			    msgMessageRecord.setRdcId(rdcId);
			    msgMessageRecord.setTitle("请求冷库认证");
			    msgMessageRecord.setMessage(userName+"请求成为您的"+(type==1?"货主":"维修商")+",请及时处理！");
			    msgMessageRecord.setAddTime(TimeUtil.getDateTime());
			    this.messageRecordMapping.insertMessageRecord(msgMessageRecord);
			    msg="您的申请已提交成功！请耐心等待！";
			}
			this.userMapper.updateTypeById(new UserEntity(userId,type));
			return new ResultDto(1,msg);	
    	} catch (Exception e) {
			e.printStackTrace();
			return new ResultDto(0,"");
		}
    }
}
