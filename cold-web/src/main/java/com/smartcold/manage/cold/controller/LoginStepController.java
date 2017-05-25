package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.*;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.dto.UploadFileEntity;
import com.smartcold.manage.cold.entity.olddb.*;
import com.smartcold.manage.cold.service.FtpService;
import com.smartcold.manage.cold.util.SetUtil;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import java.io.File;
import java.util.Date;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/14.
 */
@Controller
@RequestMapping(value = "/loginStep")
public class LoginStepController {
    private static String baseDir = "picture";
    @Resource
    private RdcMapper rdcMapper;
    @Resource
    private UserMapper userMapper;
    @Resource
    private FtpService ftpService;
    @Resource
    private FileDataMapper fileDataDao;
    @Resource
    private MessageRecordMapping messageRecordMapping;
    
    @Resource
    private RdcauthMapping rdcauthMapping;
  

    @RequestMapping(value = "/attestationRdc",method = RequestMethod.POST)
    @ResponseBody
    public Object attestationRdc(int userId,String userName, int rdcId,  int type,MultipartFile authfile) {
    	try {
			this.userMapper.updateTypeById(new UserEntity(userId,type));
			if (type==0){
			    if (authfile != null) {
			        String dir = String.format("%s/rdc/%s", baseDir, rdcId);
			        String fileName = String.format("rdc%s_%s_%s.%s", rdcId,userId, new Date().getTime(), "jpg");
			        UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
			        this.ftpService.uploadFile(uploadFileEntity);
			        FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,FileDataMapper.CATEGORY_AUTH_PIC, rdcId, fileName);
	                arrangeFile.setDescription(type+"");
	                this.fileDataDao.saveFileData(arrangeFile);
			        RdcAuthEntity auchedata = new RdcAuthEntity();
			        auchedata.setType(type);
			        auchedata.setUid(userId);
			        auchedata.setRdcid(rdcId);
			        auchedata.setImgurl(dir + File.separator + fileName);
			        this.rdcauthMapping.insertCertification(auchedata);
			        return new ResultDto(1,"尊敬的用户，您的申请已提交成功，受理编号为<span id=\"proNo\">"+auchedata.getId()+"</span>。") ;
			    }	// 上传认证后更改冷库审核状态为待审核
			    return new ResultDto(0,"");
			}else {
			    MessageRecord messageRecord = new MessageRecord();
			    messageRecord.setUid(userId);
			    messageRecord.setRdcId(rdcId);
			    messageRecord.setTitle("请求冷库认证");
			    messageRecord.setMessage(userName+"请求成为您的"+(type==1?"货主":"维修商")+",请及时处理！");
			    messageRecord.setAddTime(new Date());
			    this.messageRecordMapping.insertMessageRecord(messageRecord);
			    return new ResultDto(1,"您的申请已提交成功！请耐心等待！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultDto(0,"");
		}
    }
}
