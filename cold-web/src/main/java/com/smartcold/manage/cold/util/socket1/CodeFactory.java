package com.smartcold.manage.cold.util.socket1;

import java.nio.charset.Charset;

import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.apache.mina.filter.codec.ProtocolDecoder;
import org.apache.mina.filter.codec.ProtocolEncoder;
//import org.apache.mina.filter.codec.textline.TextLineDecoder;
//import org.apache.mina.filter.codec.textline.TextLineEncoder;
public class CodeFactory implements ProtocolCodecFactory {
    private final MyProtocalDecoder encoder;
    private final MyProtocalEncoder decoder;
    
    
    public CodeFactory() {
        this(Charset.forName("utf-8"));
    }
    public CodeFactory(Charset charset) {
        encoder = new MyProtocalDecoder(charset);
        decoder = new MyProtocalEncoder(charset);
    }
//    public ProtocolDecoder getDecoder(IoSession arg0) throws Exception {
//        return decoder;
//    }
//    public ProtocolEncoder getEncoder(IoSession arg0) throws Exception {
//        return encoder;
//    }
//    public int getEncoderMaxLineLength() {
//        return encoder.getMaxLineLength();
//    }
//    public void setEncoderMaxLineLength(int maxLineLength) {
//        encoder.setMaxLineLength(maxLineLength);
//    }
//    public int getDecoderMaxLineLength() {
//        return decoder.getMaxLineLength();
//    }
//    public void setDecoderMaxLineLength(int maxLineLength) {
//        decoder.setMaxLineLength(maxLineLength);
//    }
//    
//    public void setBufferLength(int bufferLength) {
//    	decoder.setBufferLength(bufferLength);
//    }
	@Override
	public ProtocolEncoder getEncoder(IoSession session) throws Exception {
		// TODO Auto-generated method stub
		return this.decoder;
	}
	@Override
	public ProtocolDecoder getDecoder(IoSession session) throws Exception {
		// TODO Auto-generated method stub
		return this.encoder;
	}
}
