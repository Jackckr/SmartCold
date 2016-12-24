package com.smartcold.manage.cold.socket.test;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Client2 {

//	static Socket server;

	/**
	 * @param args
	 * @throws Exception
	 */
	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		Socket server = new Socket("192.168.1.137", 8888);
		BufferedReader in = new BufferedReader(new InputStreamReader( server.getInputStream()));
		PrintWriter out = new PrintWriter(server.getOutputStream());
		out.println("al，你好啊");
		out.println("two");
		out.flush();
		while (true) {
			BufferedReader wt = new BufferedReader(new InputStreamReader(System.in));
			String str = wt.readLine();
			out.println(str);
			out.flush();
			if (str.equals("end")) {
				break;
			}
			System.out.println(in.readLine());
		}
		server.close();

	}

}