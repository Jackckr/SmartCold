package com.smartcold.manage.cold.service.impl;

import java.net.Socket;
import java.net.UnknownHostException;

import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SocketServer {

	@Autowired
	private    NioSocketAcceptor  ioAcceptor=null;
	private static Logger logger = LoggerFactory.getLogger(SocketServer.class);  

	/**
	 * 绑定IP和端口
	 */
	public synchronized void initServer(){
		try {
			boolean portUsing = this.isPortUsing();
			if(ioAcceptor!=null&&portUsing){
				ioAcceptor.bind();
				logger.info("SocketServer start Success! Server:"+ioAcceptor.getDefaultLocalAddress().getAddress()+":"+ioAcceptor.getDefaultLocalAddress().getPort());
			}else{
				logger.warn("SocketServer start Error ！NioSocketAcceptor is Null!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.warn("SocketServer start Error !"+e.getMessage());
		}
	}
	
	
	
	/*** 
     *  true:already in using  false:not using  
     * @param host 
     * @param port 
     * @throws UnknownHostException  
     */  
    public  boolean isPortUsing() {  
        try {  
        	if(ioAcceptor!=null){
        		Socket socket = new Socket(ioAcceptor.getDefaultLocalAddress().getAddress(),ioAcceptor.getDefaultLocalAddress().getPort());  
        		socket.close();
        		return false;  
        	}else{
        		return true;//托管失败。。。。。。
        	}
        } catch (Exception e) {  
        	 return true;  
        }   
      
    } 
	

	
}
