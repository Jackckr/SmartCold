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

    
    @RequestMapping(value = "/getMsgType", method = RequestMethod.POST)
    @ResponseBody
    public String getMsgType(){
        return "[{\"id\":1,\"type\":0,\"text\":\"系统消息\",\"children\":[{\"id\":11,\"stype\":0,\"iconCls\":\"icon-remove\",\"text\":\"系统消息\"}]},{\"id\":2,\"type\":1,\"text\":\"系统通知\",\"children\":[{\"id\":21,\"stype\":1,\"text\":\"系统通知\"},{\"id\":22,\"stype\":2,\"text\":\"DEV重置通知\"},{\"id\":23,\"stype\":3,\"text\":\"冷库认证通知\"},{\"id\":24,\"stype\":4,\"text\":\"冷库绑定通知\"},{\"id\":25,\"stype\":5,\"text\":\"冷库认证服务商通知\"},{\"id\":26,\"stype\":6,\"text\":\"冷库绑定货主通知\"}]},{\"id\":3,\"type\":2,\"text\":\"系统告警\",\"children\":[{\"id\":31,\"stype\":1,\"text\":\"DEV断线告警\"},{\"id\":32,\"stype\":2,\"text\":\"DEV低电量告警\"},{\"id\":33,\"stype\":3,\"text\":\"DEV配置异常告警\"}]}]";
    }
    
    @RequestMapping(value = "/getSysByFilter", method = RequestMethod.POST)
    @ResponseBody
    public TableData<HashMap<String, Object>> getSysByFilter(Integer type,Integer stype, Integer state, Integer isRead,String  keyword,String sort,String order, int  page,int rows) {
    	if(StringUtil.isnotNull(keyword)){keyword = "%" + keyword + "%";}else{keyword=null;}
    	PageHelper.startPage(page, rows);
    	Page<HashMap<String, Object>> systemInformList = this.systemInformMapper.getSystemInform(type, stype, isRead, state, keyword);
    	return TableData.newSuccess(new PageInfo<HashMap<String, Object>>(systemInformList) );
    }
    
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
        if (id != null) {
            systemInformMapper.changeIsRead(id);
        }
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
