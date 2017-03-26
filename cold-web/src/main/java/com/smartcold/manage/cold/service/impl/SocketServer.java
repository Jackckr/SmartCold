package com.smartcold.manage.cold.service.impl;


//@Service
public class SocketServer {
/*
	@Autowired
	private    NioSocketAcceptor  ioAcceptor=null;
	private static Logger logger = LoggerFactory.getLogger(SocketServer.class);  

	public synchronized void initServer(){
		try {
			boolean portUsing = this.isPortUsing();
			if(!portUsing){return;	}
			if(ioAcceptor!=null){
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
	
	
	
    public  boolean isPortUsing() {  
        try {  
        	if(ioAcceptor!=null){
        		Socket socket = new Socket(ioAcceptor.getDefaultLocalAddress().getAddress(),ioAcceptor.getDefaultLocalAddress().getPort());  
        		socket.close();
        		logger.warn("Service registration failed ! Port is occupied!");
        		return false;  
        	}else{
        		return true;//托管失败。。。。。。
        	}
        } catch (Exception e) {  
        	 return true;  
        }   
      
    } 
	
*/
	
}
