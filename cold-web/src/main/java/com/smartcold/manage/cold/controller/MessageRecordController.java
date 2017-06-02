package com.smartcold.manage.cold.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.entity.olddb.MessageRecord;

/**
 * Created by qiangzi on 2017/5/27.
 */
@Controller
@RequestMapping(value = "/messageRecord")
public class MessageRecordController {
    @Resource
    private MessageRecordMapping messageRecordMapping;
    
    @RequestMapping(value = "/getMsgCountByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public Integer getMsgCountByRdcId(int userId,int rdcId){
    	return messageRecordMapping.getMsgCountByRdcId(rdcId);
    }
    
    @RequestMapping(value = "/getTallMsgByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public List<MessageRecord>  getTallMsgByRdcId(int userId,Integer rdcId){
    	return messageRecordMapping.getTallMsgByRdcId(rdcId);
    }
    @RequestMapping(value = "/getMessageList",method = RequestMethod.POST)
    @ResponseBody
    public List<MessageRecord> getMessageList (Integer rdcId,Integer userId,Integer type,Integer stype, Integer isRead,Integer status,String keyword, int  page,int rows){
    	PageHelper.startPage(page, rows);
       return messageRecordMapping.getMsgByFilter(rdcId, null, type, stype, status, isRead, keyword);
    }
	
//	Integer getMsgCountByRdcId(@Param("rdcId")Integer rdcId);//获得冷库未读消息
	
//	List<MessageRecord> getTallMsgByRdcId(@Param("rdcId")Integer rdcId);//获得冷库未前5条消息
	
//	List<MessageRecord> getMsgByFilter(@Param("rdcId")Integer rdcId);//
	
//    void insertMessageRecord(MessageRecord messageRecord);//添加消息
    
}
