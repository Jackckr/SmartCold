package com.smartcold.manage.cold.api;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.springframework.beans.factory.annotation.Autowired;

import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * @author Administrator
 *
 */
public class SocketHandler extends IoHandlerAdapter {
	@Autowired
	public  WarningLogMapper warningLogMapper;
//	@Autowired
//	public  StorageDataCollectionMapper storageDataCollectionDao;
    public static ConcurrentHashMap<Long, IoSession> curSessionMap = new ConcurrentHashMap<Long, IoSession>();
    

    
    /*
     * (non-Javadoc)
     * 有异常发生时被触发
     * @see org.apache.mina.core.service.IoHandlerAdapter#exceptionCaught(org.apache.mina.core.session.IoSession, java.lang.Throwable)
     */
    public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
    	session.closeOnFlush();
    }
    /*
     * (non-Javadoc)
     * 有消息到达时被触发，message代表接收到的消息。
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageReceived(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    public void messageReceived(IoSession session, Object message) throws Exception {
        session.write("200={\"status\":\"200\"}");
        System.err.println("收到客户端消息："+message);
//       this.addAPdata(message.toString());
//        this.addextMsg("messageReceived", 2, message.toString());
    }
    
    /*
     * (non-Javadoc)
     *   当信息已经传送给客户端后触发此方法.
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageSent(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    @Override
    public void messageSent(IoSession session, Object message) throws Exception {
    	 super.messageSent(session, message);
    }
    
    /*
     * (non-Javadoc)
     * 当创建一个新连接时被触发，即当开始一个新的Session时被触发。
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionCreated(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionCreated(IoSession session) throws Exception {
    	  SocketHandler.curSessionMap.put(session.getId(), session);
    }
    
    /*
     * (non-Javadoc)
     * 当打开一个连接时被触发。==sessionCreated->   session.getConfig().setIdleTime(IdleStatus.BOTH_IDLE, IDLE);
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionOpened(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionOpened(IoSession session) throws Exception {
    	  session.write("0={'smallint':30,'intv':1800}");
    }
    
    /*
     * (non-Javadoc)
     * 关闭时触发
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionClosed(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionClosed(IoSession session) throws Exception {
        session.closeOnFlush();
        curSessionMap.remove(session.getId());    
    }
    
    /*
     * (non-Javadoc)
     * 当连接空闲时被触发。使用IoSessionConfig中的setIdleTime(IdleStatus status, int idleTime)方法可以设置session的空闲时间。
     * 如果该Session的空闲时间超过设置的值，该方法被触发，可以通过 session.getIdleCount(status)来获取sessionIdle被触发的次数
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionIdle(org.apache.mina.core.session.IoSession, org.apache.mina.core.session.IdleStatus)
     */
    @Override
    public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
    	session.write("410={\"msg\":\"会话超时\"}");
        session.closeOnFlush();
        System.err.println("关闭客户端："+session);
    }
    
/*

    private void addAPdata( String data){
    	if(StringUtil.isNull(data))return;
		System.err.println(data);
    	ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
		StorageDataCollectionEntity obj=new StorageDataCollectionEntity("AP03","24","Temp","-24.6",new Date()) ;
		arrayList.add(obj);
		if(storageDataCollectionDao!=null){
			storageDataCollectionDao.batchInsert(arrayList);
		}
    }
    */
    private void addextMsg(String methodName,int type,String errMsg){
		String msg="IP:"+RemoteUtil.getServerIP()+" 时间："+TimeUtil.getDateTime()+" 开始执行："+methodName;
		if(StringUtil.isnotNull(errMsg)){
			if(errMsg.length()>200){errMsg=errMsg.substring(0, 200);}
			 msg+=" 执行错误："+errMsg; 

			 List<WarningsLog> errInfoList=new ArrayList<WarningsLog>();
			 errInfoList.add(new WarningsLog(-1,type,msg));
			 this.warningLogMapper.addWarningLog(errInfoList);
		}
	}

    
    /**  
     * @Description: 发送消息到客户端  
     * @author whl  
     * @date 2014-9-29 下午1:57:51  
     */  
    public static void sendConfig( Object config){  
       for (IoSession is : curSessionMap.values()) {
    	   is.write(config);  
	  }
    	
    	
    }  


}
