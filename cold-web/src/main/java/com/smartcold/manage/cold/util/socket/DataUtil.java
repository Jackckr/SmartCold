package com.smartcold.manage.cold.util.socket;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.mina.core.buffer.IoBuffer;

import com.smartcold.manage.cold.util.socket.entity.APInfo;
import com.smartcold.manage.cold.util.socket.entity.DevInfo;
import com.smartcold.manage.cold.util.socket.entity.DevStateInfo;
import com.smartcold.manage.cold.util.socket.entity.PwcInfo;
import com.smartcold.manage.cold.util.socket.entity.SwthInfo;
import com.smartcold.manage.cold.util.socket.entity.TempInfo;


/** 
 * 此类为北京中威数据解析接口
 * 请勿修改任何字符。。
* Provides utility methods to dump an {@link IoBuffer} into a hex formatted string. 
* 
* @author maqiang34 2017-3-24 16:35:50
*/  
public class DataUtil {  
 
	


	
   /** 
    * The high digits lookup table. 
    */  
   private static final byte[] highDigits;  
 
   /** 
    * The low digits lookup table. 
    */  
   private static final byte[] lowDigits;  
 
   /** 
    * Initialize lookup tables. 
    */  
   static {  
       int i;  
       byte[] high = new byte[256];  
       byte[] low = new byte[256];  
       final byte[] digits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };  
       for (i = 0; i < 256; i++) {  
           high[i] = digits[i >>> 4];//无符号右移，左边空出的位以0填充 ；右移  
           low[i] = digits[i & 0x0F];  
       }  
 
