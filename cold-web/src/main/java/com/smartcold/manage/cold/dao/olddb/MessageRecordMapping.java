package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.MessageRecord;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface MessageRecordMapping {
	
	Integer getUserAuth(@Param("userId")Integer userId);
	
    void insertMessageRecord(MessageRecord messageRecord);
    
    List<MessageRecord> getNewMessage(Integer userId);

    List<MessageRecord> getFiveNewMessage(Integer userId);

    //获取该用户所有未阅读条数
    Integer getNoReadByUserId(Integer userId);
}
