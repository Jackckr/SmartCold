package com.smartcold.manage.cold.service.impl;

import java.net.InetSocketAddress;

import org.apache.mina.core.filterchain.DefaultIoFilterChainBuilder;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.executor.ExecutorFilter;
import org.apache.mina.filter.logging.MdcInjectionFilter;
import org.apache.mina.filter.logging.MdcInjectionFilter.MdcKey;
import org.apache.mina.transport.socket.SocketSessionConfig;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.api.SocketHandler;
import com.smartcold.manage.cold.util.CodeFactory;

@Service
public class SocketServer {

	private static final int PORT = 2196;
	private static NioSocketAcceptor  ioAcceptor=null;
	private static Logger logger = LoggerFactory.getLogger(SocketServer.class);  
	
	public void bind(){
		try {
			if(ioAcceptor==null){
				SocketHandler serverHandler=new SocketHandler();//<!--自己实现的handler -->
				ExecutorFilter executorFilter=new ExecutorFilter();//设置异常线程3000,5000	<!-- executorFilter多线程处理 -->
				InetSocketAddress defaultLocalAddress= new InetSocketAddress(PORT);//<!-- 监听端口 -->
				MdcInjectionFilter mdcInjectionFilter=new MdcInjectionFilter(MdcKey.remoteAddress);//拦截指定端口消息
				CodeFactory codeFactory=new CodeFactory();
				codeFactory.setBufferLength(1024);
				codeFactory.setDecoderMaxLineLength(10240);
				ProtocolCodecFilter  codecFilter=new ProtocolCodecFilter(codeFactory);//<!--编解码 -->
				
			    ioAcceptor=new NioSocketAcceptor();//设置线程500
				ioAcceptor.setDefaultLocalAddress(defaultLocalAddress);
				ioAcceptor.setHandler(serverHandler);
				ioAcceptor.setReuseAddress(true);
				
				SocketSessionConfig sessionConfig = ioAcceptor.getSessionConfig();
				sessionConfig.setBothIdleTime(1800);//设置超时时间<!-- 配置session 单位 秒 -->
				sessionConfig.setIdleTime( IdleStatus.BOTH_IDLE, 600);//设置无操作后休眠（）
				sessionConfig.setMinReadBufferSize(1024);
				sessionConfig.setMinReadBufferSize(10240);
				DefaultIoFilterChainBuilder filterChain = ioAcceptor.getFilterChain();
				filterChain.addLast("executor", executorFilter);//<!--mina自带的线程池filter -->
				filterChain.addLast("codecFilter", codecFilter);//<!--自己实现的编解码器filter -->
				filterChain.addLast("mdcInjectionFilter", mdcInjectionFilter);//注入<!-- 拦截端口 -->
				
				ioAcceptor.bind();
				logger.info("SocketServer start! port:"+ioAcceptor.getLocalAddress().getHostName() +PORT);
			}else{
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.warn("SocketServer start Error !"+e.getMessage());
		}
	}
	
	public void unbind(){
		ioAcceptor.unbind();
		logger.info("SocketServer Cancellation!");
	}
	
	
	

	
}
