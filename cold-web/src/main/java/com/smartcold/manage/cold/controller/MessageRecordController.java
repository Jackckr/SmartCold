package com.smartcold.manage.cold.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;

/**
 * Created by qiangzi on 2017/5/27.
 */
@Controller
@RequestMapping(value = "/messageRecord")
public class MessageRecordController {
    @Resource
    private MessageRecordMapping messageRecordMapping;

    @RequestMapping(value = "/getNewMessage",method = RequestMethod.POST)
    @ResponseBody
    public Object getNewMessage (Integer userId,Integer type,Integer stype, Integer isRead,Integer status, int  page,int rows){
       return messageRecordMapping.getNewMessage(userId);
    }
    
    @RequestMapping(value = "/getNewMessage",method = RequestMethod.POST)
    @ResponseBody
    public Object getNewMessage (Integer userId){
       return messageRecordMapping.getFiveNewMessage(userId);
    }

    @RequestMapping(value = "/getAllNoReadMessage",method = RequestMethod.POST)
    @ResponseBody
    public Object getAllNoReadMessage (Integer userId){
        Integer count = messageRecordMapping.getNoReadByUserId(userId);
        return count;
    }
}
