package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * WT数据协议接口
 * @author Administrator
 *
 */
@Controller
public class SPACollectionController extends BaseController {

	
	private static List<String> cahceList=new ArrayList<String>();
	

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/SPADataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object SPADataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			if(cahceList.size()>100){for (int i = 0; i < 50; i++) {
				cahceList.remove(i);
			} }
			cahceList.add(data);
			System.err.println("收到SPA数据："+data);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到SPA数据解析异常：\r\n"+data);
			return new DataResultDto(500);
		}
		return new DataResultDto(200);
	} 
	
	@RequestMapping(value = "/getSPAData", method = RequestMethod.POST)
	@ResponseBody
	public Object SPADataCollection() {
		return cahceList;
	} 
	
}
