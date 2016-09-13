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

	MessageEntity findMessageByID(@Param("msgID") int msgID);
	
	Page<MessageEntity> findAllMessage(@Param("keyword")String keyword);
	
	Page<MessageEntity> findMessageByUserID(@Param("userID") int userID);
	
	Page<MessageEntity> findMessageByCategory(@Param("categoryID") int categoryID);

	void insertMessage(MessageEntity messageEntity);
	
	void deleteMessage(@Param("msgID") int msgID);
	
	void updateMessage(MessageEntity messageEntity);
}
