package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.*;
import com.smartcold.manage.cold.dto.UploadFileEntity;
import com.smartcold.manage.cold.entity.olddb.*;
import com.smartcold.manage.cold.service.FtpService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.Date;

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
    private ColdStorageCertificationMapping coldStorageCertificationMapping;
    @RequestMapping(value = "/getAllRdc",method = RequestMethod.POST)
    @ResponseBody
    public Object getAllRdc(String words) {
        if (words!=null && words.trim().equals("")){
            words=null;
        }else if (words!=null && !words.trim().equals("")){
            words="%"+words+"%";
        }
        return rdcMapper.getRdcByDate(words);
    }

    @RequestMapping(value = "/attestationRdc",method = RequestMethod.POST)
    @ResponseBody
    public void attestationRdc( MultipartFile authfile0,
                                @RequestParam(value = "rdcId", required = false) Integer rdcId,
                                @RequestParam(value = "roleType", required = false) Integer roleType,
                                HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        user.setType(roleType);
        userMapper.updateTypeById(user);

        if (roleType==0){
            MultipartFile authfile = authfile0;
            String filename = authfile.getOriginalFilename();
            ColdStorageCertification coldStorageCertification = new ColdStorageCertification();
            coldStorageCertification.setUid(user.getId());
            coldStorageCertification.setRdcId(rdcId);
            coldStorageCertification.setCertFile(filename);
            coldStorageCertification.setAddTime(new Date());
            coldStorageCertificationMapping.insertCertification(coldStorageCertification);
            Rdc rdcEntity = rdcMapper.findRDCByRDCId(rdcId).get(0);
            String dir = String.format("%s/rdc/%s", baseDir, rdcId);
            if (authfile != null) {
                String fileName = String.format("rdc%s_%s_%s.%s", rdcId, user.getId(), new Date().getTime(), "jpg");
                UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
                ftpService.uploadFile(uploadFileEntity);
                FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,
                        FileDataMapper.CATEGORY_AUTH_PIC, rdcEntity.getId(), fileName);
                if(user!=null){arrangeFile.setDescription(user.getType()+"");}//标志为服务商
                fileDataDao.saveFileData(arrangeFile);
            }		// 上传认证后更改冷库审核状态为待审核
        }else {
            MessageRecord messageRecord = new MessageRecord();
            messageRecord.setUid(user.getId());
            messageRecord.setRdcId(rdcId);
            messageRecord.setTitle("请求冷库认证");
            messageRecord.setMessage(user.getUsername()+"请求冷库认证");
            messageRecord.setAddTime(new Date());
            messageRecordMapping.insertMessageRecord(messageRecord);
        }
    }
}
