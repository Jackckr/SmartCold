package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.CompanyMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;

@Controller
@RequestMapping(value = "/company")
public class CompanyController extends BaseController {

    @Autowired
    private CompanyMapper companyDao;

    @RequestMapping(value = "/findCompanyList", method = RequestMethod.POST)
    @ResponseBody
    public Object findCompanyList(@RequestParam(value = "pageNum", required = false) Integer pageNum,
                                  @RequestParam(value = "pageSize") Integer pageSize,
                                  @RequestParam(value = "keyword", required = false) String keyword) {
        pageNum = pageNum == null ? 1 : pageNum;
        pageSize = pageSize == null ? 12 : pageSize;
        PageHelper.startPage(pageNum, pageSize);
        return new PageInfo<Company>(companyDao.findAllCompany(keyword));
    }

    @RequestMapping(value = "/deleteCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteAdmin(int companyID) {
        companyDao.deleteCompany(companyID);
        return new BaseDto(0);
    }

    @RequestMapping(value = "/deleteByCompanyIDs", method = RequestMethod.DELETE)
    @ResponseBody
    public Object deleteByCompanyIDs(Integer[] companyIDs) {
        for (Integer companyID : companyIDs) {
            companyDao.deleteCompany(companyID);
        }
        return new BaseDto(0);
    }

    @RequestMapping(value = "/addCompany", method = RequestMethod.GET)
    @ResponseBody
    public Object addCompany(Company company) throws UnsupportedEncodingException {
        if (company.getName() == null) {
            return new ResultDto(-1, "集团名称不能为空");
        }
        company.setName(URLDecoder.decode(company.getName(), "UTF-8"));
        company.setAddress(URLDecoder.decode(company.getAddress(), "UTF-8"));
        company.setAddtime(new Date());
        companyDao.insertSelective(company);
        return new BaseDto(0);
    }

    @ResponseBody
    @RequestMapping(value = "/checkCompanyName", method = RequestMethod.GET)
    public Object checkCompanyName(@RequestParam("value") String companyname) {
        companyname = StringUtils.trimAllWhitespace(companyname);
        NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
        ngRemoteValidateDTO.setValid(companyDao.findCompanyByName(companyname) == null ? true : false);
        return ngRemoteValidateDTO;
    }

}
