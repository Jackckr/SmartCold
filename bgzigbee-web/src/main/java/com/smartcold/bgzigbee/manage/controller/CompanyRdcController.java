package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.sc360.dao.CompanyRdcMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.CompanyRdc;
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
@RequestMapping(value = "/companyRdc")
public class CompanyRdcController {
    @Autowired
    private CompanyRdcMapper companyRdcMapper;

    @RequestMapping(value = "/getByRdcId",method = RequestMethod.POST)
    @ResponseBody
    public TableData getByRdcId(int rdcId, int page, int rows){
        PageHelper.startPage(page,rows);
        List<CompanyRdc> companyRdcs = companyRdcMapper.findByRdcId(rdcId);
        return TableData.newSuccess(new PageInfo<CompanyRdc>(companyRdcs));
    }

    @RequestMapping(value = "/getByCompanyId",method = RequestMethod.POST)
    @ResponseBody
    public TableData getByCompanyId(int companyId, int page, int rows){
        PageHelper.startPage(page,rows);
        List<CompanyRdc> companyRdcs = companyRdcMapper.findByCompanyId(companyId);
        return TableData.newSuccess(new PageInfo<CompanyRdc>(companyRdcs));
    }
}
