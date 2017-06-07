package com.smartcold.manage.cold.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.entity.olddb.MessageRecord;
import com.smartcold.manage.cold.util.ResponseData;

/**
 * Created by qiangzi on 2017/5/27.
 */
@Controller
@RequestMapping(value = "/messageRecord")
public class MessageRecordController {
    @Resource
    private MessageRecordMapping messageRecordMapping;
    
    /**
     * 
     * @param userId
     * @param type
     * @param rdcId
     * @return
     */
    @RequestMapping(value = "/getMsgCountByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public Integer getMsgCountByRdcId(int userId,int type,int rdcId){
    	return messageRecordMapping.getMsgCountByRdcId(rdcId,type);
    }
    
    @RequestMapping(value = "/getTallMsgByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public List<MessageRecord>  getTallMsgByRdcId(int userId,int type,Integer rdcId){
    	return messageRecordMapping.getTallMsgByRdcId(rdcId,type);
    }
    @RequestMapping(value = "/getMessageList",method = RequestMethod.POST)
    @ResponseBody
    public ResponseData<MessageRecord> getMessageList (Integer rdcId,Integer userId,Integer utype,Integer type,Integer stype, Integer isRead,Integer status,String keyword, int  page,int rows){
    	PageHelper.startPage(page, rows);
    	Page<MessageRecord> datalist = messageRecordMapping.getMsgByFilter(rdcId, null, type, stype, status, isRead, keyword);
		PageInfo<MessageRecord> data = new PageInfo<MessageRecord>(datalist);
		return ResponseData.newSuccess(data);
    }
	
}
