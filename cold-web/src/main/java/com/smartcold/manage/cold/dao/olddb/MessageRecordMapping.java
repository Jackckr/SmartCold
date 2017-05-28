package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.MessageRecord;

import java.util.HashMap;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface MessageRecordMapping {
	
	Integer getUserAuth(@Param("userId")Integer userId);
	
    void insertMessageRecord(MessageRecord messageRecord);

    List<HashMap<String,Object>> getFiveNewMessage(Integer userId);

    //获取该用户所有未阅读条数
    Integer getNoReadByUserId(Integer userId);
}
