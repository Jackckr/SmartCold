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
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.service.RdcService;
import com.smartcold.zigbee.manage.service.RdcShareService;
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
	private RdcService rdcService;
	@Autowired
	private RdcShareService rdcShareService;
	
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
	
	@RequestMapping(value = "/downLoadapk")
	@ResponseBody
	public void downLoadapk(HttpServletRequest request, HttpServletResponse response){
		try {
			this.downLoad(response,"apk/liankur.v1.0.3.apk",false);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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
