package com.smartcold.bgzigbee.manage.controller.store360;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.store360.CompanyStoreMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.store360.CompanyStoreEntity;
import com.smartcold.bgzigbee.manage.util.TableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

/**
 * Created by qiangzi on 2017/9/14.
 */
@Controller
@RequestMapping(value = "/companyStore")
public class CompanyStoreController {
    @Autowired
    private CompanyStoreMapper companyStoreMapper;


    @RequestMapping(value = "/findCompanyList", method = RequestMethod.POST)
    @ResponseBody
    public Object findCompanyList(int page, int rows, String keyword) {
        PageHelper.startPage(page, rows);
        PageInfo pageInfo=new PageInfo<CompanyStoreEntity>(companyStoreMapper.findCompanyByWords(keyword));
        return TableData.newSuccess(pageInfo);
    }

    @RequestMapping(value = "/findCompanyById")
    @ResponseBody
    public Object findCompanyById(@RequestParam(value = "companyId", required = false) Integer companyId) {
        CompanyStoreEntity company = companyStoreMapper.selectByPrimaryKey(companyId);
        return company;
    }

    @RequestMapping(value = "/addCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object addCompany(CompanyStoreEntity company) throws UnsupportedEncodingException {
        if (company.getName() == null) {
            return new ResultDto(-1, "集团名称不能为空");
        }
        company.setName(URLDecoder.decode(company.getName(), "UTF-8"));
        company.setAddress(URLDecoder.decode(company.getAddress(), "UTF-8"));
        company.setAddtime(new Date());
        companyStoreMapper.insertCompany(company);
        return new BaseDto(0);
    }
    @RequestMapping(value = "/updateCompanyById", method = RequestMethod.POST)
    @ResponseBody
    public Object updateCompanyById(CompanyStoreEntity company) {
        companyStoreMapper.updateByPrimaryKeySelective(company);
        return new ResultDto(1,"修改成功！");
    }

    @RequestMapping(value = "/deleteCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteAdmin(int companyID) {
        companyStoreMapper.deleteCompany(companyID);
        return new BaseDto(0);
    }

    @RequestMapping(value = "/deleteByCompanyIDs")
    @ResponseBody
    public Object deleteByCompanyIDs(Integer[] companyIDs) {
        for (Integer companyID : companyIDs) {
            companyStoreMapper.deleteCompany(companyID);
        }
        return new BaseDto(0);
    }
}
