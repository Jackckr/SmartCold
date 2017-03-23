package com.smartcold.manage.cold.util.socket;

import org.apache.mina.core.buffer.IoBuffer;


/** 
* Provides utility methods to dump an {@link IoBuffer} into a hex formatted string. 
* 
* @author <a href="http://mina.apache.org">Apache MINA Project</a> 
*/  
class IoBufferHexDumper {  
 
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
       final byte[] digits = { '0', '1', '2', '3', '4', '5', '6', '7', '8',  
               '9', 'A', 'B', 'C', 'D', 'E', 'F' };  
 
       int i;  
       byte[] high = new byte[256];  
       byte[] low = new byte[256];  
 
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
       if (lengthLimit == 0) {  
           throw new IllegalArgumentException("lengthLimit: " + lengthLimit  
                   + " (expected: 1+)");  
       }  
 
       boolean truncate = in.remaining() > lengthLimit;  
       int size;  
       if (truncate) {  
           size = lengthLimit;  
       } else {  
           size = in.remaining();  
       }  
 
       if (size == 0) {  
           return "empty";  
       }  
 
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
           out.append("...");  
       }  
 
       return out.toString();  
   }  
   
   public static void main(String[] args) {
	System.err.println(str2HexStr(""));
}
}  