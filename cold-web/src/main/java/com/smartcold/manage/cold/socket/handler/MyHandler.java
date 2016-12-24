package com.smartcold.manage.cold.socket.handler;

import java.net.InetSocketAddress;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;


/**
 * @author Administrator
 *
 */
public class MyHandler extends IoHandlerAdapter {
	
    public static ConcurrentHashMap<Long, IoSession> curSessionMap = new ConcurrentHashMap<Long, IoSession>();
    
    /*
     * (non-Javadoc)
     * 有异常发生时被触发
     * @see org.apache.mina.core.service.IoHandlerAdapter#exceptionCaught(org.apache.mina.core.session.IoSession, java.lang.Throwable)
     */
    public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
    	session.closeOnFlush();
        System.err.println("session occured exception, so close it." + cause.getMessage());
    }
    /*
     * (non-Javadoc)
     * 有消息到达时被触发，message代表接收到的消息。
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageReceived(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    public void messageReceived(IoSession session, Object message) throws Exception {
//        String remoteAddress = ((InetSocketAddress) session.getRemoteAddress()).getAddress().getHostAddress();
        System.err.println("客户端" + session.getId()+ "连接成功！消息："+message);
    }
    
    /*
     * (non-Javadoc)
     *   当信息已经传送给客户端后触发此方法.
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageSent(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    @Override
    public void messageSent(IoSession session, Object message) throws Exception {
    	
    }
    
    /*
     * (non-Javadoc)
     * 当创建一个新连接时被触发，即当开始一个新的Session时被触发。
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionCreated(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionCreated(IoSession session) throws Exception {
       MyHandler.curSessionMap.put(session.getId(), session);
       System.err.println("remote client [" + session.getRemoteAddress().toString() + "] connected."+curSessionMap.size());
    }
    
    /*
     * (non-Javadoc)
     * 当打开一个连接时被触发。==sessionCreated->   session.getConfig().setIdleTime(IdleStatus.BOTH_IDLE, IDLE);
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionOpened(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionOpened(IoSession session) throws Exception {
//       System.err.println("sessionOpened.");
    }
    
    /*
     * (non-Javadoc)
     * 关闭时触发
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionClosed(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionClosed(IoSession session) throws Exception {
        session.closeOnFlush();
        curSessionMap.remove(session.getId());    // my
        System.err.println("sessionClosed."+curSessionMap.size());
    }
    
    /*
     * (non-Javadoc)
     * 当连接空闲时被触发。使用IoSessionConfig中的setIdleTime(IdleStatus status, int idleTime)方法可以设置session的空闲时间。
     * 如果该Session的空闲时间超过设置的值，该方法被触发，可以通过 session.getIdleCount(status)来获取sessionIdle被触发的次数
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionIdle(org.apache.mina.core.session.IoSession, org.apache.mina.core.session.IdleStatus)
     */
    @Override
    public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
        session.closeOnFlush();
        System.err.println("session idle, so disconnecting......");
    }
    

}
