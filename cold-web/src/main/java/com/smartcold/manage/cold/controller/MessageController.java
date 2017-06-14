package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
/**
 * 消息中心
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/MessageController")
@ResponseBody
public class MessageController {
    @Autowired
    private MessageRecordMapping messageRecordMapping;
    

    @RequestMapping(value = "/getMsgCount",method = RequestMethod.POST)
    public Integer getMsgCount(int userId,int type,int msgtype, int rdcId, Integer isread,Integer state) {
      return this.messageRecordMapping.getMsgCount(rdcId, isread, state);
    }
   
}
