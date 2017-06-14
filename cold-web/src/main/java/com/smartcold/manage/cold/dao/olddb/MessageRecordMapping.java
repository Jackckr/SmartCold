package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.manage.cold.entity.olddb.MessageRecord;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface MessageRecordMapping {
	
	void insertMessageRecord(MessageRecord messageRecord);//添加消息
	
	Integer getUserAuth(@Param("userId")Integer userId);//获得是否有冷库认证信息
	
	Integer getMsgCountByRdcId(@Param("rdcId")Integer rdcId,@Param("type")Integer type);//获得冷库未读消息
	
	Integer getMsgCount(@Param("rdcId")Integer rdcId ,@Param("isread")Integer isread,@Param("state")Integer state);
	
	List<MessageRecord> getTallMsgByRdcId(@Param("rdcId")Integer rdcId,@Param("type")Integer type);//获得冷库未前5条消息
	
    void updateState(@Param("id")Integer id ,@Param("isread")Integer isread,@Param("state")Integer state);
    
    Page<MessageRecord> getMsgByFilter(@Param("rdcId")Integer rdcId,@Param("uid")Integer uid,@Param("type")Integer type,@Param("stype")Integer stype,@Param("state")Integer state,@Param("isread")Integer isread,@Param("keyword")String keyword);//
  
    
}
