package com.smartcold.manage.cold.util.socket;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Map;

import org.apache.mina.core.buffer.IoBuffer;
import org.springframework.util.ObjectUtils;

public class CC {
	
	

	
 public static void main(String[] args)throws Exception {

	 
	 SocketStatus status = new SocketStatus();
//		status.type.set(00);
//		status.time.set(1490167337);
	 
		
	 
//     System.out.println(bytes2HexStr(message.getByteBuffer().array()," "));
     
byte[] bytes=new byte[4];
for(int i=0;i<4;i++){
    bytes[i]=(byte) i;
  }
status.setByteBuffer(ByteBuffer.wrap(bytes),0);
	


}
 



}
