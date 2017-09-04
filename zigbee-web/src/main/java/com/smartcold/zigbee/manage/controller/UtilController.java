package com.smartcold.zigbee.manage.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.CommonMapper;
import com.smartcold.zigbee.manage.service.impl.WebvistsService;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类->全文检索
 * Create on MaQiang 2016-6-25 09:28:36
 */
@Controller
@RequestMapping(value = "/UtilController")
public class UtilController   {
	
	@Autowired
	private CommonMapper commonMapper;
	@Autowired
	private RedisCacheManager redisCacheManager;
	
	
	
	/**
	 * 更新模块
	 * @param type
	 */
	@RequestMapping(value = "/setVisited")
	@ResponseBody
	public void setVisited (Integer type) {
		if(type!=null){ WebvistsService.addCount(type);}
	}
	
	/**
	 * 更新模块
	 * @param type
	 */
	@RequestMapping(value = "/removeCahe")
	@ResponseBody
	public void removeCahe(HttpServletRequest request,String key, Integer type,Integer oid) {
	  System.err.println(request.getAttribute("apikey"));	
	}
	
	
	
	/**
	 * 为微信扫一扫做处理
	 * 为统计做处理
	 */
	@RequestMapping(value = "/downLoadapk")
	@ResponseBody
	public String downLoadapk(HttpServletRequest request, HttpServletResponse response){
		this.commonMapper.updateDowCountbykye("vs_and_count");//更新下载次数
		return " <script  type='text/javascript'> window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.example.yananxu.smartcold'</script>";
	}
	/**
	 * 为微信扫一扫做处理
	 * 为统计做处理
	 */
	@RequestMapping(value = "/downLoadios")
	@ResponseBody
	public String downLoadios(HttpServletRequest request, HttpServletResponse response){
		this.commonMapper.updateDowCountbykye("vs_ios_count");//更新下载次数
		return " <script  type='text/javascript'> window.location.href='https://itunes.apple.com/us/app/%E9%93%BE%E5%BA%93/id1142867105?l=zh&ls=1&mt=8'</script>";
	}
	

//	/**
//	 * 文件下载
//	 * @param filePath
//	 * @param response
//	 * @param isOnLine
//	 * @throws Exception
//	 */
//	@RequestMapping(value = "/downLoad")
//	@ResponseBody
//	public void downLoad( HttpServletResponse response,String filePath, Boolean isOnLine) throws Exception {
//        File f = new File(filePath);
//        if (!f.exists()) {
//            response.sendError(404, "File not found!");
//            return;
//        }
//        BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
//        byte[] buf = new byte[1024];
//        int len = 0;
//
//        response.reset(); // 非常重要
//        if (isOnLine!=null&&isOnLine) { // 在线打开方式
//            URL u = new URL("file:///" + filePath);
//            response.setContentType(u.openConnection().getContentType());
//            response.setHeader("Content-Disposition", "inline; filename=" + f.getName());
//            // 文件名应该编码成UTF-8
//        } else { // 纯下载方式
//            response.setContentType("application/x-msdownload");
//            response.setHeader("Content-Disposition", "attachment; filename=" + f.getName());
//        }
//        OutputStream out = response.getOutputStream();
//        while ((len = br.read(buf)) > 0)
//            out.write(buf, 0, len);
//        br.close();
//        out.close();
//    }
//	
}
