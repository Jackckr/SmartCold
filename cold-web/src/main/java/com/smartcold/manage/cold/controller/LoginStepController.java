package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.*;
import com.smartcold.manage.cold.entity.olddb.*;
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
    @Resource
    private RdcMapper rdcMapper;
    @Resource
    private UserMapper userMapper;
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
    public void attestationRdc(
                                 @RequestParam(value = "rdcId", required = false) Integer rdcId,
                                 @RequestParam(value = "roleType", required = false) Integer roleType,
                                 HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        user.setType(roleType);
        userMapper.updateTypeById(user);
        if (roleType==3){
            ColdStorageCertification coldStorageCertification = new ColdStorageCertification();
            coldStorageCertification.setUid(user.getId());
            coldStorageCertification.setRdcId(rdcId);
            coldStorageCertification.setAddTime(new Date());
            coldStorageCertificationMapping.insertCertification(coldStorageCertification);
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
