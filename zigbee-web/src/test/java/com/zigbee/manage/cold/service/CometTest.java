package com.zigbee.manage.cold.service;

import java.util.Date;

import com.smartcold.zigbee.manage.entity.MessageEntity;
import com.smartcold.zigbee.manage.util.CometUtil;

public class CometTest {
public static void main(String[] args) {
	MessageEntity message = new MessageEntity();
	message.setUserid(24);
	message.setMsgdata(new Date() + ",分数变化,更新RDC: ");
	message.setMsgcategory(1);
	message.setMsgcount(1);
	new CometUtil().pushTo(message);	
 }
}