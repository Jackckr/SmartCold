package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.MessageRecord;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface MessageRecordMapping {
	
	Integer getUserAuth(@Param("userId")Integer userId);
	
    void insertMessageRecord(MessageRecord messageRecord);
}
