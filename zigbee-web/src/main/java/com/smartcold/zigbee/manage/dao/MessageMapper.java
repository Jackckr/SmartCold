package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.entity.MessageEntity;
/**
 * 
 * @author kaiqiang jiang
 * @version 创建时间：2016-9-13 上午11:41:07
 * 消息通知mapper
 */
public interface MessageMapper {
	
	
	void insertMessage(MessageEntity messageEntity);
	
	void deleteMessage(@Param("msgID") int msgID);
	
	void updateMessage(MessageEntity messageEntity);
	
	void updateMsgStaus(@Param("userID") int userID,@Param("ids") Object ids);//获得未读消息数
	
	
	Integer getMsgCountByUID(@Param("userID") int userID);//获得未读消息数

	MessageEntity findMessageByID(@Param("msgID") int msgID);
	
	Page<MessageEntity> findAllMessage(@Param("keyword")String keyword);
	
	Page<MessageEntity> findMessageByUserID(@Param("userID") int userID);
	
	Page<MessageEntity> findMessageByCategory(@Param("categoryID") int categoryID);
	
}
