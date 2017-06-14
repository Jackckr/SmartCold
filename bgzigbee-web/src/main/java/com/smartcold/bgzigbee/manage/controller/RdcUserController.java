package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.RdcUserMapper;
import com.smartcold.bgzigbee.manage.entity.RdcUser;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by qiangzi on 2017/6/13.
 */
@Controller
@RequestMapping(value = "/rdcUser")
public class RdcUserController {
    @Autowired
    private RdcUserMapper rdcUserMapper;

    @RequestMapping(value = "/getRdcUserByUserId",method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcUserByUserId(int userId,int page,int rows){
        PageHelper.startPage(page, rows);
        List<RdcUser> rdcUserList = rdcUserMapper.getByRUID(userId);
        return TableData.newSuccess(new PageInfo<RdcUser>(rdcUserList));
    }

    @RequestMapping(value = "/getRdcUserByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public Object getRdcUserByRdcId(int rdcId,int page,int rows){
        PageHelper.startPage(page, rows);
        List<RdcUser> rdcUserList = rdcUserMapper.getByRdcID(rdcId);
        return TableData.newSuccess(new PageInfo<RdcUser>(rdcUserList));
    }
}
