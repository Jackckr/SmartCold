package com.smartcold.manage.cold.socket.test;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;
/**
 *@function：java的简单socket连接，长连接，尝试连续从服务器获取消息
 *@parameter:
 *@return：
 *@date：2016-6-22 下午03:43:18
 *@author:he
 *@notice:
 */
public class SocketTestTwo {
    public static final String IP_ADDR = "192.168.1.137";// 服务器地址
    public static final int PORT = 8888;// 服务器端口号
    static String text = null;
    public static void main(String[] args) throws IOException {
    	for (int i = 0; i < 1000; i++) {
    		test();
    		System.out.println("客户端启动..."+i);
		}
    }
	private static void test() throws UnknownHostException, IOException {
		
        Socket socket = new Socket(IP_ADDR, PORT);
        PrintWriter os = new PrintWriter(socket.getOutputStream());
        os.println("A");
        os.println("b");
        os.println("c");
        os.flush();
//        int i = 1;
//        while (true) {
            try {
            	for (int i = 1; i < 5; i++) {
            		Thread.sleep(100);
            		os.println("A:"+i);
                    os.println("I:"+i);
                    os.flush();
                    i++;
				}
            	Thread.sleep(3000000);
            } catch (Exception e) {
                System.out.println("客户端异常:" + e.getMessage());
                os.close();
            }
//        }
	}
}
