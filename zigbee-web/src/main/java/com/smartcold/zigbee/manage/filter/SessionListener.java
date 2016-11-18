package com.smartcold.zigbee.manage.filter;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener{

	private static long  activeSessions = 0;
	
	public static long getonlineUser(){return activeSessions; }

	/* Session创建事件 */
	public void sessionCreated(HttpSessionEvent event) {
		SessionListener.activeSessions++;
	}

	/* Session失效事件 */
	public void sessionDestroyed(HttpSessionEvent event) {
		if(SessionListener.activeSessions>0){SessionListener.activeSessions--;}
	}

	
	
}