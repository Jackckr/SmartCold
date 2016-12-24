package com.smartcold.manage.cold.socket.services;

import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.keepalive.KeepAliveMessageFactory;
public class MyKeepAliveMessageFactory implements  KeepAliveMessageFactory{
    /** 心跳包内容 */  
    private static final String HEARTBEATREQUEST = "1111";  
    private static final String HEARTBEATRESPONSE = "1112"; 
	@Override
	public Object getRequest(IoSession arg0) {
       return HEARTBEATREQUEST;
	}
	@Override
	public Object getResponse(IoSession arg0, Object arg1) {
       return HEARTBEATRESPONSE;  
	}
	@Override
	public boolean isRequest(IoSession arg0, Object arg1) {
       if (arg1.equals(HEARTBEATREQUEST))  
           return true;  
       return false;  
	}
	@Override
	public boolean isResponse(IoSession arg0, Object arg1) {
	      if(arg1.equals(HEARTBEATRESPONSE))  
	          return true;
	        return false;
	}
	
}