package com.smartcold.manage.cold.util.socket;
import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.session.AttributeKey;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolEncoder;
import org.apache.mina.filter.codec.ProtocolEncoderAdapter;
import org.apache.mina.filter.codec.ProtocolEncoderOutput;
import org.apache.mina.filter.codec.textline.LineDelimiter;

/**
 * A {@link ProtocolEncoder} which encodes a string into a text line
 * which ends with the delimiter.
 *
 * @author <a href="http://mina.apache.org">Apache MINA Project</a>
 */
public class TextLineEncoder extends ProtocolEncoderAdapter {
    private static final AttributeKey ENCODER = new AttributeKey(TextLineEncoder.class, "encoder");

    private final Charset charset;

    private final LineDelimiter delimiter;

    private int maxLineLength = Integer.MAX_VALUE;

    /**
     * Creates a new instance with the current default {@link Charset}
     * and {@link LineDelimiter#UNIX} delimiter.
     */
    public TextLineEncoder() {
        this(Charset.defaultCharset(), LineDelimiter.UNIX);
    }

    /**
     * Creates a new instance with the current default {@link Charset}
     * and the specified <tt>delimiter</tt>.
     * 
     * @param delimiter The line delimiter to use
     */
    public TextLineEncoder(String delimiter) {
        this(new LineDelimiter(delimiter));
    }

    /**
     * Creates a new instance with the current default {@link Charset}
     * and the specified <tt>delimiter</tt>.
     * 
     * @param delimiter The line delimiter to use
     */
    public TextLineEncoder(LineDelimiter delimiter) {
        this(Charset.defaultCharset(), delimiter);
    }

    /**
     * Creates a new instance with the specified <tt>charset</tt>
     * and {@link LineDelimiter#UNIX} delimiter.
     * 
     * @param charset The {@link Charset} to use
     */
    public TextLineEncoder(Charset charset) {
        this(charset, LineDelimiter.UNIX);
    }

    /**
     * Creates a new instance with the specified <tt>charset</tt>
     * and the specified <tt>delimiter</tt>.
     * 
     * @param charset The {@link Charset} to use
     * @param delimiter The line delimiter to use
     */
    public TextLineEncoder(Charset charset, String delimiter) {
        this(charset, new LineDelimiter(delimiter));
    }

    /**
     * Creates a new instance with the specified <tt>charset</tt>
     * and the specified <tt>delimiter</tt>.
     * 
     * @param charset The {@link Charset} to use
     * @param delimiter The line delimiter to use
     */
    public TextLineEncoder(Charset charset, LineDelimiter delimiter) {
        if (charset == null) {
            throw new IllegalArgumentException("charset");
        }
        if (delimiter == null) {
            throw new IllegalArgumentException("delimiter");
        }
        if (LineDelimiter.AUTO.equals(delimiter)) {
            throw new IllegalArgumentException("AUTO delimiter is not allowed for encoder.");
        }

        this.charset = charset;
        this.delimiter = delimiter;
    }

    /**
     * @return the allowed maximum size of the encoded line.
     * If the size of the encoded line exceeds this value, the encoder
     * will throw a {@link IllegalArgumentException}.  The default value
     * is {@link Integer#MAX_VALUE}.
     */
    public int getMaxLineLength() {
        return maxLineLength;
    }

    /**
     * Sets the allowed maximum size of the encoded line.
     * If the size of the encoded line exceeds this value, the encoder
     * will throw a {@link IllegalArgumentException}.  The default value
     * is {@link Integer#MAX_VALUE}.
     * 
     * @param maxLineLength The maximum line length
     */
    public void setMaxLineLength(int maxLineLength) {
        if (maxLineLength <= 0) {
            throw new IllegalArgumentException("maxLineLength: " + maxLineLength);
        }

        this.maxLineLength = maxLineLength;
    }

    /**
     * {@inheritDoc}
     */
    public void encode(IoSession session, Object message, ProtocolEncoderOutput out) throws Exception {
        CharsetEncoder encoder = (CharsetEncoder) session.getAttribute(ENCODER);

        if (encoder == null) {
            encoder = charset.newEncoder();
            session.setAttribute(ENCODER, encoder);
        }

        String value = (message == null ? "" : message.toString());
        IoBuffer buf = IoBuffer.allocate(value.length()).setAutoExpand(true);
        buf.putString(value, encoder);

        if (buf.position() > maxLineLength) {
            throw new IllegalArgumentException("Line length: " + buf.position());
        }

        buf.putString(delimiter.getValue(), encoder);
        buf.flip();
        out.write(buf);
    }

    /**
     * {@inheritDoc}
     */
    public void dispose() throws Exception {
        // Do nothing
    }
}