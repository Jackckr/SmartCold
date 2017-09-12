package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.AppointmentMapper;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;



@Controller
@RequestMapping(value = "/appointment")
public class AppointmentController extends BaseController {

   @Resource
   private AppointmentMapper dao;
   
    @RequestMapping(value = "/updatByIds", method = RequestMethod.POST)
	@ResponseBody
	public boolean updatByIds(int[] ids,int status,String commit) {
	if(ids==null||ids.length==0){return false;}
    	try {
			this.dao.updatByIds(StringUtil.getIdS(ids),commit,status );
            return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
    @RequestMapping(value = "/delByIds", method = RequestMethod.POST)
    @ResponseBody
    public boolean delByIds(int[] ids) {
    	try {
    		this.dao.delByIds(StringUtil.getIdS(ids));
    		return true;
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return false;
    }
   
	@RequestMapping(value = "/getList", method = RequestMethod.POST)
	@ResponseBody
	public TableData<HashMap<String, Object>> getList(Integer status,int     page,int     rows) {
		PageHelper.startPage(page, rows);
		Page<HashMap<String, Object>> dataPageList = dao.getList(status);
		return TableData.newSuccess(new PageInfo<HashMap<String, Object>>(dataPageList));
	}



}
