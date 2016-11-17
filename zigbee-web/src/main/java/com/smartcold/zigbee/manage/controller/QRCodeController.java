package com.smartcold.zigbee.manage.controller;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import jp.sourceforge.qrcode.QRCodeDecoder;
import jp.sourceforge.qrcode.data.QRCodeImage;
import jp.sourceforge.qrcode.exception.DecodingFailedException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.swetake.util.Qrcode;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QRCodeController 二维码条形码解析工具 
 * Create on MaQiang 2016-6-25 09:28:36
 */
@Controller
@RequestMapping(value = "/QRCodeController")
public class QRCodeController   {
	  public static int max_data_size_small = 84;  
	  public static int max_data_size_large = 500; 
	 /** 
     * 解析二维码（QRCode） 
     * @param imgPath 图片路径 
     * @return 
     */  
	@RequestMapping(value = "/getDecoderQRCode")
	@ResponseBody
    public String getDecoderQRCode(String imgPath) {  
        File imageFile = new File(imgPath);      // QRCode 二维码图片的文件  
        BufferedImage bufImg = null;  
        String content = null;  
        try {  
            bufImg = ImageIO.read(imageFile);  
            QRCodeDecoder decoder = new QRCodeDecoder();  
            content = new String(decoder.decode(new TwoDimensionCodeImage(bufImg)), "utf-8");   
        } catch (IOException e) {  
            System.out.println("Error: " + e.getMessage());  
            e.printStackTrace();  
        } catch (DecodingFailedException dfe) {  
            System.out.println("Error: " + dfe.getMessage());  
            dfe.printStackTrace();  
        }  
        return content;  
    } 
	
    /** 
     * 解析二维码（QRCode） 
     * @param input 输入流 
     * @return 
     */
	@RequestMapping(value = "/expDecoderQRCode")
	@ResponseBody
    public String expDecoderQRCode(InputStream input) {  
        BufferedImage bufImg = null;  
        String content = null;  
        try {  
            bufImg = ImageIO.read(input);  
            QRCodeDecoder decoder = new QRCodeDecoder();  
            content = new String(decoder.decode(new TwoDimensionCodeImage(bufImg)), "utf-8");   
        } catch (IOException e) {  
            System.out.println("Error: " + e.getMessage());  
            e.printStackTrace();  
        } catch (DecodingFailedException dfe) {  
            System.out.println("Error: " + dfe.getMessage());  
            dfe.printStackTrace();  
        }  
        return content;  
    }  
	
	
	 /** 
     *  
     * @param srcValue 
     * @param qrcodePicfilePath 
     * @return 
     */  
    public static boolean encode(String srcValue, String qrcodePicfilePath) {  
        return  encode_84(srcValue, qrcodePicfilePath);  
    }  
      
    /** 
     * Encoding the information to a QRCode, size of the information must be less than 84 byte. 
     * @param srcValue 
     * @param qrcodePicfilePath 
     * @return 
     */  
    public static boolean encode_84(String srcValue, String qrcodePicfilePath) {  
        int MAX_DATA_LENGTH = max_data_size_small; // 限制生成二维码的数据最大大小  
        byte[] d = srcValue.getBytes();  
        int dataLength = d.length;  
        int imageWidth = 113; /* 113是预先计算出来的. 注意：图像宽度必须比生成的二维码图像宽度大,至少相等,否则,二维码识别不出来 */  
        int imageHeight = imageWidth;  
        BufferedImage bi = new BufferedImage(imageWidth, imageHeight,  
                BufferedImage.TYPE_INT_RGB);  
        Graphics2D g = bi.createGraphics();  
        g.setBackground(Color.WHITE);  
        g.clearRect(0, 0, imageWidth, imageHeight);  
        g.setColor(Color.BLACK);  
        if (dataLength > 0 && dataLength <= MAX_DATA_LENGTH) {  
            /* 生成二维码 */  
            Qrcode qrcode = new Qrcode();  
            qrcode.setQrcodeErrorCorrect('M'); // L, Q, H, 默认  
            qrcode.setQrcodeEncodeMode('B'); // A, N, 默认  
            qrcode.setQrcodeVersion(5); // 37字节, (37-1)*3+2+3-1+1 = 113  
            boolean[][] b = qrcode.calQrcode(d);  
            int qrcodeDataLen = b.length;  
            for (int i = 0; i < qrcodeDataLen; i++) {  
                for (int j = 0; j < qrcodeDataLen; j++) {  
                    if (b[j][i]) {  
                        g.fillRect(j * 3 + 2, i * 3 + 2, 3, 3); 
                    }  
                }  
            }  
            System.out.println("二维码数据长度(字节):" + qrcodeDataLen);  
        } else {  
            System.out.println("Generate QRCode image error! Data size is " + dataLength +", it is lager than 84 bytes.");  
            return false;  
        }  
        g.dispose();  
        bi.flush();  
        /* generate image */  
        File f = new File(qrcodePicfilePath);  
        String suffix = f.getName().substring(f.getName().indexOf(".")+1, f.getName().length());  
        try {  
            ImageIO.write(bi, suffix, f); //"png"  
        } catch (IOException ioe) {  
            System.out.println("Generate QRCode image error!" + ioe.getMessage());  
            return false;  
        }  
  
        return true;  
    }  
      
