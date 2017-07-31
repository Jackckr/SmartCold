package com.smartcold.manage.cold.api;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dao.newdb.DevStatusMapper;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * YT(便利店)数据协议接口
 * @author Administrator
 *
 */
@Controller
public class YTCollectionController extends BaseController {

	
	@Autowired
	public   DevStatusMapper devplset;
	
	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;

	

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/YTDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object YTDataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			System.err.println("收到YT数据："+data);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"YT检测到数据解析异常：\r\n"+data);
			return new DataResultDto(500);
		}
		return new DataResultDto(200);
	} 
	
}
