package com.smartcold.zigbee.manage.filter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * session 监听
 * @author Administrator
 *
 */
public class SessionCounter implements HttpSessionListener {
	private static final Logger log = LoggerFactory.getLogger(SessionCounter.class);
	/* Session创建事件 */  
	public void sessionCreated(HttpSessionEvent event) {  
		HttpSession session = event.getSession();
	    ServletContext ctx = session.getServletContext( );  
        Integer numSessions = (Integer) ctx.getAttribute("numSessions");  
        if (numSessions == null) {  
            numSessions = new Integer(1);  
        }  
        else {  
            int count = numSessions.intValue( );  
            numSessions = new Integer(count + 1);  
        }  
        ctx.setAttribute("numSessions", numSessions);  
        log.info("session总数:"+numSessions);
        System.err.println("user:"+session.getAttribute("user"));
	}  
	/* Session失效事件 */  
	public void sessionDestroyed(HttpSessionEvent se) {  
	 ServletContext ctx=se.getSession().getServletContext();  
	 Integer numSessions = (Integer)ctx.getAttribute("numSessions");  
	       if(numSessions == null){  
	            numSessions = new Integer(0);  
	        }else{  
	            int count = numSessions.intValue( );  
	            numSessions = new Integer(count - 1);  
	        }  
	        ctx.setAttribute("numSessions", numSessions);
	        log.info("session总剩余:"+numSessions);
	}
}
