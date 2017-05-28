package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;

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
    public Object getNewMessage (Integer userId){
        List<HashMap<String, Object>> message = messageRecordMapping.getFiveNewMessage(userId);
        return message;
    }

    @RequestMapping(value = "/getAllNoReadMessage",method = RequestMethod.POST)
    @ResponseBody
    public Object getAllNoReadMessage (Integer userId){
        Integer count = messageRecordMapping.getNoReadByUserId(userId);
        return count;
    }
}
