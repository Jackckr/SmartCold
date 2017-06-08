package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.SystemInformMapper;
import com.smartcold.bgzigbee.manage.util.StringUtil;
import com.smartcold.bgzigbee.manage.util.TableData;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/systemInform")
public class SystemInformController {

    @Autowired
    private SystemInformMapper systemInformMapper;

    
    
    @RequestMapping(value = "/getSysMsgByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<HashMap<String, Object>> getSysMsgByFilter(Integer type,Integer stype, Integer state, Integer isRead,String  keyword,String sort,String order, int  page,int rows) {
    	if(StringUtil.isnotNull(keyword)){keyword = "%" + keyword + "%";}else{keyword=null;}
    	PageHelper.startPage(page, rows);
    	Page<HashMap<String, Object>> systemInformList = this.systemInformMapper.getSystemInform(type, stype, isRead, state, keyword);
    	return TableData.newSuccess(new PageInfo<HashMap<String, Object>>(systemInformList) );
    }
    @RequestMapping(value = "/changeSysMsgStatus", method = RequestMethod.POST)
    @ResponseBody
    public boolean changeSysMsgStatus(Integer id, Integer isRead,Integer state) {
    	try {
			this.systemInformMapper.changeSysMsgStatus(id,  isRead,state);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return false;
    }
    
    
    /**
     * 在新的系統上线后去掉
     * @param type
     * @param stype
     * @param status
     * @param isRead
     * @param keyword
     * @param pageNum
     * @param pageSize
     * @return
     */
    @Deprecated
    @RequestMapping(value = "/getSystemInform", method = RequestMethod.POST)
    @ResponseBody
    public Page<HashMap<String, Object>> getObjByType(
    		Integer type,
    		Integer stype, 
    		Integer status, 
    		Integer isRead,
    		String  keyword, 
    		int     pageNum,
    		 int     pageSize) {
       if(StringUtil.isnotNull(keyword)){
            keyword = "%" + keyword + "%";
        }else{
        	keyword=null;
        }
        PageHelper.startPage(pageNum, pageSize);
        Page<HashMap<String, Object>> systemInformList = this.systemInformMapper.getSystemInform(type, stype, isRead, status, keyword);
        return  systemInformList;
    }

    @RequestMapping(value = "/getNewSystemInform", method = RequestMethod.POST)
    @ResponseBody
    public Object getNewSystemInform(@RequestParam(value = "id", required = false) Integer id) {
        if (id != null) { systemInformMapper.changeIsRead(id); }
        return systemInformMapper.getNoReadSystemInform();
    }

    @RequestMapping(value = "/manageSystemInform", method = RequestMethod.POST)
    @ResponseBody
    public void manageSystemInform(@RequestParam(value = "id", required = false) Integer id,
                                   @RequestParam(value = "checkId", required = false) String checkId) {
        if (id != null) {
            systemInformMapper.changeState(id);
        }
        if (checkId != null){
            String[] idArr = checkId.split(",");
            for (int i = 0; i < idArr.length; i++) {
                systemInformMapper.changeState(Integer.parseInt(idArr[i]));
            }
        }
    }
    @RequestMapping(value = "/getSystemInformInfo", method = RequestMethod.POST)
    @ResponseBody
    public Object getSystemInformInfo(@RequestParam(value = "id", required = false) Integer id) {
        return systemInformMapper.getSystemInformByID(id);
    }
}
