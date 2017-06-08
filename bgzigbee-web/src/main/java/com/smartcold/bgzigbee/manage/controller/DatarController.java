package com.smartcold.bgzigbee.manage.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.stereotype.Controller;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.entity.StorageDataCollectionEntity;
import com.smartcold.bgzigbee.manage.sc360.dao.StorageDataCollectionMapper;
import com.smartcold.bgzigbee.manage.util.ResponseData;
import com.smartcold.bgzigbee.manage.util.TableData;


/**
 * 设备数据查询
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/Data")
public class DatarController extends BaseController {

	@Autowired
	private StorageDataCollectionMapper dataserver;
	
	
	/**
	 * 查询设备数据
	 * @param request
	 * @param pageNum
	 * @param pageSize
	 * @param dataType
	 * @param apid
	 * @param deviceid
	 * @param key
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value = "/findDEVDataByFilter", method = RequestMethod.POST)
	@ResponseBody
	public Object findDEVDataByFilter(HttpServletRequest request,Boolean desc, Integer  page,Integer rows,Integer dataType,String apid,String devid,String key,String startTime, String endTime) {
		try {
			if( request.getSession().getAttribute("admin")==null){ return ResponseData.newFailure("401");}//无效登录
			if(page==null||rows==null||dataType==null||key!=null&&key.length()>15){return ResponseData.newFailure("400");}//参数无效
			Page<StorageDataCollectionEntity> dataHashMaps=null;
			switch (dataType) {
			case 1:
				PageHelper.startPage(page, rows);
				dataHashMaps = this.dataserver.findAPByFilter(apid, key, startTime, endTime,desc);
				break;
			case 2:
				PageHelper.startPage(page, rows);
				dataHashMaps=this.dataserver.findDVByFilter(apid, devid, key, startTime, endTime,desc);
				break;
			case 3:
				PageHelper.startPage(page, rows);
				dataHashMaps=this.dataserver.findDTByFilter(apid, devid, key, startTime, endTime,desc);
				break;
			default:
				break;
			}
			PageInfo<StorageDataCollectionEntity> datas=	new PageInfo<StorageDataCollectionEntity>(dataHashMaps);
			return TableData.newSuccess(datas);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return TableData.newFailure("0");
	}
	
	/**
	 * 查询设备数据
	 * @param request
	 * @param pageNum
	 * @param pageSize
	 * @param dataType
	 * @param apid
	 * @param deviceid
	 * @param key
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/findDataByFilter", method = RequestMethod.POST)
	@ResponseBody
	public Object findAPByFilter(HttpServletRequest request,int pageNum,int pageSize,int dataType, String apid,String devid,String key,Integer desc,String startTime, String endTime) {
		try {
			if( request.getSession().getAttribute("admin")==null){ return ResponseData.newFailure("-1");}
			if(key!=null&&key.length()>15){return ResponseData.newFailure("!!!");}
			Page<StorageDataCollectionEntity> dataHashMaps=null;
			switch (dataType) {
			case 1:
				dataHashMaps = this.dataserver.findAPByFilter(apid, key, startTime, endTime,true);
				break;
			case 2:
				dataHashMaps=this.dataserver.findDVByFilter(apid, devid, key, startTime, endTime,true);
				break;
			case 3:
				PageHelper.startPage(pageNum, pageSize);
				dataHashMaps=this.dataserver.findDTByFilter(apid, devid, key, startTime, endTime,true);
				break;
			default:
				break;
			}
			PageInfo<StorageDataCollectionEntity> datas=	new PageInfo<StorageDataCollectionEntity>(dataHashMaps);
			return ResponseData.newSuccess(datas);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("0");
	}
	
	
}
