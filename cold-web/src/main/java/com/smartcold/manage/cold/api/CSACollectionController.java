package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * CS(便利店)数据协议接口
 * @author Administrator
 *
 */
@Controller
public class CSACollectionController extends BaseController {

	
	private static Gson gson = new Gson();
	private static List<String> cahceList=new ArrayList<String>();

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/CSDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object CSDataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(cahceList.size()>100){for (int i = 0; i < 50; i++) {
				cahceList.remove(i);
			} }
			cahceList.add(data);
			System.err.println("收到CS数据："+data);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到CS数据解析异常：\r\n"+data);
			return DataResultDto.newFailure();
		}
		return  DataResultDto.newSuccess();
	} 
	
	
	
}
