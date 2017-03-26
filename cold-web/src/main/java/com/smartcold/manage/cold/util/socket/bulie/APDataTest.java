package com.smartcold.manage.cold.util.socket.bulie;

import org.apache.mina.core.buffer.IoBuffer;

import com.smartcold.manage.cold.util.socket.DataUtil;
import com.smartcold.manage.cold.util.socket.entity.APInfo;

public class APDataTest {
	
	private static void temp(){
		try {
			String temp = "00"+"0000000C"+"0001"+"01"+"0008"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+ "0000000C48CC4D4F58BE944D"
					+"58D252E0";
			
			
			APInfo ap = DataUtil.getAPDataInfo(temp);
			System.err.println(ap.getApid());
			System.err.println(ap.getSensorType());
			System.err.println(ap.getTempInfos().size());
		
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private  static void swiths(){
		try {
			String temp = "00"+"0000000C"+"0001"+"02"+"0007"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+ "0000000C0058BE53E9"
					+"58D252E0";
			APInfo ap = DataUtil.getAPDataInfo(temp);
			System.err.println(ap.getApid());
			System.err.println(ap.getSensorType());
			System.err.println(ap.getSwthInfos().size());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private  static void pwc(){
		try {
			String temp = "00"+"0000000C"+"0001"+"03"+"0001"
					+"0000000C3E800000435C3AE1435D4000435C8F5C3E6147AE3DCED9173E6353F858BE5445"					
					+"58D252E0";
			APInfo ap = DataUtil.getAPDataInfo(temp);
			System.err.println(ap.getApid());
			System.err.println(ap.getSensorType());
			System.err.println(ap.getPwcInfos().size());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
	
		
		
//		String msg = type+(System.currentTimeMillis()+"").substring(0, 10);
//    	int type1=Integer.parseInt(type);
////		int length=msg.length()/2;
////		byte[] bts = new byte[length];
//			byte[] bts = {(byte)type1,(byte)0X58,(byte)0XD1,(byte)0XE2,(byte)0X60};
////		for (int i = 0; i < length; i++) {
////			IoBuffer buffer2 = IoBuffer.allocate(16);
////			buffer2.put(bts2);
////			buffer2.flip();
////			bts[i]=(Byte)(Integer.parseInt(msg.substring(0,2));
////			msg=msg.substring(2);
////		}
//		IoBuffer buffer = IoBuffer.allocate(16);
//		buffer.put(bts);
//		buffer.flip();
	}
}
