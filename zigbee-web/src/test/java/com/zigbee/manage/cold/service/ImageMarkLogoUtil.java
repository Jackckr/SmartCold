package com.zigbee.manage.cold.service;
/** 
 * Copyright (c) 2003-2007 Wonders Information Co.,Ltd. All Rights Reserved.
 * 5-6/F, 20 Bldg, 481 Guiping RD. Shanghai 200233,PRC
 *
 * This software is the confidential and proprietary information of Wonders Group.
 * (Research & Development Center). You shall not disclose such
 * Confidential Information and shall use it only in accordance with 
 * the terms of the license agreement you entered into with Wonders Group. 
 *
 * Distributable under GNU LGPL license by gun.org
 */

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.imageio.ImageIO;

/**
 * TODO(用一句话描述该文件做什么)
 * 
 * @Title: ImageMarkLogUtil.java
 * @Package com.wonders.cop.billing.util
 * @ClassName: ImageMarkLogUtil
 * @author YaoHang
 * @company Wonders Information Co.,Ltd.
 * @date 2014年11月6日 下午4:24:35
 * @version V1.0
 */
public class ImageMarkLogoUtil {
	// 水印透明度
	private static float alpha = 1f;
	// 水印横向位置
	private static int positionWidth = 82;
	// 水印纵向位置
	private static int positionHeight = 545;
	// 水印文字字体
	private static Font font = new Font("宋体", Font.PLAIN, 13);
	// 水印文字颜色
	private static Color color = Color.black;

	public static void main(String[] args) {
		String srcImgPath = "d:/888880002302900_web.jpg";
		String targerTextPath = "d:/qie_text.jpg";
	}

	public static Map testValue() {
		Map<String, String> value = new HashMap<String, String>();
		value.put("feedPrice", "15.1");
		value.put("feedCount", "20");
		value.put("nowNum", "124");
		value.put("drainageCount", "55");
		value.put("drainagePrice", "1.5");
		value.put("feedCost", "66");
		value.put("cost", "66");
		value.put("drainageCost", "100");
		value.put("barcode", "10101010101010101");
		value.put("nextCopy", "2014-12-10");
		value.put("waterType", "居民生活用水");
		value.put("meterReader", "测试人员");
		value.put("copyNumber", "741sg");
		value.put("prevCarryOver", "0.25");
		value.put("nowCarryOver", "2.12");
		value.put("openDate", "20141002");
		value.put("nextMonth", "201402 ");
		value.put("remark", "您缴付的2013年03月30.80元水费,我公司已收到,谢谢!");
		value.put("detailStatus", "00");
		value.put("billStatus", "00");
		value.put("prevMonth", "201406");
		value.put("lastPayDate", "20140112");
		value.put("companyName", "市北水");
		value.put("type", "1");
		value.put("amount", "58.1");
		value.put("address", "浦秀路220弄10号101");
		value.put("year","2014");
		value.put("month", "04");
		value.put("billId", "11111");
		value.put("account", "38445450");
		value.put("companyId", "888880002302900");
		value.put("realName", "姚航");
		return value;
	}

	/**
	 * 给图片添加水印文字、可设置水印文字的旋转角度
	 * 
	 * @param logoText
	 * @param srcImgPath
	 * @param targerPath
	 * @param degree
	 */
	public static void markImageByTexts(Map<String, String> value,
			Map<String, String[]> position, String srcImgPath, String targerPath) {

		InputStream is = null;
		OutputStream os = null;
		try {
			// 1、源图片
			Image srcImg = ImageIO.read(new File(srcImgPath));
			BufferedImage buffImg = new BufferedImage(srcImg.getWidth(null),
					srcImg.getHeight(null), BufferedImage.TYPE_INT_RGB);
			// 2、得到画笔对象
			
			Iterator<String> positionIter = position.keySet().iterator();
			String key = "";
			String logotext = "";
			String[] xy;
			while (positionIter.hasNext()) {
				key = positionIter.next();
				xy = position.get(key);
				logotext = value.get(key);
				System.out.println("key:"+key+",value:"+logotext);
				if (xy != null && xy.length == 2)
					printText(srcImg, buffImg, logotext,
							Integer.valueOf(xy[0]), Integer.valueOf(xy[1]));
			}
			// 10、生成图片
			os = new FileOutputStream(targerPath);
			ImageIO.write(buffImg, "JPG", os);

			System.out.println("图片完成添加水印文字");

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != is)
					is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			try {
				if (null != os)
					os.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 在图片上打印文字
	 * 
	 * @param srcImg
	 * @param buffImg
	 * @param logoText
	 * @return
	 */
	private static void printText(Image srcImg, BufferedImage buffImg,
			String logoText, Integer positionX, Integer PositionY) {
		Graphics2D g = buffImg.createGraphics();
		// 3、设置对线段的锯齿状边缘处理
		g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
				RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		g.drawImage(
				srcImg.getScaledInstance(srcImg.getWidth(null),
						srcImg.getHeight(null), Image.SCALE_SMOOTH), 0, 0, null);
		// 5、设置水印文字颜色
		g.setColor(color);
		// 6、设置水印文字Font
		g.setFont(font);
		// 7、设置水印文字透明度
		g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP,
				alpha));
		// 8、第一参数->设置的内容，后面两个参数->文字在图片上的坐标位置(x,y)
		g.drawString(logoText, positionX, PositionY);
		// 9、释放资源
		g.dispose();
	}
}
