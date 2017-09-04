package com.smartcold.manage.cold.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.util.Map;

/**
 * 远程url工具类.
 * 
 * @author Maqiang34
 */
public class RemoteUtil {
	
	/**
	 * 
	 * @return
	 */
	public static String getServerIP(){
		try {
			InetAddress addr = InetAddress.getLocalHost();
			 return addr.getHostAddress();
		} catch (UnknownHostException e) {
			return "127.0.0.1";
		}
	}

	/**
     * 获取服务器IP地址
     * @return
     */
     @SuppressWarnings("rawtypes")
     public static String  getServerIp(){
        String SERVER_IP = null;
        try {
			Enumeration netInterfaces = NetworkInterface.getNetworkInterfaces();
            InetAddress ip = null;
            while (netInterfaces.hasMoreElements()) {
                NetworkInterface ni = (NetworkInterface) netInterfaces.nextElement();
                ip = (InetAddress) ni.getInetAddresses().nextElement();
                SERVER_IP = ip.getHostAddress();
                if (!ip.isSiteLocalAddress() && !ip.isLoopbackAddress()
                        && ip.getHostAddress().indexOf(":") == -1) {
                    SERVER_IP = ip.getHostAddress();
                    break;
                } else {
                    ip = null;
                }
            }
        } catch (Exception e) {
          System.err.println("获取IP异常!");
        }
        return SERVER_IP;
    }
	
     
     /**
 	 * 发送Http协议 通过post传参数到接口并返回数据
 	 * 
 	 */
 	public static String httpPost(String urlStr, Map<String, Object> params) {
 		URL connect;
 		StringBuffer data = new StringBuffer();
 		try {
 			connect = new URL(urlStr);
 			HttpURLConnection connection = (HttpURLConnection) connect.openConnection();
 			connection.setRequestMethod("POST");
 			connection.setDoOutput(true);
 			connection.setDoInput(true);
 			connection.setUseCaches(false);// post不能使用缓存
 			connection.setInstanceFollowRedirects(true);
 			connection.setRequestProperty("accept", "*/*");
 			connection.setRequestProperty("connection", "Keep-Alive");
 			connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
 			OutputStreamWriter paramout = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
 			String paramsStr = ""; // 拼接Post 请求的参数
 			for (String param : params.keySet()) {
 				paramsStr += "&" + param + "=" + params.get(param);
 			}
 			if (!paramsStr.isEmpty()) {
 				paramsStr = paramsStr.substring(1);
 			}
 			paramout.write(paramsStr);
 			paramout.flush();
 			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
 			String line;
 			while ((line = reader.readLine()) != null) {
 				data.append(line);
 			}
 			paramout.close();
 			reader.close();
 		} catch (Exception e) {
 			e.printStackTrace();
 		}
 		return data.toString();
 	}
     /**
      * 向指定URL发送GET方法的请求
      * 
      * @param url
      *            发送请求的URL
      * @param param
      *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
      * @return URL 所代表远程资源的响应结果
      */
     public static String sendGet(String url , String param) {
         String result = "";
         BufferedReader in = null;
         try {
        	 if(StringUtil.isnotNull(param)){ url+="?"+param;}
             URL realUrl = new URL(url);
             URLConnection connection = realUrl.openConnection();   // 打开和URL之间的连接
             connection.setRequestProperty("accept", "*/*"); // 设置通用的请求属性
             connection.setRequestProperty("connection", "Keep-Alive");
             connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
             connection.connect(); // 建立实际的连接
             in = new BufferedReader(new InputStreamReader( connection.getInputStream()));
             String line;
             while ((line = in.readLine()) != null) {
                 result += line;
             }
         } catch (Exception e) {
             System.out.println("发送GET请求出现异常！" + e);
             e.printStackTrace();
         }
         // 使用finally块来关闭输入流
         finally {
             try {
                 if (in != null) {
                     in.close();
                 }
             } catch (Exception e2) {
                 e2.printStackTrace();
             }
         }
         return result;
     }
     
     private static URLConnection  getURLConnection(String url,boolean ispost) throws IOException {
    	 URL realUrl = new URL(url);
         URLConnection conn = realUrl.openConnection();
         // 设置通用的请求属性
         conn.setRequestProperty("accept", "*/*");
         conn.setRequestProperty("connection", "Keep-Alive");
         conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
         // 发送POST请求必须设置如下两行
         if(ispost){
          conn.setDoOutput(true);
          conn.setDoInput(true);
         }
         return conn;
         
     }

     /**
      * 向指定 URL 发送POST方法的请求
      * 
      * @param url
      *            发送请求的 URL
      * @param param
      *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
      * @return 所代表远程资源的响应结果
      */
     public static String sendPost(String url, String param) {
         PrintWriter out = null;
         BufferedReader in = null;
         String result = "";
         try {
             // 打开和URL之间的连接
             URLConnection conn =getURLConnection(url,true);
             // 获取URLConnection对象对应的输出流
             out = new PrintWriter(conn.getOutputStream());
             // 发送请求参数
             out.print(param);
             // flush输出流的缓冲
             out.flush();
             // 定义BufferedReader输入流来读取URL的响应
             in = new BufferedReader(
                     new InputStreamReader(conn.getInputStream()));
             String line;
             while ((line = in.readLine()) != null) {
                 result += line;
             }
         } catch (Exception e) {
             System.out.println("发送 POST 请求出现异常！"+e);
             e.printStackTrace();
         }
         //使用finally块来关闭输出流、输入流
         finally{
             try{
                 if(out!=null){
                     out.close();
                 }
                 if(in!=null){
                     in.close();
                 }
             }
             catch(IOException ex){
                 ex.printStackTrace();
             }
         }
         return result;
     }

	  
}