       highDigits = high;  
       lowDigits = low;  
   }  
 
   /** 
    * 字符串转换成十六进制字符串
    */  
   public static String str2HexStr(String str) {  
       char[] chars = "0123456789ABCDEF".toCharArray();  
       StringBuilder sb = new StringBuilder("");
       byte[] bs = str.getBytes();  
       int bit;  
       for (int i = 0; i < bs.length; i++) {  
           bit = (bs[i] & 0x0f0) >> 4;  
           sb.append(chars[bit]);  
           bit = bs[i] & 0x0f;  
           sb.append(chars[bit]);  
       }  
       return sb.toString();  
   } 
   private static int toByte(char c) {
       byte b = (byte) "0123456789ABCDEF".indexOf(c);
       return b;
    }
   public static byte[] hexStringToByte(String hex) {
   	   int len = (hex.length() / 2);
   	   byte[] result = new byte[len];
   	   char[] achar = hex.toCharArray();
   	   for (int i = 0; i < len; i++) {
   	    int pos = i * 2;
   	    result[i] = (byte) (toByte(achar[pos]) << 4 | toByte(achar[pos + 1]));
   	   }
   	   return result;
   	  }
   /** 
    * Dumps an {@link IoBuffer} to a hex formatted string. 
    *  
    * @param in the buffer to dump 
    * @param lengthLimit the limit at which hex dumping will stop 
    * @return a hex formatted string representation of the <i>in</i> {@link Iobuffer}. 
    */  
   public static String getHexdump(IoBuffer in, int lengthLimit) {  
       if (lengthLimit == 0) {   throw new IllegalArgumentException("lengthLimit: " + lengthLimit   + " (expected: 1+)");   }  
       boolean truncate = in.remaining() > lengthLimit;  
       int size;  
       if (truncate) {  
           size = lengthLimit;  
       } else {  
           size = in.remaining();  
       }  
       if (size == 0) {    return "";    }  
       StringBuilder out = new StringBuilder(size * 3 + 3);  
       int mark = in.position();  
       // fill the first  
       int byteValue = in.get() & 0xFF;  
       out.append((char) highDigits[byteValue]);  
       out.append((char) lowDigits[byteValue]);  
       size--;  
       // and the others, too  
       for (; size > 0; size--) {  
//           out.append(' ');  
           byteValue = in.get() & 0xFF;  
           out.append((char) highDigits[byteValue]);  
           out.append((char) lowDigits[byteValue]);  
       }  
       in.position(mark);  
       if (truncate) { 
//    	   out.append("..."); 数据超过最大值限制 需AP分流
       }  
       return out.toString();  
   }  
   public static BigDecimal pasBigDecimal(int type,int length,StringBuffer  buffer){
	   String val = buffer.substring(0,length);buffer.delete(0, length);
	   return BigDecimal.valueOf(Long.parseLong(val.trim(), 16)); 
   }
	public static float pasfloat(int type,int length,StringBuffer  buffer){
		 String val = buffer.substring(0,length);buffer.delete(0, length);
		 return Float.intBitsToFloat(Integer.valueOf(val.trim(), type)); 
	}

	public static Long pasLong(int length,StringBuffer  buffer){
		String val = buffer.substring(0,length);buffer.delete(0, length);
		return Long.parseLong(val,16); 
	}
	
	public static  int pasint(int type,int length,StringBuffer  buffer){
		String val = buffer.substring(0,length);buffer.delete(0, length);
		switch (type) {
		case 2:
			return Integer.parseInt(val);  
		case 8:
			return Integer.parseInt(val, 16);  
		default:
			return -1;
		}
	}
   
	public static DevStateInfo getDevStateInfo(String str){
		try {
			StringBuffer data = new StringBuffer(str);
			Long sLong = System.currentTimeMillis();
			DevStateInfo info = DevStateInfo.getInstance();
			info.setType(pasint(2, 2, data));// //包的类型，0数据包 1状态包
			info.setApid(pasint(8, 8, data));// //apid
			info.setMSI(pasint(2, 2, data));// //移动信号强度，0~10,10最高
			info.setLAC(pasint(8, 8, data)); // 基站位置信息LAC
			info.setCID(pasint(8, 8, data));// /基站位置信息CID
			info.setDevCnt(pasint(8, 4, data));
			if (data.length() == (info.getDevCnt() * 26 + 8)) {// 校验数据长度
				List<DevInfo> devInfos = new ArrayList<DevInfo>();
				int devid = 0, BSI = 0;
				float SU = 0;
				Long time = null;// time
				while (data.length() >= 20) {
					try {
						devid = pasint(8, 8, data);// devid
						BSI = pasint(2, 2, data);// BSI
						SU = pasfloat(16, 8, data);// su
						time = pasLong( 8, data);// time
						devInfos.add(new DevInfo(devid, BSI, SU, time));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				info.setDevInfos(devInfos);
				info.setTime(pasLong( 8, data));
				Long end = System.currentTimeMillis();
				System.err.println("解析结束,用时:" + (end - sLong));
				return info;
		    }else{
		    	return null;
		    }
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static APInfo getAPDataInfo(String str){
		try {
			StringBuffer data=new StringBuffer(str);
			Long sLong=System.currentTimeMillis();
			APInfo info = APInfo.getInstance();
			info.setType(pasint(2,2,data));// //包的类型，0数据包 1状态包 
			info.setApid(pasint(8,8,data));// //apid
			info.setTver(pasint(2,4,data));//版本 2表示2.0版，自定
	    	int sensorType=	pasint(2,2,data);
	    	int count=  pasint(2,4,data);
		    info.setSensorType(sensorType); //传感器设备类型，1温度，2门，3电量
		    info.setSensorItemCnt(count);
		    if(sensorType==1){
			    if(data.length()==(count*24+8)){//校验数据长度
			    	List<TempInfo> tempList=new ArrayList<TempInfo>();
			    	System.err.println("开始解析-{温度}-数据内容=====================");
			    	int devid = 0;float temp    = 0;Long time  = null;//time
			    	 while (data.length()>=20) {
				    	 devid = pasint(8,8,data);//devid
				    	 temp = pasfloat(16,8,data);//devid
				    	 time = pasLong(8,data);//time
				    	 tempList.add(new TempInfo(devid,temp , time ));
					 }
			    	 info.setTempInfos(tempList);
			    	 System.err.println("解析数据完成=====================");
			    }else{
			    	return null;
			    }
		    }else if(sensorType==2){
		    	if(data.length()==(count*18+8)){//校验数据长度
			    	List<SwthInfo> swthInfos=new ArrayList<SwthInfo>();
			    	int devid = 0;int swth    = 0;Long time  = null;//time
			    	System.err.println("开始解析-{门}-数据内容=====================");
			    	 while (data.length()>=20) {
				    	 devid = pasint(8,8,data);//devid
				    	 swth = pasint(2,2,data);//devid
				    	 time = pasLong(8,data);//time
				    	 swthInfos.add(new SwthInfo(devid,swth,time));
					}
			    	 info.setSwthInfos(swthInfos);
			    	 System.err.println("解析数据完成=====================");
			    }else{
			    	return null;
			    }
		    	
		    }else if(sensorType==3){
		    	if(data.length()==(count*72+8)){//校验数据长度
			    	List<PwcInfo> pwcInfos=new ArrayList<PwcInfo>();
			    	int devid; float pwc,au, bu,cu, ai, bi, ci;  long time; //电量采集时间
			    	System.err.println("开始解析-{电量}-数据内容=====================");
			    	 while (data.length()>=20) {
				    	 devid = pasint(8,8,data);//devid
				    	 pwc = pasfloat(16,8,data);//
				    	 au = pasfloat(16,8,data);
				    	 bu = pasfloat(16,8,data);
				    	 cu = pasfloat(16,8,data);
				    	 ai = pasfloat(16,8,data);
				    	 bi = pasfloat(16,8,data);
				    	 ci = pasfloat(16,8,data);
				    	 time = pasLong(8,data);//time
				    	 pwcInfos.add(new PwcInfo(devid, pwc, au, bu, cu, ai, bi, ci, time));
					}
			    	 info.setPwcInfos(pwcInfos);
			    	 System.err.println("解析数据完成=====================");
			    	 info.setPwcInfos(pwcInfos);
			    }else{
			    	return null;
			    }
		    }
			info.setTime(pasLong(8,data));
			Long end=System.currentTimeMillis();
			System.err.println("解析结束,用时:"+(end-sLong));
			return info;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
   
}  