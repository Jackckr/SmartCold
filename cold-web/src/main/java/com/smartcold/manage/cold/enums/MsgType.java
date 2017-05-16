package com.smartcold.manage.cold.enums;

import java.io.Serializable;
/**
 * 临时定义->无意义
 * @author Administrator
 *
 */

public enum MsgType implements Serializable{
	SYSMSG(0,"SYSMSG","系统消息"),
	SYSNOTICE(1,"SYSNOTICE","系统通知"),
	SYSWARNING(2,"SYSWARNING","系统告警");
	
	private int type;
	private String key;
	private String desc;
	
	private MsgType(int type, String table, String desc) {
		this.type = type;
		this.key = table;
		this.desc = desc;
	}
	//
//============================================1通知
//1		系统通知					msgtype						
//2		DEV重置通知											
//3		冷库认证通知											
//4		冷库绑定通知											
//5		冷库认证服务商通知											
//6		冷库绑定货主通知	
	
//============================================2 告警
//1		DEV断线告警											
//2		DEV低电量告警											
//3     DEV 空配置告警	
}
