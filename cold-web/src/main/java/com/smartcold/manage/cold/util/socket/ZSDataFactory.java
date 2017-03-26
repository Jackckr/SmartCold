package com.smartcold.manage.cold.util.socket;

import java.nio.charset.Charset;

import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.apache.mina.filter.codec.ProtocolDecoder;
import org.apache.mina.filter.codec.ProtocolEncoder;
import org.apache.mina.filter.codec.textline.LineDelimiter;
//import org.apache.mina.filter.codec.textline.TextLineEncoder;
//import org.apache.mina.filter.codec.textline.TextLineDecoder;

public class ZSDataFactory implements ProtocolCodecFactory {
    private final TextLineEncoder encoder;
    private final TextLineDecoder decoder;
    
    
    public ZSDataFactory() {
        this(Charset.forName("utf-8"));
    }
    public ZSDataFactory(Charset charset) {
        encoder = new TextLineEncoder(charset,LineDelimiter.UNIX);
        decoder = new TextLineDecoder(charset, LineDelimiter.AUTO);
    }
    public ProtocolDecoder getDecoder(IoSession arg0) throws Exception {
        return decoder;
    }
    public ProtocolEncoder getEncoder(IoSession arg0) throws Exception {
        return encoder;
    }
    public int getEncoderMaxLineLength() {
        return encoder.getMaxLineLength();
    }
    public void setEncoderMaxLineLength(int maxLineLength) {
        encoder.setMaxLineLength(maxLineLength);
    }
    public int getDecoderMaxLineLength() {
        return decoder.getMaxLineLength();
    }
    public void setDecoderMaxLineLength(int maxLineLength) {
        decoder.setMaxLineLength(maxLineLength);
    }
    
    public void setBufferLength(int bufferLength) {
    	decoder.setBufferLength(bufferLength);
    }
}