    /** 
     * Encoding the information to a QRCode, size of the information must be less tah 500 byte. 
     * @param srcValue 
     * @param qrcodePicfilePath 
     * @return 
     */  
    public static boolean encode_500(String srcValue, String qrcodePicfilePath) {  
        int MAX_DATA_LENGTH = max_data_size_large; // 限制生成二维码的数据最大大小. 500字节的原始数据, 生成二维码时, 是89宽度  
        byte[] d = srcValue.getBytes();  
        int dataLength = d.length;  
        int imageWidth = 269; /* 269是预先计算出来的. 注意：图像宽度必须比生成的二维码图像宽度大,至少相等,否则,二维码识别不出来 */  
        int imageHeight = imageWidth;  
        BufferedImage bi = new BufferedImage(imageWidth, imageHeight,  
                BufferedImage.TYPE_INT_RGB);  
        Graphics2D g = bi.createGraphics();  
        g.setBackground(Color.WHITE);  
        g.clearRect(0, 0, imageWidth, imageHeight);  
        g.setColor(Color.BLACK);  
        if (dataLength > 0 && dataLength <= MAX_DATA_LENGTH) {  
            /* 生成二维码 */  
            Qrcode qrcode = new Qrcode();  
            qrcode.setQrcodeErrorCorrect('M'); // L, Q, H, 默认  
            qrcode.setQrcodeEncodeMode('B'); // A, N, 默认  
            qrcode.setQrcodeVersion(18); // 0<= version <=40; 89字节,  
                                            // (89-1)*3+2+3-1+1 = 269  
            boolean[][] b = qrcode.calQrcode(d);  
            int qrcodeDataLen = b.length;  
            for (int i = 0; i < qrcodeDataLen; i++) {  
                for (int j = 0; j < qrcodeDataLen; j++) {  
                    if (b[j][i]) {  
                        g.fillRect(j * 3 + 2, i * 3 + 2, 3, 3);
                    }  
                }  
            }  
            System.out.println("二维码数据长度(字节):" + qrcodeDataLen);  
        } else {  
            return false;  
        }  
        g.dispose();  
        bi.flush();  
        /* generate image */  
        File f = new File(qrcodePicfilePath);  
        String suffix = f.getName().substring(f.getName().indexOf(".")+1, f.getName().length());  
        System.out.println(suffix);  
        try {  
            ImageIO.write(bi, suffix, f); //"png"  
        } catch (IOException ioe) {  
            System.out.println("Generate QRCode image error!" + ioe.getMessage());  
            return false;  
        }  
  
        return true;  
    }  
      
    /** 
     * decode qrcode image. 
     * @param qrcodePicfilePath 
     * @return decoding value. 
     */  
    public static String decode(String qrcodePicfilePath) {  
        /* 读取二维码图像数据 */  
        File imageFile = new File(qrcodePicfilePath);  
        BufferedImage image = null;  
        try {  
            image = ImageIO.read(imageFile);  
        } catch (IOException e) {  
            System.out.println("Decoding failed, read QRCode image error: " + e.getMessage());  
            return null;  
        }  
        /* 解二维码 */  
        QRCodeDecoder decoder = new QRCodeDecoder();  
        String decodedData = new String(decoder.decode(new TwoDimensionCodeImage(image)));  
        return decodedData;  
    }  
    
	public static void main(String[] args) {
		String path = "E:/A.jpg";
		String data = "家常菜郭林林家常菜郭林家常菜郭林郭林家常菜郭林家常菜郭林家常菜郭林郭林家常菜郭林郭林";
		System.out.println("字节数: " + data.getBytes().length);
		encode(data, path);
		System.out.println(decode("A.JPG"));

		QRCodeDecoder decoder = new QRCodeDecoder();
		File imageFile = new File(path);
		BufferedImage image = null;
		try {
			image = ImageIO.read(imageFile);
		} catch (IOException e) {
			System.out.println("Error: " + e.getMessage());
		}
		System.out.println("识别二维码");
		String decodedData = new String(
				decoder.decode(new TwoDimensionCodeImage(image)));
		System.out.println(decodedData);
	}
  
}
class TwoDimensionCodeImage implements QRCodeImage { 
    BufferedImage bufImg;
    public TwoDimensionCodeImage() { } 
    public TwoDimensionCodeImage(BufferedImage bufImg) { this.bufImg = bufImg;  } 
    public int getWidth() { return bufImg.getWidth(); } 
    public int getHeight() { return bufImg.getHeight();  } 
    public int getPixel(int x, int y) {    return bufImg.getRGB(x, y);  } 
} 
