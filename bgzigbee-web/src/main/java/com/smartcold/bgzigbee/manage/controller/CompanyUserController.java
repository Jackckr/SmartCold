package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyUserMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.CompanyUser;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by qiangzi on 2017/6/14.
 */
@Controller
@RequestMapping(value = "/companyUser")
public class CompanyUserController {
    @Autowired
    private CompanyUserMapper companyUserMapper;

    @RequestMapping(value = "/getByUserId",method = RequestMethod.POST)
    @ResponseBody
    public TableData getByUserId(int userId,int page,int rows){
        PageHelper.startPage(page,rows);
        List<CompanyUser> companyUsers = companyUserMapper.selectByUid(userId);
        return TableData.newSuccess(new PageInfo<CompanyUser>(companyUsers));
    }
}
