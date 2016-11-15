package com.smartcold.zigbee.manage.controller;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dao.CommonMapper;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.service.RdcService;
import com.smartcold.zigbee.manage.service.RdcShareService;
import com.smartcold.zigbee.manage.service.impl.WebvistsService;
import com.smartcold.zigbee.manage.util.ResponseData;
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
	private RdcService rdcService;
	@Autowired
	private RdcShareService rdcShareService;
	
	/**
	 * 测试方法  
	 * @return
	 */
	@RequestMapping(value = "/getVisited")
	@ResponseBody
	public Object getVisited () {
		return WebvistsService.getCount();
	}
	
	@RequestMapping(value = "/setVisited")
	@ResponseBody
	public void setVisited (Integer type) {
		if(type!=null){ WebvistsService.addCount(type);}
	}
	
	
	/**
	 * 支持全文检索
	 * @param request
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value = "/searchdata")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> searchdata(HttpServletRequest request,String provinceid,String keyword) {
		HashMap<String, Object> alldata=new HashMap<String, Object>();
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("sstauts", 1);
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		PageInfo<RdcEntityDTO> rdcList = this.rdcService.getRDCList(1,10, filter);
		PageInfo<RdcShareDTO> sharList = this.rdcShareService.getSEListByRdcID(1, 10, filter);
		if(rdcList.getTotal()>0){alldata.put("rdcList", rdcList);}
		if(sharList.getTotal()>0){alldata.put("sharList", sharList);}
		if(alldata.size()>0){
			return ResponseData.newSuccess(alldata);
		}else{
			return ResponseData.newFailure("抱歉！暂时没有找到相关信息！");
		}
	}
	/**
	 * 版本控制器
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/downLoadapk")
	@ResponseBody
	public String downLoadapk(HttpServletRequest request, HttpServletResponse response){
		/**
		 * 为微信扫一扫做处理
		 * 为统计做处理
		 */
		this.commonMapper.updateDowCountbykye("vs_and_count");//更新下载次数
		//http://180.153.105.144/imtt.dd.qq.com/16891/796606D2D7EB792432DDAECCA2FEDE82.apk?mkey=58198488364bc481&f=188a&c=0&fsname=com.tencent.mobileqq_6.5.8_422.apk&csr=4d5s&p=.apk
		return " <script  type='text/javascript'> window.location.href='http://liankur.com/apk/liankur.v1.0.3.apk'</script>";
	}
	
	
	/**
	 * 文件下载
	 * @param filePath
	 * @param response
	 * @param isOnLine
	 * @throws Exception
	 */
	@RequestMapping(value = "/downLoad")
	@ResponseBody
	public void downLoad( HttpServletResponse response,String filePath, Boolean isOnLine) throws Exception {
        File f = new File(filePath);
        if (!f.exists()) {
            response.sendError(404, "File not found!");
            return;
        }
        BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
        byte[] buf = new byte[1024];
        int len = 0;

        response.reset(); // 非常重要
        if (isOnLine!=null&&isOnLine) { // 在线打开方式
            URL u = new URL("file:///" + filePath);
            response.setContentType(u.openConnection().getContentType());
            response.setHeader("Content-Disposition", "inline; filename=" + f.getName());
            // 文件名应该编码成UTF-8
        } else { // 纯下载方式
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename=" + f.getName());
        }
        OutputStream out = response.getOutputStream();
        while ((len = br.read(buf)) > 0)
            out.write(buf, 0, len);
        br.close();
        out.close();
    }
}
