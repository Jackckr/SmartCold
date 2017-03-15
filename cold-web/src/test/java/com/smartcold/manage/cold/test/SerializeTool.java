package com.smartcold.manage.cold.test;


import java.io.ByteArrayInputStream;  
import java.io.ByteArrayOutputStream;  
import java.io.FileNotFoundException;  
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.io.ObjectInputStream;  
import java.io.ObjectOutputStream;  
import java.util.Locale;  

public class SerializeTool {  

  /** 
   * 将传入的对象系列化后，存入参数string指定的文件，并将序列化后的对象转换成十六进制字符串返回 
   * @param object 可序列化的对象 
   * @param string 存储文件名 
   * @return string 序列化后的对象的十六进制字符串 
   * @throws FileNotFoundException 
   * @throws IOException 
   */  
  public static String writeObject(Object object, String strFile)  
          throws FileNotFoundException, IOException {  
        
      ByteArrayOutputStream baos = new ByteArrayOutputStream();  
      //用于将对象转换成byte[]数组的ObjectOutputStream  
      ObjectOutputStream oos = new ObjectOutputStream(baos);  
      //将对象写入ByteArrayOutputStream  
      oos.writeObject(object);  
      byte[] bytes = baos.toByteArray();  
      //用于将将对象存入文件的ObjectOutputStream  
      ObjectOutputStream oos2 = new ObjectOutputStream(new FileOutputStream(  
              strFile));  
      //将对象写入string指定的文件中  
      oos2.writeObject(object);  
      oos.close();  
      oos2.close();  
      baos.close();  
      return bytesToHexString(bytes);  

  }  

  /** 
   * 将序列化后且用十六进制字符表示的对象反序列化成对象 
   * @param hexString 序列化对象的十六进制表示形式的字符串 
   * @return 反序列化生成的对象 
   * @throws IOException 
   * @throws ClassNotFoundException 
   */  
  public static Object readObject(String hexString) throws IOException,  
          ClassNotFoundException {  
      byte[] bytes = hexStringToBytes(hexString);  
      ByteArrayInputStream bais = new ByteArrayInputStream(bytes);  
      ObjectInputStream ois = new ObjectInputStream(bais);  
      return ois.readObject();  
  }  

  /** 
   * 将传入的byte[]数组转换成十六机制数的字符串 
   * @param src 要转换的byte数组 
   * @return 返回十六进制的字符串 
   */  
  private static String bytesToHexString(byte[] src) {  
      StringBuilder stringBuilder = new StringBuilder("");  
      if (src == null || src.length <= 0) {  
          return null;  
      }  
      for (int i = 0; i < src.length; i++) {  
          int v = src[i] & 0xFF;  
          //将一个byte的二进制数转换成十六进制字符  
          String hv = Integer.toHexString(v);  
          //如果二进制数转换成十六进制数高位为0，则加入'0'字符  
          if (hv.length() < 2) {  
              stringBuilder.append(0);  
          }  
          stringBuilder.append(hv);  
      }  
      return stringBuilder.toString();  
  }  

  /** 
   * 将传进来的十六进制表示的字符串转换成byte数组 
   * @param hexString 
   * @return 二进制表示的byte[]数组 
   */  
  private static byte[] hexStringToBytes(String hexString) {  
      if (hexString == null || hexString.equals("")) {  
          return null;  
      }  
      hexString = hexString.toUpperCase(Locale.getDefault());  
      int length = hexString.length() / 2;  
      //将十六进制字符串转换成字符数组  
      char[] hexChars = hexString.toCharArray();  
      byte[] d = new byte[length];  
      for (int i = 0; i < length; i++) {  
          //一次去两个字符  
          int pos = i * 2;  
          //两个字符一个对应byte的高四位一个对应第四位  
          d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));  
      }  
      return d;  
  }  

  /** 
   * 将传进来的字符代表的数字转换成二进制数 
   * @param c 要转换的字符 
   * @return 以byte的数据类型返回字符代表的数字的二进制表示形式 
   */  
  private static byte charToByte(char c) {  
      return (byte) "0123456789ABCDEF".indexOf(c);  
  }  

}  
