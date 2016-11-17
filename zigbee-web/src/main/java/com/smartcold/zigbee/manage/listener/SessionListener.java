package com.smartcold.zigbee.manage.listener;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.smartcold.zigbee.manage.service.impl.WebvistsService;

public class SessionListener implements HttpSessionListener{

	private static long  activeSessions = 0;
	
	public static long getonlineUser(){return activeSessions; }
	

	/* Session创建事件 */
	public void sessionCreated(HttpSessionEvent event) {
		SessionListener.activeSessions++;
		WebvistsService.addSessionInfo(event.getSession().getId());
	}

	/* Session失效事件 */
	public void sessionDestroyed(HttpSessionEvent event) {
		if(SessionListener.activeSessions>0){SessionListener.activeSessions--;}
	}

	
	
}