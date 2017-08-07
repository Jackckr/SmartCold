package com.smartcold.zigbee.manage.util;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.swing.ImageIcon;

import org.springframework.web.multipart.MultipartFile;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: 水印工具类,
 * Create on MaQiang 2017-6-25 09:28:36
 */
public class WatermarkUtil {
	public static final String MARK_TEXT = "链库";
	public static final String FONT_NAME = "微软雅黑";
	public static final int X = 10;
	public static final int Y = 10;
	public static float ALPHA = 0.3F;
	public static final int FONT_SIZE = 120;
	public static final int FONT_STYPE = Font.BOLD;
	public static final Color FONT_COLOR = Color.RED;

	private static final int iconX = 160;
	private static final int iconY = 86;
	private static final float alpha = 0.8f; // 透明度 
	private static final  double caling = 0.2; //缩放比例 
	private static Image iconimgImage=null;

	
   private static Image getImge() {
	   if(iconimgImage!=null){  return iconimgImage; }
	   try {
		   URL url =new URL("http://139.196.189.93:8089/app/logo.png");
		   ImageIcon imgIcon = new ImageIcon(url); // 得到Image对象。
		   iconimgImage =imgIcon.getImage();
		   return iconimgImage;
	   } catch (MalformedURLException e) {

	   }
	   return null;
   }
	
	public static InputStream watermarkImg(MultipartFile file) {
		InputStream inputStream =null;
		try {
			 inputStream = file.getInputStream();
			Image srcImg = ImageIO.read(inputStream);
			int width = srcImg.getWidth(null), height = srcImg.getHeight(null);
 			BufferedImage buffImg = new BufferedImage(width, height,BufferedImage.TYPE_INT_RGB);
			Graphics2D g = buffImg.createGraphics();
			// 设置对线段的锯齿状边缘处理
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g.drawImage(srcImg.getScaledInstance(width,height, Image.SCALE_SMOOTH), 0, 0,null);
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP,alpha));
			// 表示水印图片的位置
			int[] imgewh = getImgewh(height);
			g.drawImage(getImge(), width -imgewh[0]-20, height - imgewh[1]-20,imgewh[0],imgewh[1] ,null);
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
			g.dispose();
			ByteArrayOutputStream bs = new ByteArrayOutputStream();
			ImageOutputStream imOut = ImageIO.createImageOutputStream(bs);
			ImageIO.write(buffImg, "jpg", imOut);
			return  new ByteArrayInputStream(bs.toByteArray());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return inputStream;
	}

	public static InputStream watermarkFont(MultipartFile file) {
		InputStream inputStream =null;
		try {
			 inputStream = file.getInputStream();
			Image image2 = ImageIO.read(inputStream);
			int width = image2.getWidth(null);
			int height = image2.getHeight(null);
			BufferedImage bufferImage = new BufferedImage(width, height,BufferedImage.TYPE_INT_RGB);
			Graphics2D g = bufferImage.createGraphics();
			g.drawImage(image2, 0, 0, width, height, null);

			g.setFont(new Font(FONT_NAME, FONT_STYPE, FONT_SIZE));
			g.setColor(FONT_COLOR);
			int x = X,y = Y;
			int width1 = FONT_SIZE * getTextLength(MARK_TEXT),height1 = FONT_SIZE;
			int widthDiff = width - width1,heightDiff = height - height1;
			if (x > widthDiff) {	x = widthDiff;}
			if (y > heightDiff) {y = heightDiff;}
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP,ALPHA));
			g.drawString(MARK_TEXT, x, y + FONT_SIZE);
			g.dispose();
			
			ByteArrayOutputStream bs = new ByteArrayOutputStream();
			ImageOutputStream imOut = ImageIO.createImageOutputStream(bs);
			ImageIO.write(bufferImage, "jpg", imOut);
			return  new ByteArrayInputStream(bs.toByteArray());
		} catch (IOException e) {
			e.printStackTrace();
			return inputStream;
		}
	}

	private  static int getTextLength(String text) {
		int length = text.length();
		length = length % 2 == 0 ? length / 2 : length / 2 + 1;
		return length;
	}
	
	
	private static int[] getImgewh(int height){
    	int bl=	(int)(height*caling/iconY);
	    return new int[]{bl*iconX,iconY*bl};
	}
	
	
}
