package com.smartcold.manage.cold.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

public class Test {

	public static void main(String[] args) {
		
		
		String s="";
   byte[] bytes = s.getBytes();
   System.err.println(bytes.length);
//		
//		try {
//			//客户端
//			//1、创建客户端Socket，指定服务器地址和端口
//			Socket socket =new Socket("127.0.0.1",2196);
//			//2、获取输出流，向服务器端发送信息
//			OutputStream os = socket.getOutputStream();//字节输出流
//			PrintWriter pw =new PrintWriter(os);//将输出流包装成打印流
//			pw.write("用户名：admin；密码：admin");
//			pw.flush();
//			socket.shutdownOutput();
//			//3、获取输入流，并读取服务器端的响应信息
//			InputStream is = socket.getInputStream();
//			BufferedReader br = new BufferedReader(new InputStreamReader(is));
//			String info = null;
//			while(br.readLine()!=null){
//			 System.out.println("Hello,我是客户端，服务器说："+info);
//			}
//			  
//			//4、关闭资源
//			br.close();
//			is.close();
//			pw.close();
//			os.close();
//			socket.close();
//		} catch (UnknownHostException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		
		
		
	}
	
	
	
}
