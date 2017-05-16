package com.smartcold.manage.cold.api;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dto.DataResultDto;

/**
 * (DANFOSS)丹弗斯DEV数据接口
 * @author maqiang34
 *
 */
@Controller
public class DFSDataController extends BaseController {


	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/dfsDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object storageDataCollection(@RequestBody String data, HttpServletResponse response) {
		
		return new DataResultDto(200);
	} 
	
	


}
