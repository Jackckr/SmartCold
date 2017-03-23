package com.smartcold.manage.cold.api;


import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.springframework.beans.factory.annotation.Autowired;

import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;
import com.smartcold.manage.cold.util.socket.SocketStatus;

/**
 * 沈阳设备数据 
 * @author Administrator
 *
 */
public class SocketHandler extends IoHandlerAdapter {
	@Autowired
	public  WarningLogMapper warningLogMapper;
	@Autowired
	public  StorageDataCollectionMapper storageDataCollectionDao;
	
    private static ConcurrentHashMap<Long, IoSession> curSessionMap = new ConcurrentHashMap<Long, IoSession>();

    
    private static IoBuffer getstatus(String type){
    	String msg = type+(System.currentTimeMillis()+"").substring(0, 10);
		int length=msg.length()/2;
		byte[] bts = new byte[length];
		for (int i = 0; i < length; i++) {
			bts[i]=Byte.parseByte(msg.substring(0,2));
			msg=msg.substring(2);
		}
		IoBuffer buffer = IoBuffer.allocate(16);
		buffer.put(bts);
		buffer.flip();
	  return buffer;

    	
    	
    }

    /*
     * (non-Javadoc)
     * 有异常发生时被触发
     * @see org.apache.mina.core.service.IoHandlerAdapter#exceptionCaught(org.apache.mina.core.session.IoSession, java.lang.Throwable)
     */
    public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
    	session.closeOnFlush();
    	curSessionMap.remove(session.getId());
    	System.err.println(" 有异常发生时被触发exceptionCaught："+cause);
    }
    /*org.apache.mina.filter.codec.ProtocolDecoderException
     * (non-Javadoc)
     * 有消息到达时被触发，message代表接收到的消息。
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageReceived(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    public void messageReceived(IoSession session, Object message) throws Exception {
				String msg=message+"";
			    System.err.println("接收到数据包："+msg);
			    if(msg.length()>=2){
				        String type =msg.substring(0, 2);
						switch (type) {
						case "00"://数据包
							System.err.println("收到数据包："+msg);
					        session.write(getstatus(type));
							break;
						case "01"://状态包
							System.err.println("收到状态包："+msg);
							session.write(getstatus(type));
							break;
						case "02"://校时包
						    System.err.println("收到校时包："+msg);
						    session.write(getstatus(type));
							break;
						default:
							System.err.println("未知数据："+msg);
							break;
						}
			    }else{
			    	return;
			    }
			    	
			  
       
       
    }
    
    
    public static byte [] ioBufferToByte(Object message)   
    {   
          if (!(message instanceof IoBuffer))   
          {   
              return null;   
          }   
          IoBuffer ioBuffer = (IoBuffer)message;   
          ioBuffer.flip();
          byte[] readByte = new byte[ioBuffer.limit()];  
          try
          {
            ioBuffer.get(readByte);
          }
          catch (Exception e) 
          {
          System.out.println(e.toString());
          }
          return readByte;   
    }
    /*
     * (non-Javadoc)
     *   当信息已经传送给客户端后触发此方法.
     * @see org.apache.mina.core.service.IoHandlerAdapter#messageSent(org.apache.mina.core.session.IoSession, java.lang.Object)
     */
    @Override
    public void messageSent(IoSession session, Object message) throws Exception {
    	 super.messageSent(session, message);
    	 System.err.println("messageSent:向客户端发送："+message);
    }
    
    /*
     * (non-Javadoc)
     * 当创建一个新连接时被触发，即当开始一个新的Session时被触发。
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionCreated(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionCreated(IoSession session) throws Exception {
    	  SocketHandler.curSessionMap.put(session.getId(), session);
    	  System.err.println("创建一个新连接："+session.getRemoteAddress()+"并发的个数:\t"+curSessionMap.size());
//    	  SocketSessionConfig cfg = (SocketSessionConfig) session.getConfig();   
//          cfg.setReceiveBufferSize(2 * 1024 * 1024);   
//          cfg.setReadBufferSize(2 * 1024 * 1024);   
//          cfg.setKeepAlive(true);   
//          cfg.setSoLinger(0); //这个是根本解决问题的设置   
    }
    
    /*
     * (non-Javadoc)
     * 当打开一个连接时被触发。==sessionCreated->   session.getConfig().setIdleTime(IdleStatus.BOTH_IDLE, IDLE);
     * @see org.apache.mina.core.service.IoHandlerAdapter#sessionOpened(org.apache.mina.core.session.IoSession)
     */
    @Override
    public void sessionOpened(IoSession session) throws Exception {
//    	  session.write("0={'smallint':30,'intv':1800}");
        System.err.println("会话已打开:"+session.getRemoteAddress()+"\r\n准备接收数据");
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
        System.err.println("关闭当前session："+session.getId()+"#"+ session.getRemoteAddress());
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
    public void addextMsg(String methodName,int type,String errMsg){
		try {
			String msg="IP:"+RemoteUtil.getServerIP()+" 时间："+TimeUtil.getDateTime()+" 开始执行："+methodName;
			if(StringUtil.isnotNull(errMsg)){
				if(errMsg.length()>200){errMsg=errMsg.substring(0, 200);}
				 msg+=" 客户端消息："+errMsg; 
				 List<WarningsLog> errInfoList=new ArrayList<WarningsLog>();
				 errInfoList.add(new WarningsLog(-1,type,msg));
				 this.warningLogMapper.addWarningLog(errInfoList);
			}
		} catch (Exception e) {
			e.printStackTrace();
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
    
    
    
    public static void messageSentAll( Object message) throws Exception {
    	 
//        System.err.println("发送消息时时被触发，即在调用IoSession.write()时被触发，message代表将要发送的消息。=" + message);
//     // 向所有客户端发送的数据
//        SocketModel socm=new SocketModel(new Date().getTime()+"", "", 5, message);
//       String send=socm.toString();
//       Collection<IoSession> sessions = users.values();
//
//        for (IoSession sess : sessions) {
//
//            sess.write(send);
//
//        }

    }
    public static void messageSentSingle(IoSession session, Object message) throws Exception {

//        log.info("发送消息时时被触发，即在调用IoSession.write()时被触发，message代表将要发送的消息。=" + message);
//     // 向所有客户端发送的数据
//        Integer command=(Integer) session.getAttribute("command");
//        SocketModel socm=new SocketModel(new Date().getTime()+"", "", command, message);
//       String send=socm.toString();
//       session.write(send);
    }

    public static void messageSentPart( Object message,String city_id) throws Exception {

//        log.info("发送消息时时被触发，即在调用IoSession.write()时被触发，message代表将要发送的消息。=" + message);
//        Object[] key=users.keySet().toArray();
//        for (int i = 0; i < key.length; i++) {
//            if(key[i].toString().contains(city_id)){
//                IoSession iosession=users.get(key[i]);
//                 SocketModel socm=new SocketModel(new Date().getTime()+"", "", 5, message);
//                   String send=socm.toString();
//                iosession.write(send);
//            }
//        }
     // 向所有客户端发送的数据
        
        
    }



}
